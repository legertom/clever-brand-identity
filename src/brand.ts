export type BrandSection =
  | "messaging"
  | "voice"
  | "logo"
  | "color"
  | "typography"
  | "photography"
  | "graphic-expression"
  | "icons"
  | "product-illustrations"
  | "checklist";

type ColorToken = {
  name: string;
  slug: string;
  hex: string;
  rgb?: string;
  cmyk?: string;
  pantone?: string;
  usage: string;
};

type Section = {
  key: BrandSection;
  title: string;
  body: string[];
};

const FALLBACK_BASE_URL = "https://clever-brand-identity.vercel.app";

export const brandData = {
  name: "Clever Brand Identity",
  source: {
    file: "Clever Brand Guidelines - V7 AUG2025.pptx",
    visibleDeckVersion: "V6 - October 2024",
    extractedOn: "2026-07-03",
    verifiedOn: "2026-07-13",
    note:
      "Derived from the rendered slides of the Clever brand guideline deck (a Google Slides export whose slides are flattened images). Typography and type-setting values were verified directly against the rendered typography slides. The source deck's example photos and illustrations are not redistributed here."
  },
  positioning: {
    categoryStatement: "Clever is the platform powering digital learning for schools.",
    mission: "Connect every student to a world of learning.",
    currentMission: "Clever is on a mission to unlock new ways to learn for all students.",
    headline: "Where digital learning works.",
    companyDescription:
      "We securely connect the data and applications that schools rely on to make digital learning work better, for everyone.",
    vision: "To advance education with technology that works for students everywhere.",
    narrativePillars: ["Connect anything", "Secure everything", "Choose freely", "Access for all"]
  },
  fonts: {
    heading: {
      family: "ABC Arizona Mix",
      style: "Regular",
      foundry: "Dinamo",
      classification: "Soft, neat serif with humanistic character forms",
      usage:
        "Headings only, and only in Regular. Use at large sizes whenever possible to maximize contrast with body copy. Use the standard character set (the 'a' with the ascender)."
    },
    body: {
      family: "Messina Sans",
      style: "Book",
      foundry: "Luzi Type Foundry",
      classification: "Modern geometric sans serif",
      usage: "Descriptive text and body copy only."
    },
    logoConstruction: {
      family: "Euclid Circular B",
      usage: "Used to create the Clever logotype. Use official logo assets; do not recreate the logo from type."
    },
    fallbacks: {
      policy:
        "Only use fall-back fonts when the brand fonts are unavailable, such as strict systems where custom fonts cannot be loaded. All fall-backs are Google Fonts.",
      pairs: [
        { heading: "Merriweather", body: "Inter" },
        { heading: "PT Serif", body: "Manrope" },
        { heading: "Martel", body: "Plus Jakarta Sans" }
      ]
    },
    licensing: {
      summary:
        "ABC Arizona Mix (Dinamo) and Messina Sans (Luzi Type Foundry) are commercial typefaces. This service cannot host or redistribute their font files: type foundries license fonts per site/seat, and redistributing the binaries from a public endpoint would be unlicensed distribution to every visitor. Even a Clever font license would not extend to third-party apps built against this service. Each app that ships the real brand fonts needs its own license (or coverage under Clever's), and should self-host the licensed files.",
      practicalDefault:
        "The generated tokens and CSS name the licensed families first and wire the deck's approved Google fall-backs (open licenses) so apps render on-brand out of the box. Swap in licensed font files when available."
    },
    provenanceNote:
      "Do not infer brand typography from the PPTX file's internal metadata. The deck is a Google Slides export: its theme XML declares Arial and it embeds Proxima Nova/Inter/Merriweather for slide chrome. The normative brand fonts are the ones documented on the rendered typography slides (ABC Arizona Mix, Messina Sans)."
  },
  typeSetting: {
    alignment: "Typography should only ever be left-aligned. Never right-align or force-justify typography.",
    case:
      "Always use sentence case. The first word in a sentence is written with a capital letter, all subsequent words with a small letter.",
    tracking: "Tracking is 0%. Do not change this value in any case.",
    styles: [
      {
        name: "Display headlines",
        font: "ABC Arizona Mix",
        weight: "Regular",
        leadingPercent: 95,
        kerning: "optical",
        trackingPercent: 0,
        cssLineHeight: 0.95
      },
      {
        name: "Subheaders and short paragraphs",
        font: "ABC Arizona Mix",
        weight: "Regular",
        leadingPercent: 95,
        kerning: "auto",
        trackingPercent: 0,
        cssLineHeight: 0.95
      },
      {
        name: "Body copy",
        font: "Messina Sans",
        weight: "Book",
        leadingPercent: 135,
        kerning: "auto",
        trackingPercent: 0,
        cssLineHeight: 1.35
      }
    ]
  },
  colors: {
    primary: [
      {
        name: "Clever blue",
        slug: "blue",
        hex: "#1464FF",
        rgb: "20, 100, 255",
        cmyk: "92, 61, 0, 0",
        pantone: "2132",
        usage: "Primary corporate blue and logo color."
      },
      { name: "White", slug: "white", hex: "#FFFFFF", rgb: "255, 255, 255", usage: "Primary background and reversed logo fill." },
      {
        name: "Dark navy",
        slug: "dark-navy",
        hex: "#0A1E46",
        rgb: "10, 30, 70",
        cmyk: "86, 57, 0, 73",
        pantone: "2767",
        usage: "Dark background and high-contrast brand field."
      }
    ] satisfies ColorToken[],
    secondary: [
      { name: "Black", slug: "black", hex: "#1C1C1C", rgb: "28, 28, 28", usage: "Text color only." },
      { name: "Light blue", slug: "light-blue", hex: "#DAEBFF", rgb: "218, 235, 255", usage: "Light background fill." },
      { name: "Yellow", slug: "yellow", hex: "#FFE478", rgb: "255, 228, 120", usage: "Shape fill and tag color." },
      { name: "Orange", slug: "orange", hex: "#F78239", rgb: "247, 130, 57", pantone: "2025", usage: "Shape fill and tag color." },
      { name: "Green", slug: "green", hex: "#4ECC97", rgb: "78, 204, 151", usage: "Shape fill and tag color." }
    ] satisfies ColorToken[],
    // Product UI palette, deck slide "Color Palette" (printed hex labels).
    productUi: [
      { name: "UI background black", slug: "background-black", hex: "#1C1C1C", usage: "Product background option." },
      { name: "UI background gray", slug: "background-gray", hex: "#C2C7D1", usage: "Product background option." },
      { name: "UI background mist", slug: "background-mist", hex: "#EBECF2", usage: "Product background option." },
      {
        name: "UI background white-blue",
        slug: "background-white-blue",
        hex: "#FAFBFC",
        usage:
          "Product background option. The deck mislabels this swatch '#1464FF'; #FAFBFC is the pixel-sampled rendered value. Confirm with Clever brand before relying on it."
      },
      { name: "UI black", slug: "black", hex: "#1C1C1C", usage: "Product text and foreground." },
      { name: "UI gray", slug: "gray", hex: "#D3D6DE", usage: "Foreground support." },
      { name: "UI light blue", slug: "light-blue", hex: "#DAEBFF", usage: "Foreground support." },
      { name: "UI periwinkle", slug: "periwinkle", hex: "#A8C9FF", usage: "Foreground support." },
      { name: "UI navy", slug: "navy", hex: "#0A1E46", usage: "Foreground support." },
      { name: "Portal header blue", slug: "portal-header-blue", hex: "#1464FF", usage: "Always use for the portal header." },
      { name: "UI green", slug: "green", hex: "#4ECC97", usage: "Foreground or alert color." },
      { name: "UI orange", slug: "orange", hex: "#F78239", usage: "Foreground support." },
      { name: "UI yellow", slug: "yellow", hex: "#FFE478", usage: "Foreground support." },
      { name: "Alert green", slug: "alert-green", hex: "#4ECC97", usage: "Alert color." },
      { name: "Alert mint", slug: "alert-mint", hex: "#B8EBD5", usage: "Alert support color." },
      { name: "Alert red", slug: "alert-red", hex: "#CC2F2F", usage: "Alert color." }
    ] satisfies ColorToken[]
  },
  // Defects found in the source deck itself while verifying, preserved so
  // downstream consumers know what was adjudicated and how.
  sourceAnomalies: [
    "Product UI 'Background colors' slide labels its fourth (near-white) swatch '#1464FF'; the rendered fill pixel-samples to #FAFBFC. Encoded as #FAFBFC pending confirmation.",
    "Color Accessibility slide: in the light-blue-background section one 'avoid' swatch is labeled #DAEBFF but rendered white; encoded as avoid #FFFFFF (the rendered value).",
    "Custom stroke icon sizes are printed '16px, 24px, 64x6px'; the last is a deck typo for 64 px.",
    "The deck's visible title slide says 'V6 - October 2024' although the file is named V7 AUG2025."
  ],
  sections: [
    {
      key: "messaging",
      title: "Brand Messaging",
      body: [
        "Use the category statement for the simplest external answer to what Clever is: Clever is the platform powering digital learning for schools.",
        "Use the mission to ground stories about why Clever exists: Connect every student to a world of learning.",
        "Use the headline as a campaign line or big-picture idea: Where digital learning works. Do not bury it inside a sentence.",
        "Use the company description when a more complete explanation is needed: We securely connect the data and applications that schools rely on to make digital learning work better, for everyone.",
        "Use the vision for aspirational future-facing moments: To advance education with technology that works for students everywhere.",
        "When telling the core narrative, connect the platform, mission, product promise, and pillars: Connect anything, Secure everything, Choose freely, Access for all."
      ]
    },
    {
      key: "voice",
      title: "Voice And Tone",
      body: [
        "Clever's voice is clear, confident, and friendly. It should feel innovative but down to earth, self-assured but uplifting, welcoming, and warm.",
        "Be clear. Keep language concise and plain. Avoid jargon, insider terms, and longwinded explanations.",
        "Be confident. State the value directly without hedging, overclaiming, or formulaic marketing language.",
        "Be welcoming. Use simple, accessible words that build connection.",
        "Adjust tone by audience. For students, use softer, calmer, more optimistic language. For teachers and district admins, use a more serious and focused tone.",
        "Keep copy positive and concise. Avoid talking down to the audience."
      ]
    },
    {
      key: "logo",
      title: "Logo",
      body: [
        "Use the full Clever logotype whenever possible. It is the main logo option.",
        "Use the mark, the C, sparingly and only when the full logotype is not advisable, such as favicons and social icons.",
        "The logotype should never be hard to see or recognize. It can be large within a layout as long as margins and clear space are respected.",
        "Use the logo only once in the same layout.",
        "Logotype clear space is at least 1x on all sides, where x is the height of the letter C.",
        "Mark clear space is at least 2x on all sides, where x is the indent between the upper and lower ends of the C.",
        "Minimum logotype size is 20 px for digital and 0.4 in for print.",
        "Do not stroke, shadow, recolor outside brand colors, rotate, outline, distort, flip, alter, or use the logotype as an image frame.",
        "For partnerships, keep at least 1x spacing between logos and maintain equal visual balance."
      ]
    },
    {
      key: "color",
      title: "Color",
      body: [
        "Primary colors are Clever blue #1464FF, white #FFFFFF, and dark navy #0A1E46.",
        "Secondary colors are black #1C1C1C, light blue #DAEBFF, yellow #FFE478, orange #F78239, and green #4ECC97.",
        "Use black only for text. Use light blue as a background fill.",
        "The logo may be Clever blue or white. On orange or green backgrounds, use only the white logo.",
        "Allowed logo background colors are Clever blue, white, dark navy, light blue, orange, and green. Other color combinations are not allowed.",
        "For district admin layouts, backgrounds can be dark navy or light blue. Combine photos with no more than two color shapes. Shapes sit behind photos, and photos cover 20 to 40 percent of the shape.",
        "For K-12 student layouts, backgrounds can be white or Clever blue. Use no more than two color shapes. On Clever blue backgrounds, do not use colored figures. Vector illustration should be black only.",
        "For product UI, use Clever blue #1464FF for the portal header. Use color intentionally to highlight important features. Avoid using every color at once. Limit foreground and alert color usage.",
        "Product UI background options are #1C1C1C, #C2C7D1, #EBECF2, and near-white #FAFBFC (deck swatch mislabeled '#1464FF'; value pixel-sampled from the rendered slide)."
      ]
    },
    {
      key: "typography",
      title: "Typography",
      body: [
        "Headings: ABC Arizona Mix Regular (Dinamo). A soft, neat serif with humanistic character forms. Use only for headings, only in Regular, and at large sizes whenever possible.",
        "Body: Messina Sans Book (Luzi Type Foundry). A modern geometric sans serif used only for descriptive text and body copy.",
        "Type-setting: display headlines use leading 95% (CSS line-height 0.95) with optical kerning. Subheaders and short paragraphs use leading 95% with auto kerning. Body copy uses leading 135% (CSS line-height 1.35) with auto kerning. Tracking is 0% everywhere; do not change it.",
        "Typography should only ever be left-aligned. Never right-align or force-justify type.",
        "Always use sentence case: capitalize the first word of a sentence, keep subsequent words lowercase unless a proper noun requires caps.",
        "The Clever logotype was created with Euclid Circular B, but use official logo assets instead of recreating the logo from type.",
        "Fall-back fonts, only when brand fonts are unavailable (all Google Fonts): Merriweather with Inter, PT Serif with Manrope, or Martel with Plus Jakarta Sans.",
        "Licensing: ABC Arizona Mix and Messina Sans are commercial fonts licensed from Dinamo and Luzi Type Foundry. This service cannot redistribute the font files; apps must license and self-host them, or use the approved fall-backs.",
        "Do not infer brand typography from the PPTX file's internal metadata (it is Google Slides export chrome: Arial theme, embedded Proxima Nova/Inter/Merriweather). The rendered typography slides are the normative source."
      ]
    },
    {
      key: "photography",
      title: "Photography",
      body: [
        "Use high-quality, professional images with balanced light, contrast, and shadows.",
        "For K-12 audiences, use natural photos of children in the learning process with tablets or laptops. Portraits should feel natural, not forced.",
        "For district admins, use professional photos of teachers and district admins. Avoid subjects looking directly into the center of the frame.",
        "For educational imagery, use thematic academic images such as landmarks, nature, science, abstract, or macro subject matter.",
        "Use blue labels for photo descriptions when placing descriptive text with imagery.",
        "Do not use low-quality, low-resolution, stocky-looking, forced-pose, heavily cluttered, photoshopped, effect-treated, or drawing-styled photos.",
        "Do not place text directly on a photo without a blue label."
      ]
    },
    {
      key: "graphic-expression",
      title: "Graphic Expression",
      body: [
        "Use approved branded shape options only. Shapes can be uniform fills and can act as photo containers.",
        "Branded shapes can be yellow, orange, Clever blue, or green. On dark backgrounds, light blue shapes are also allowed. Do not use light blue shapes on white backgrounds.",
        "Use one or two background shapes only. When using two, use different colors, different shapes, and make one slightly larger.",
        "Colored shapes always sit under photos. Photos should cover 20 to 40 percent of the color shape.",
        "Do not use a color shape without a photo.",
        "Underlines are only for headers and should emphasize one impact word. Use a 4 px stroke, use approved underline colors, and do not use underlines on title slides.",
        "Tags sit above headers for emphasis. Tag text should be 1 to 2 capitalized words. Do not use more than two tags on a slide or screen.",
        "General tag color meanings: New is yellow, Add on is orange, Enhancements is green, Clever products and features are blue, Steps are light blue.",
        "Device illustrations are temporary support for product screenshots that do not yet have product illustrations. Use them only if product illustration is unavailable, add a blue label with a short highlight, and contact Brand for specific product illustrations.",
        "Do not use another company's product screenshot, and do not put people photos inside device frames."
      ]
    },
    {
      key: "icons",
      title: "Icons And Illustrations",
      body: [
        "Custom stroke icons use #3C404F, rounded points, sizes 16 px, 24 px, or 64 px, and corners of at least 4 px. They should feel playful but should not be decorative filler.",
        "Custom stroke icons should be created by Brand Marketing.",
        "Material solid icons come from Material Symbols and the current icon library. Use sizes 16 px, 24 px, and 48 px, rounded corners, weight 400, fill on, and normal grade.",
        "Do not add new icons without checking and documenting the icon library.",
        "Dual-tone icons are 120 x 120 px, use #3C404F stroke, rounded ends, at least 8 px corner radius, balanced negative space, and one callout color. They are best for feature callouts and diagrams, not decoration.",
        "Brand line illustrations should use thin black or white strokes only, one illustration per layout, and should stay light enough not to dominate the message.",
        "Classroom illustrations use #3C404F strokes, 6 px outside strokes, and 3 px inside detail strokes. They should be academic, quickly recognizable by children, vibrant, light, and delightful.",
        "Do not repurpose classroom illustrations without Brand Marketing and Product Design approval.",
        "Badge illustrations must keep the Clever logo, transparency, and drop shadow. Do not add outlines. Do not edit QR codes."
      ]
    },
    {
      key: "product-illustrations",
      title: "Product Illustrations",
      body: [
        "Keep product illustrations focused and clear. Highlight the necessary feature information and push everything else into the background.",
        "When illustrating a product experience, use high-fidelity designs and include the needed details.",
        "When illustrating a specific feature, use lower-fidelity designs and fewer details.",
        "If an illustration is not about one specific feature, show the whole product but keep it simple.",
        "Avoid creating new Figma pages or Google folders unless the product is truly new.",
        "Avoid too many font styles, decorations, and colors.",
        "Product illustration text should use Messina Sans with -2 percent tracking: H1 Regular 35 px, H2 SemiBold 25 px, H3 SemiBold 20 px, body Regular 14 px, subtext Regular 12 px.",
        "Never make product illustration text larger than 35 px or smaller than 12 px. Never SemiBold or Bold all text, H1 text, body text, or subtext."
      ]
    },
    {
      key: "checklist",
      title: "Clever App Checklist",
      body: [
        "Start with the audience: student, teacher, district admin, app partner, family, or mixed audience.",
        "Use a clear, confident, friendly voice. Adjust tone for the audience.",
        "Use Clever blue #1464FF, white #FFFFFF, dark navy #0A1E46, and secondary colors with restraint.",
        "Verify text contrast against the Color Accessibility section before shipping.",
        "Headings in ABC Arizona Mix Regular (or an approved serif fall-back) with line-height 0.95; body/UI copy in Messina Sans Book (or an approved sans fall-back) with line-height 1.35.",
        "Keep typography left-aligned and in sentence case. Tracking 0.",
        "Use the full Clever logotype when official assets are available. Do not recreate, distort, or recolor the logo outside approved rules.",
        "Use branded shapes and photography only in approved combinations. Do not use more than two shapes.",
        "Use icons only when they communicate something specific. Do not use icons or illustrations as decoration without purpose.",
        "Do not reuse the source deck's example photos or illustrations in public-facing communications unless the rights are separately approved."
      ]
    }
  ] satisfies Section[],
  accessibility: [
    {
      background: "Dark navy #0A1E46",
      normalTextOk: ["#FFFFFF", "#DAEBFF", "#F78239", "#FFE478"],
      largeTextOk: ["#FFFFFF", "#DAEBFF", "#F78239", "#FFE478", "#4ECC97"],
      avoid: ["#1464FF", "#1C1C1C"]
    },
    {
      background: "White #FFFFFF",
      normalTextOk: ["#1C1C1C", "#0A1E46"],
      largeTextOk: ["#1C1C1C", "#0A1E46", "#1464FF"],
      avoid: ["#DAEBFF", "#4ECC97", "#F78239", "#FFE478"]
    },
    {
      background: "Light blue #DAEBFF",
      normalTextOk: ["#1C1C1C", "#0A1E46"],
      largeTextOk: ["#1C1C1C", "#0A1E46", "#1464FF"],
      avoid: ["#FFFFFF", "#4ECC97", "#F78239", "#FFE478"]
    }
  ]
} as const;

