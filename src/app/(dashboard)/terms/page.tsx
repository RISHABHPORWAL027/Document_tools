export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-8 shadow-sm" style={{ borderColor: "#C4C6D0" }}>
      <h1 className="mb-6 text-3xl font-extrabold" style={{ color: "#1A1C1E" }}>Terms of Service</h1>
      <div className="prose prose-sm prose-slate max-w-none space-y-4" style={{ color: "#44474E" }}>
        <p>
          Last updated: {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
        </p>
        <p>
          Welcome to ComplianceDraft. By accessing or using our platform, you agree to be bound by these Terms of Service.
        </p>
        <h2 className="mt-6 text-lg font-bold" style={{ color: "#1A1C1E" }}>1. Use of the Platform</h2>
        <p>
          ComplianceDraft provides automated legal and corporate document templates. While we strive for accuracy in accordance with MCA and Indian corporate laws, the documents generated should be reviewed by a qualified professional before filing. We do not provide legal advice.
        </p>
        <h2 className="mt-6 text-lg font-bold" style={{ color: "#1A1C1E" }}>2. User Responsibilities</h2>
        <p>
          You are responsible for the accuracy of the data entered into the Master Data Hub. ComplianceDraft is not liable for form rejections or penalties resulting from inaccurate data entry.
        </p>
        <h2 className="mt-6 text-lg font-bold" style={{ color: "#1A1C1E" }}>3. Intellectual Property</h2>
        <p>
          All templates, workflows, and code on the ComplianceDraft platform are the intellectual property of ComplianceDraft. You may not resell or redistribute our proprietary templates without explicit permission.
        </p>
        <h2 className="mt-6 text-lg font-bold" style={{ color: "#1A1C1E" }}>4. Limitation of Liability</h2>
        <p>
          In no event shall ComplianceDraft be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the platform.
        </p>
        <h2 className="mt-6 text-lg font-bold" style={{ color: "#1A1C1E" }}>5. Contact</h2>
        <p>
          If you have any questions regarding these Terms, please contact us at <strong>porwal027@gmail.com</strong>.
        </p>
      </div>
    </div>
  );
}
