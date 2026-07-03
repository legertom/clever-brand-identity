#!/usr/bin/env python3
"""Inspect fonts in a PowerPoint file without guessing.

This script reads the PPTX package directly as OOXML. It reports:

- theme major/minor Latin fonts
- explicit typefaces declared in slide/layout/master/notes XML
- how much live slide text exists
- optional OCR evidence from rendered slide pages for flattened decks

It uses only Python's standard library for PPTX parsing. OCR is optional and
requires `soffice`, `pdftoppm`, and `tesseract` on PATH.
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import tempfile
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any
from zipfile import ZipFile
from xml.etree import ElementTree as ET

A_NS = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
TEXT_TAG = f"{A_NS}t"
LATIN_TAG = f"{A_NS}latin"
FONT_TAG = f"{A_NS}font"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Inspect PPTX font evidence.")
    parser.add_argument("pptx", type=Path, help="Path to a .pptx file")
    parser.add_argument("--json", action="store_true", help="Emit JSON instead of text")
    parser.add_argument(
        "--ocr",
        action="store_true",
        help="Render the PPTX and run OCR to inspect flattened slide artwork",
    )
    parser.add_argument(
        "--ocr-pages",
        default="16,35,36,38,39,40",
        help="Comma-separated 1-based slide pages to OCR when --ocr is set",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    pptx = args.pptx.expanduser().resolve()
    if not pptx.exists():
        raise SystemExit(f"Missing PPTX: {pptx}")

    report = inspect_pptx(pptx)
    if args.ocr:
        pages = [int(value.strip()) for value in args.ocr_pages.split(",") if value.strip()]
        report["ocr"] = run_ocr(pptx, pages)

    if args.json:
        print(json.dumps(report, indent=2, ensure_ascii=False))
    else:
        print_text_report(report)

    return 0


def inspect_pptx(pptx: Path) -> dict[str, Any]:
    with ZipFile(pptx) as archive:
        xml_files = [name for name in archive.namelist() if name.endswith(".xml")]
        theme_files = [name for name in xml_files if name.startswith("ppt/theme/")]
        slide_files = sorted(
            [name for name in xml_files if re.match(r"ppt/slides/slide\d+\.xml$", name)],
            key=lambda name: int(re.search(r"slide(\d+)\.xml$", name).group(1)),
        )

        theme_fonts = []
        explicit_typefaces: Counter[str] = Counter()
        explicit_by_file: dict[str, Counter[str]] = {}
        live_text_by_slide: dict[str, list[str]] = {}

        for theme_file in theme_files:
            root = ET.fromstring(archive.read(theme_file))
            theme_fonts.append(extract_theme_fonts(theme_file, root))

        for xml_file in xml_files:
            if not is_presentation_text_context(xml_file):
                continue
            root = ET.fromstring(archive.read(xml_file))
            file_counter = Counter(extract_typefaces(root))
            if file_counter:
                explicit_by_file[xml_file] = file_counter
                explicit_typefaces.update(file_counter)

        for slide_file in slide_files:
            root = ET.fromstring(archive.read(slide_file))
            texts = [node.text.strip() for node in root.iter(TEXT_TAG) if node.text and node.text.strip()]
            live_text_by_slide[slide_file] = texts

    return {
        "pptx": str(pptx),
        "themeFonts": theme_fonts,
        "explicitTypefaceCounts": dict(explicit_typefaces.most_common()),
        "explicitTypefacesByFile": {
            name: dict(counter.most_common()) for name, counter in sorted(explicit_by_file.items())
        },
        "slideCount": len(live_text_by_slide),
        "liveTextSlides": summarize_live_text(live_text_by_slide),
        "interpretation": [
            "Theme fonts and explicit typefaces are the live editable PowerPoint font metadata.",
            "If liveTextSlides only contains footers or slide numbers, the guideline pages are flattened artwork and their visible font guidance must be read from rendered slides, not from OOXML typeface metadata.",
        ],
    }


def is_presentation_text_context(xml_file: str) -> bool:
    return xml_file.startswith(
        (
            "ppt/slides/",
            "ppt/slideLayouts/",
            "ppt/slideMasters/",
            "ppt/notesSlides/",
            "ppt/notesMasters/",
            "ppt/theme/",
        )
    )


def extract_theme_fonts(theme_file: str, root: ET.Element) -> dict[str, str]:
    font_scheme = next((node for node in root.iter(f"{A_NS}fontScheme")), None)
    result = {"file": theme_file, "majorLatin": "", "minorLatin": ""}
    if font_scheme is None:
        return result

    for child in font_scheme:
        if child.tag == f"{A_NS}majorFont":
            latin = child.find(LATIN_TAG)
            result["majorLatin"] = latin.attrib.get("typeface", "") if latin is not None else ""
        if child.tag == f"{A_NS}minorFont":
            latin = child.find(LATIN_TAG)
            result["minorLatin"] = latin.attrib.get("typeface", "") if latin is not None else ""
    return result


def extract_typefaces(root: ET.Element) -> list[str]:
    fonts: list[str] = []
    for node in root.iter():
        if node.tag in {LATIN_TAG, FONT_TAG}:
            typeface = node.attrib.get("typeface")
            if typeface:
                fonts.append(typeface)
    return fonts


def summarize_live_text(live_text_by_slide: dict[str, list[str]]) -> list[dict[str, Any]]:
    rows = []
    for slide_file, texts in live_text_by_slide.items():
        if texts:
            rows.append(
                {
                    "slide": int(re.search(r"slide(\d+)\.xml$", slide_file).group(1)),
                    "textCount": len(texts),
                    "sample": texts[:8],
                }
            )
    return rows


def run_ocr(pptx: Path, pages: list[int]) -> dict[str, Any]:
    required = ["soffice", "pdftoppm", "tesseract"]
    missing = [name for name in required if shutil.which(name) is None]
    if missing:
        return {"error": f"Missing OCR dependencies: {', '.join(missing)}"}

    with tempfile.TemporaryDirectory(prefix="pptx-font-ocr-") as tmp:
        tmp_path = Path(tmp)
        profile = tmp_path / "lo-profile"
        profile.mkdir()
        convert_cmd = [
            "soffice",
            f"-env:UserInstallation={profile.as_uri()}",
            "--headless",
            "--convert-to",
            "pdf",
            "--outdir",
            str(tmp_path),
            str(pptx),
        ]
        subprocess.run(convert_cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        pdfs = list(tmp_path.glob("*.pdf"))
        if not pdfs:
            return {"error": "LibreOffice did not produce a PDF"}

        pages_dir = tmp_path / "pages"
        pages_dir.mkdir()
        subprocess.run(
            ["pdftoppm", "-png", "-r", "180", str(pdfs[0]), str(pages_dir / "page")],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )

        page_text: dict[str, str] = {}
        for page_number in pages:
            image_path = pages_dir / f"page-{page_number:02d}.png"
            if not image_path.exists():
                page_text[str(page_number)] = "[rendered page not found]"
                continue
            result = subprocess.run(
                ["tesseract", str(image_path), "stdout", "--psm", "6"],
                check=False,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
            )
            page_text[str(page_number)] = result.stdout.decode("utf-8", errors="replace").strip()

        font_hits = detect_font_mentions("\n".join(page_text.values()))
        return {"pages": page_text, "fontMentions": font_hits}


def detect_font_mentions(text: str) -> list[str]:
    candidates = [
        "ABC Arizona Mix",
        "Messina Sans",
        "Euclid Circular B",
        "Merriweather",
        "Inter",
        "PT Serif",
        "Manrope",
        "Martel",
        "Plus Jakarta Sans",
        "Arial",
    ]
    normalized = re.sub(r"\s+", " ", text)
    return [candidate for candidate in candidates if re.search(re.escape(candidate), normalized, re.I)]


def print_text_report(report: dict[str, Any]) -> None:
    print(f"PPTX: {report['pptx']}")
    print("\nTheme fonts:")
    for item in report["themeFonts"]:
        print(f"- {item['file']}: majorLatin={item['majorLatin']!r}, minorLatin={item['minorLatin']!r}")

    print("\nExplicit typefaces in PPTX XML:")
    for font, count in report["explicitTypefaceCounts"].items():
        print(f"- {font}: {count}")

    print(f"\nSlides with live text: {len(report['liveTextSlides'])} of {report['slideCount']}")
    for row in report["liveTextSlides"][:20]:
        sample = " | ".join(row["sample"])
        print(f"- slide {row['slide']}: {row['textCount']} text nodes: {sample}")
    if len(report["liveTextSlides"]) > 20:
        print(f"- ... {len(report['liveTextSlides']) - 20} more")

    if "ocr" in report:
        print("\nOCR font mentions:")
        ocr = report["ocr"]
        if "error" in ocr:
            print(f"- {ocr['error']}")
        else:
            for font in ocr["fontMentions"]:
                print(f"- {font}")
            print("\nOCR page text:")
            for page, text in ocr["pages"].items():
                print(f"\n--- PAGE {page} ---")
                print(text)

    print("\nInterpretation:")
    for item in report["interpretation"]:
        print(f"- {item}")


if __name__ == "__main__":
    raise SystemExit(main())
