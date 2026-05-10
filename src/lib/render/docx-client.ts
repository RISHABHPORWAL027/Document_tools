/**
 * Client-side helper to trigger DOCX generation via API.
 */
export async function downloadDocx(html: string, fileName: string) {
  const res = await fetch("/api/render/docx", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ html, fileName }),
  });

  if (!res.ok) {
    throw new Error("Failed to generate DOCX");
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