export const sectionKeys = brandData.sections.map((section) => section.key);

export function canonicalEndpoints(baseUrl = FALLBACK_BASE_URL) {
  const prefix = baseUrl.replace(/\/$/, "");
  return {
    humanDocs: `${prefix}/`,
    llmsTxt: `${prefix}/llms.txt`,
    markdown: `${prefix}/brand-guidelines.md`,
    json: `${prefix}/brand-guidelines.json`,
    tokensCss: `${prefix}/tokens.css`,
    tokensJson: `${prefix}/tokens.json`,
    fontsCss: `${prefix}/fonts.css`,
    tailwindPreset: `${prefix}/tailwind-preset.mjs`,
    robotPrompt: `${prefix}/api/instructions?format=prompt`,
    mcp: `${prefix}/api/mcp`
  };
}

export function getSection(key?: string): Section[] {
  if (!key || key === "all") {
    return [...brandData.sections];
  }

  return brandData.sections.filter((section) => section.key === key);
}

const HEADING_STACK = `"ABC Arizona Mix", Merriweather, "PT Serif", Martel, Georgia, serif`;
const BODY_STACK = `"Messina Sans", Inter, Manrope, "Plus Jakarta Sans", "Helvetica Neue", Arial, sans-serif`;

export function renderGuidelinesMarkdown(sectionKey?: string, baseUrl = FALLBACK_BASE_URL): string {
  const sections = getSection(sectionKey);
  const positioning = brandData.positioning;
  const fonts = brandData.fonts;
  const endpoints = canonicalEndpoints(baseUrl);
  const primary = renderColorList(brandData.colors.primary);
  const secondary = renderColorList(brandData.colors.secondary);
  const productUi = renderColorList(brandData.colors.productUi);
  const accessibility = brandData.accessibility
    .map(
      (item) =>
        `- ${item.background}: normal text OK ${item.normalTextOk.join(", ")}; large text OK ${item.largeTextOk.join(", ")}; avoid ${item.avoid.join(", ")}.`
    )
    .join("\n");
  const typeStyles = brandData.typeSetting.styles
    .map(
      (style) =>
        `- ${style.name}: ${style.font} ${style.weight}, leading ${style.leadingPercent}% (CSS line-height ${style.cssLineHeight}), kerning ${style.kerning}, tracking ${style.trackingPercent}%.`
    )
    .join("\n");

  const intro =
    sectionKey && sectionKey !== "all"
      ? ""
      : `# ${brandData.name}

Source: ${brandData.source.file}
Visible deck version: ${brandData.source.visibleDeckVersion}
Extracted: ${brandData.source.extractedOn}; verified against rendered slides: ${brandData.source.verifiedOn}

${brandData.source.note}

## Machine-Readable Artifacts

Ready-to-use build artifacts generated from the same data as this document:

- CSS custom properties: ${endpoints.tokensCss}
- Design tokens JSON: ${endpoints.tokensJson}
- Font stacks and loading CSS: ${endpoints.fontsCss}
- Tailwind preset: ${endpoints.tailwindPreset}
- Structured guidelines JSON: ${endpoints.json}
- MCP endpoint (Streamable HTTP): ${endpoints.mcp}

## Core Statements

- Category statement: ${positioning.categoryStatement}
- Mission: ${positioning.mission}
- Current mission statement: ${positioning.currentMission}
- Headline: ${positioning.headline}
- Company description: ${positioning.companyDescription}
- Vision: ${positioning.vision}
- Narrative pillars: ${positioning.narrativePillars.join(", ")}

## Brand Typography

- Headings: ${fonts.heading.family} ${fonts.heading.style} (${fonts.heading.foundry}). ${fonts.heading.usage}
- Body: ${fonts.body.family} ${fonts.body.style} (${fonts.body.foundry}). ${fonts.body.usage}
- Logo construction: ${fonts.logoConstruction.family}. ${fonts.logoConstruction.usage}
- Fall-back pairs (Google Fonts, only when brand fonts are unavailable): ${fonts.fallbacks.pairs.map((pair) => `${pair.heading} + ${pair.body}`).join("; ")}

Type-setting:

${typeStyles}
- ${brandData.typeSetting.alignment}
- ${brandData.typeSetting.case}
- ${brandData.typeSetting.tracking}

Font licensing: ${fonts.licensing.summary}

${fonts.licensing.practicalDefault}

Provenance: ${fonts.provenanceNote}

## Color Tokens

Primary:
${primary}

Secondary:
${secondary}

Product UI:
${productUi}

## Color Accessibility

${accessibility}
`;

  const body = sections
    .map((section) => `## ${section.title}\n\n${section.body.map((item) => `- ${item}`).join("\n")}`)
    .join("\n\n");

  return `${intro}${intro ? "\n" : ""}${body}\n`;
}

