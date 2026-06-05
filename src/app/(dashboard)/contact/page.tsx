import type { Metadata } from "next";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with ComplianceDraft. Contact us for legal document templates, dashboard support, or custom compliance workflow inquiries.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl rounded-2xl border bg-white p-10 text-center shadow-sm" style={{ borderColor: "#C4C6D0" }}>
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: "#EFF4FF", color: "#1A2E7E" }}>
        <Mail className="h-6 w-6" />
      </div>
      <h1 className="mb-3 text-3xl font-extrabold" style={{ color: "#1A1C1E" }}>Contact Us</h1>
      <p className="mb-8 text-sm leading-relaxed" style={{ color: "#44474E" }}>
        Have a question about our templates, or need help with a custom compliance workflow? We&apos;re here to help. Send us an email and our team will get back to you within 24 hours.
      </p>
      
      <a
        href="mailto:porwal027@gmail.com"
        className="inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 shadow-md"
        style={{ backgroundColor: "#1A2E7E" }}
      >
        <Mail className="h-4 w-4" />
        porwal027@gmail.com
      </a>

      <div className="mt-8 text-xs" style={{ color: "#44474E" }}>
        Operating Hours: Monday – Friday, 9 AM – 6 PM (IST)
      </div>
    </div>
  );
}
