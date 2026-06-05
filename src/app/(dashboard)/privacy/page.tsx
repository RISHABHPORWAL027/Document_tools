import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read the Privacy Policy of ComplianceDraft. Learn how we handle, protect, and secure your personal, company, and director data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-8 shadow-sm" style={{ borderColor: "#C4C6D0" }}>
      <h1 className="mb-6 text-3xl font-extrabold" style={{ color: "#1A1C1E" }}>Privacy Policy</h1>
      <div className="prose prose-sm prose-slate max-w-none space-y-4" style={{ color: "#44474E" }}>
        <p>
          Last updated: {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
        </p>
        <p>
          At ComplianceDraft, we take your privacy seriously. This Privacy Policy outlines how we collect, use, and protect your personal and corporate information when you use our document automation and compliance suite.
        </p>
        <h2 className="mt-6 text-lg font-bold" style={{ color: "#1A1C1E" }}>1. Information We Collect</h2>
        <p>
          We collect information that you provide directly to us, including but not limited to company details (CIN, PAN, Registered Address), director details (DIN, personal information), and other data necessary to generate MCA and compliance documents.
        </p>
        <h2 className="mt-6 text-lg font-bold" style={{ color: "#1A1C1E" }}>2. How We Use Your Information</h2>
        <p>
          Your information is used solely for the purpose of generating automated legal and corporate documents, and for maintaining your Master Data Hub. We do not sell your data to third parties.
        </p>
        <h2 className="mt-6 text-lg font-bold" style={{ color: "#1A1C1E" }}>3. Data Security</h2>
        <p>
          We implement industry-standard security measures to protect your sensitive corporate data against unauthorized access, alteration, disclosure, or destruction.
        </p>
        <h2 className="mt-6 text-lg font-bold" style={{ color: "#1A1C1E" }}>4. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us at <strong>porwal027@gmail.com</strong>.
        </p>
      </div>
    </div>
  );
}