export function renderRobotPrompt(baseUrl = FALLBACK_BASE_URL): string {
  const endpoints = canonicalEndpoints(baseUrl);

  return `You are building or reviewing a Clever-branded app.

Before making design, copy, or UI decisions, fetch and follow the Clever Brand Identity source of truth:

- ${endpoints.llmsTxt}
- ${endpoints.markdown}
- ${endpoints.tokensCss} (drop-in CSS custom properties)
- ${endpoints.tokensJson} (design tokens)

If your runtime supports MCP, connect to:

- ${endpoints.mcp}

Operating rules:

1. Treat the hosted Clever brand guidance as the source of truth for messaging, voice, color, typography, logo handling, photography, graphic expression, icons, and product illustrations.
2. Start every design by identifying the audience: student, teacher, district admin, app partner, family, or mixed audience.
3. Use Clever's voice: clear, confident, and friendly. Use softer, calmer copy for students and more focused copy for teachers and district admins.
4. Use approved colors only. Primary colors are #1464FF, #FFFFFF, and #0A1E46. Secondary colors are #1C1C1C, #DAEBFF, #FFE478, #F78239, and #4ECC97. Prefer consuming them via ${endpoints.tokensCss}.
5. Check text contrast against the hosted color accessibility rules before finalizing UI.
6. Typography: headings in ABC Arizona Mix Regular with CSS line-height 0.95; body/UI copy in Messina Sans Book with line-height 1.35; tracking 0. These are licensed fonts that cannot be served by this service - use the wired Google fall-backs (Merriweather + Inter and the other approved pairs) until licensed files are added to the app, as ${endpoints.fontsCss} does.
7. Keep typography left-aligned and in sentence case.
8. Use official Clever logo assets only. Do not recreate, distort, recolor outside approved rules, outline, shadow, rotate, or use the logo as an image frame.
9. Use branded shapes, photography, devices, icons, and illustrations only where they communicate something specific. Do not use them as filler.
10. Do not reuse images or example illustrations from the source deck in public-facing work unless rights are separately approved.

Before shipping, produce a concise brand compliance note covering: audience, voice/tone, palette, contrast, typography, logo usage, imagery/icons, and any unresolved asset approvals.`;
}

