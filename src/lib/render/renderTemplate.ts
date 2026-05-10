import Handlebars from "handlebars";

type RenderOptions = {
  title?: string;
  css?: string;
};

const BASE_CSS = `
  :root { color-scheme: light; }
  body { margin: 0; padding: 24px; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; color: #111827; }
  .page { max-width: 820px; margin: 0 auto; }
  .doc { font-size: 14px; line-height: 1.55; }
  .doc__header { text-align: center; margin-bottom: 18px; }
  .doc__title { font-weight: 700; font-size: 18px; letter-spacing: 0.2px; }
  .doc__meta { color: #374151; margin-top: 3px; }
  .doc__h1 { text-align: center; font-weight: 700; margin: 16px 0; text-decoration: underline; }
  .doc__h2 { font-weight: 700; margin-top: 14px; }
  .doc__p { margin-top: 10px; }
  .doc__ol { margin-top: 10px; padding-left: 20px; }
  .doc__muted { color: #4b5563; margin-top: 4px; }
  .doc__sign { margin-top: 18px; display: flex; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
  .doc__signBlock { min-width: 260px; }
  .doc__spacer { height: 48px; }
  @media print { body { padding: 0; } .page { max-width: none; margin: 0; } }
`;

let helpersRegistered = false;
function ensureHelpers() {
  if (helpersRegistered) return;
  helpersRegistered = true;

  Handlebars.registerHelper("formatDate", (value: unknown) => {
    if (typeof value !== "string" || !value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  });

  Handlebars.registerHelper("inc", (value: unknown) => {
    const num = typeof value === "number" ? value : parseInt(String(value), 10);
    return Number.isNaN(num) ? 1 : num + 1;
  });

  Handlebars.registerHelper("nl2br", (value: unknown) => {
    if (typeof value !== "string" || !value.trim()) return "";
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .replace(/\n/g, "<br/>");
  });
}

export function renderHtml(
  templateSource: string,
  data: unknown,
  opts?: RenderOptions,
) {
  ensureHelpers();

  const template = Handlebars.compile(templateSource, {
    noEscape: true,
    strict: false,
  });

  const body = template((data ?? {}) as Record<string, unknown>);
  const title = opts?.title ?? "Generated Document";
  const css = opts?.css ?? BASE_CSS;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>${css}</style>
  </head>
  <body>
    <div class="page">${body}</div>
  </body>
</html>`;
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
