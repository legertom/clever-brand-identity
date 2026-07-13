import styles from "./page.module.css";
import { brandData } from "../src/brand";

const links = [
  { href: "/llms.txt", title: "llms.txt", text: "Discovery file for agents." },
  { href: "/brand-guidelines.md", title: "Markdown", text: "Readable rules for LLM context." },
  { href: "/brand-guidelines.json", title: "JSON", text: "Structured tokens and sections." },
  { href: "/tokens.css", title: "tokens.css", text: "Drop-in CSS custom properties." },
  { href: "/tokens.json", title: "tokens.json", text: "W3C-style design tokens." },
  { href: "/fonts.css", title: "fonts.css", text: "Brand font stacks with approved fall-backs." },
  { href: "/tailwind-preset.mjs", title: "Tailwind preset", text: "Theme extension for Tailwind apps." },
  { href: "/api/instructions?format=prompt", title: "Robot prompt", text: "Pasteable instruction block." },
  { href: "/api/mcp", title: "MCP", text: "Streamable HTTP MCP endpoint at /api/mcp." },
  { href: "/docs/robot-instructions.md", title: "Docs", text: "Setup instructions for you and your robots." }
];

const palette = [
  ...brandData.colors.primary.filter((color) => color.hex !== "#FFFFFF"),
  ...brandData.colors.secondary.filter((color) => color.hex !== "#1C1C1C")
];

export default function HomePage() {
  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.brand}>
          <div className={styles.logo}>Clever</div>
          <div className={styles.version}>Brand instructions for humans and agents</div>
        </div>
        <h1 className={styles.headline}>{brandData.positioning.headline}</h1>
        <p className={styles.sub}>
          A hosted Clever brand reference with Markdown, JSON, design tokens, llms.txt, prompt, and MCP access for
          app-building robots.
        </p>
      </section>

      <section className={styles.content}>
        <div className={styles.links}>
          {links.map((link) => (
            <a key={link.href} className={styles.link} href={link.href}>
              <strong>{link.title}</strong>
              <span>{link.text}</span>
            </a>
          ))}
        </div>

        <h2 className={styles.sectionTitle}>Core palette</h2>
        <div className={styles.palette} aria-label="Clever color palette">
          {palette.map((color) => (
            <div key={color.slug} className={styles.swatch}>
              <div className={styles.chip} style={{ background: color.hex }} />
              <span>
                {color.name} {color.hex}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