export function renderLlmsTxt(baseUrl = FALLBACK_BASE_URL): string {
  const endpoints = canonicalEndpoints(baseUrl);

  return `# Clever Brand Identity

> Hosted source of truth for Clever-branded apps, agents, and design reviews.

Use these files before creating or reviewing Clever apps:

- [Brand guidelines markdown](${endpoints.markdown}): Agent-readable brand rules.
- [Brand guidelines JSON](${endpoints.json}): Structured brand tokens and sections.
- [CSS custom properties](${endpoints.tokensCss}): Drop-in :root variables for colors and typography.
- [Design tokens JSON](${endpoints.tokensJson}): W3C-style design tokens.
- [Font loading CSS](${endpoints.fontsCss}): Brand font stacks with approved Google fall-backs wired.
- [Tailwind preset](${endpoints.tailwindPreset}): Tailwind theme extension generated from the tokens.
- [Robot prompt](${endpoints.robotPrompt}): Pasteable system/developer prompt for app-building agents.
- [MCP endpoint](${endpoints.mcp}): Streamable HTTP MCP server with brand resources, prompts, and tools.

Important constraints:

- Brand fonts are ABC Arizona Mix Regular (headings) and Messina Sans Book (body). They are commercial fonts this service cannot redistribute; use the wired Google fall-backs until the consuming app adds licensed files.
- Do not infer brand typography from the source PPTX's internal metadata; the deck is flattened artwork and its XML fonts are editor chrome.
- Use official Clever logo assets when shipping public work. This service does not host logo files.
- Do not reuse source-deck example photos or illustrations in public-facing communications without separate rights approval.
- If there is a conflict between a generated app and the hosted guidelines, the hosted guidelines win.
`;
}

export function renderJson(baseUrl = FALLBACK_BASE_URL) {
  return {
    ...brandData,
    canonicalEndpoints: canonicalEndpoints(baseUrl)
  };
}

export function renderTokensCss(baseUrl = FALLBACK_BASE_URL): string {
  const endpoints = canonicalEndpoints(baseUrl);
  const colorGroup = (label: string, tokens: readonly ColorToken[], prefix: string) =>
    [`  /* ${label} */`, ...tokens.map((token) => `  --clever-${prefix}${token.slug}: ${token.hex.toLowerCase()};`)].join("\n");

  return `/*
 * Clever brand design tokens (CSS custom properties)
 * Generated from: ${brandData.source.file} (visible version ${brandData.source.visibleDeckVersion})
 * Docs: ${endpoints.markdown}
 *
 * Fonts: ABC Arizona Mix (Dinamo) and Messina Sans (Luzi Type) are licensed
 * fonts that this service cannot redistribute. The stacks below fall back to
 * the deck's approved Google Fonts. Load them via ${endpoints.fontsCss}
 * or next/font, and swap in licensed files when your app has them.
 */
:root {
${colorGroup("Primary", brandData.colors.primary, "")}

${colorGroup("Secondary", brandData.colors.secondary, "")}

${colorGroup("Product UI", brandData.colors.productUi, "ui-")}

  /* Typography */
  --clever-font-heading: ${HEADING_STACK};
  --clever-font-body: ${BODY_STACK};
  --clever-leading-heading: 0.95; /* deck: leading 95% for display headlines and subheaders */
  --clever-leading-body: 1.35; /* deck: leading 135% for body copy */
  --clever-tracking: 0; /* deck: tracking 0%, do not change */
}

/* Base type styles per the deck's type-setting rules */
.clever-heading {
  font-family: var(--clever-font-heading);
  font-weight: 400; /* ABC Arizona Mix Regular only */
  line-height: var(--clever-leading-heading);
  letter-spacing: var(--clever-tracking);
  text-align: left;
}

.clever-body {
  font-family: var(--clever-font-body);
  font-weight: 400; /* Messina Sans Book */
  line-height: var(--clever-leading-body);
  letter-spacing: var(--clever-tracking);
  text-align: left;
}
`;
}

export function renderTokensJson(baseUrl = FALLBACK_BASE_URL) {
  const endpoints = canonicalEndpoints(baseUrl);
  const colorTokens = (tokens: readonly ColorToken[]) =>
    Object.fromEntries(
      tokens.map((token) => [
        token.slug,
        { $type: "color", $value: token.hex.toLowerCase(), $description: `${token.name}. ${token.usage}` }
      ])
    );

  return {
    $description: `Clever brand design tokens, generated from ${brandData.source.file}. Docs: ${endpoints.markdown}`,
    color: {
      primary: colorTokens(brandData.colors.primary),
      secondary: colorTokens(brandData.colors.secondary),
      "product-ui": colorTokens(brandData.colors.productUi)
    },
    typography: {
      "font-heading": {
        $type: "fontFamily",
        $value: ["ABC Arizona Mix", "Merriweather", "PT Serif", "Martel", "Georgia", "serif"],
        $description:
          "Headings only, Regular weight only, large sizes preferred. ABC Arizona Mix is a licensed font (Dinamo); Google fall-backs follow."
      },
      "font-body": {
        $type: "fontFamily",
        $value: ["Messina Sans", "Inter", "Manrope", "Plus Jakarta Sans", "Helvetica Neue", "Arial", "sans-serif"],
        $description:
          "Body and descriptive text. Messina Sans Book is a licensed font (Luzi Type); Google fall-backs follow."
      },
      "leading-heading": {
        $type: "number",
        $value: 0.95,
        $description: "Deck type-setting: leading 95% for display headlines and subheaders."
      },
      "leading-body": {
        $type: "number",
        $value: 1.35,
        $description: "Deck type-setting: leading 135% for body copy."
      },
      tracking: { $type: "number", $value: 0, $description: "Tracking 0%. Do not change." },
      alignment: { $type: "string", $value: "left", $description: brandData.typeSetting.alignment },
      case: { $type: "string", $value: "sentence", $description: brandData.typeSetting.case }
    },
    accessibility: brandData.accessibility
  };
}

export function renderTailwindPreset(baseUrl = FALLBACK_BASE_URL): string {
  const endpoints = canonicalEndpoints(baseUrl);
  const entries = (tokens: readonly ColorToken[]) =>
    tokens.map((token) => `        "${token.slug}": "${token.hex.toLowerCase()}"`).join(",\n");

  return `/**
 * Clever brand Tailwind preset.
 * Generated from ${brandData.source.file}. Docs: ${endpoints.markdown}
 *
 * Usage (tailwind.config.js):
 *   import cleverPreset from "./clever-preset.mjs";
 *   export default { presets: [cleverPreset], content: [...] };
 *
 * Tailwind CSS v4 users can mirror these values in @theme instead, or keep
 * using presets via the config file.
 *
 * Fonts: ABC Arizona Mix and Messina Sans are licensed; stacks fall back to
 * the deck's approved Google Fonts (see ${endpoints.fontsCss}).
 */
export default {
  theme: {
    extend: {
      colors: {
        clever: {
${entries(brandData.colors.primary)},
${entries(brandData.colors.secondary)}
        },
        "clever-ui": {
${entries(brandData.colors.productUi)}
        }
      },
      fontFamily: {
        "clever-heading": [${HEADING_STACK}],
        "clever-body": [${BODY_STACK}]
      },
      lineHeight: {
        "clever-heading": "0.95",
        "clever-body": "1.35"
      }
    }
  }
};
`;
}

export function renderFontsCss(baseUrl = FALLBACK_BASE_URL): string {
  const endpoints = canonicalEndpoints(baseUrl);

  return `/*
 * Clever brand font loading.
 *
 * The brand fonts are licensed and CANNOT be served by this service:
 *   - Headings: ABC Arizona Mix Regular (Dinamo)  https://abcdinamo.com
 *   - Body:     Messina Sans Book (Luzi Type)     https://luzi-type.ch
 * Foundries license fonts per site/seat; redistributing the binaries from a
 * public endpoint would be unlicensed distribution, and a Clever license
 * would not cover third-party apps. License them for your app, self-host the
 * files, and add @font-face rules where marked below.
 *
 * Until then, this file wires the deck's approved Google fall-backs
 * (Merriweather for headings, Inter for body).
 *
 * Next.js apps: prefer next/font over this @import. See the recipe at
 * ${endpoints.markdown}
 */
@import url("https://fonts.googleapis.com/css2?family=Merriweather:wght@400&family=Inter:wght@400;500;600&display=swap");

/*
 * When you have licensed the brand fonts, self-host them and uncomment:
 *
 * @font-face {
 *   font-family: "ABC Arizona Mix";
 *   src: url("/fonts/ABCArizonaMix-Regular.woff2") format("woff2");
 *   font-weight: 400;
 *   font-style: normal;
 *   font-display: swap;
 * }
 *
 * @font-face {
 *   font-family: "Messina Sans";
 *   src: url("/fonts/MessinaSans-Book.woff2") format("woff2");
 *   font-weight: 400;
 *   font-style: normal;
 *   font-display: swap;
 * }
 */

:root {
  --clever-font-heading: ${HEADING_STACK};
  --clever-font-body: ${BODY_STACK};
}
`;
}

function renderColorList(colors: readonly ColorToken[]): string {
  return colors
    .map((color) => {
      const print = [
        color.rgb ? `RGB ${color.rgb}` : "",
        color.cmyk ? `CMYK ${color.cmyk}` : "",
        color.pantone ? `Pantone ${color.pantone}` : ""
      ]
        .filter(Boolean)
        .join(", ");

      return `- ${color.name}: ${color.hex}${print ? `, ${print}` : ""}. ${color.usage}`;
    })
    .join("\n");
}
