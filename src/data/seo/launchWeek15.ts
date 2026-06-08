import type { SeoDocument } from "../seoDocuments";

export const LAUNCH_WEEK_SLUGS = new Set([
  "salary-slip-format",
  "gst-invoice-format",
  "board-resolution-format",
  "board-resolution-for-bank-account-opening",
  "board-resolution-for-sbi-account-opening",
  "dir-2-format",
  "noc-for-registered-office",
  "management-representation-letter-format",
  "director-resignation-letter-format",
  "llp-form-9-format",
  "llp-subscription-sheet",
  "salary-slip-format-word",
  "gst-invoice-format-word",
  "board-resolution-sample",
  "dir-2-sample",
  "appointment-letter-format",
]);

/** 15 high-intent launch pages — long-form content, FAQs, examples, generator CTAs */
export const launchWeekDocuments: SeoDocument[] = [
  // ── 1. Salary Slip Format ─────────────────────────────────────────
  {
    id: "salary-slip-format",
    documentName: "Salary Slip",
    slug: "salary-slip-format",
    generatorUrl: "/payslips",
    category: "HR & Payroll",
    type: "format",
    trustBadge: "Statutory Ready",
    metaTitle: "Salary Slip Format (Word, Excel & PDF) | Free Salary Slip Generator",
    metaDescription:
      "Download salary slip format, sample payslip templates, and generate professional salary slips online. Free salary slip generator for businesses, startups, HR teams, and accountants.",
    intro:
      "Every employer in India must issue a clear salary slip (payslip) showing how gross salary is calculated and what is deducted before net pay is credited. Our salary slip format is built for startups, SMEs, and CA/HR teams who need a compliant, professional layout without rebuilding Excel every month.",
    whatIsIt:
      "A salary slip is a periodic statement issued to an employee listing basic pay, allowances, reimbursements, statutory deductions (PF, ESI, TDS, professional tax), and net take-home salary for a given pay period.",
    whenIsItRequired:
      "Issued monthly (or per pay cycle) along with salary credit. Required for employee records, loan applications, visa processing, and labour law documentation.",
    whoNeedsIt:
      "HR managers, founders, accountants, and payroll outsourcing firms serving Indian employees.",
    howToUse:
      "Open the payslip generator, enter company and employee details, add salary components, and export PDF or print. Reuse the same template each month.",
    sections: [
      {
        heading: "Mandatory fields on an Indian salary slip",
        paragraphs: [
          "A useful salary slip format should clearly separate earnings from deductions. On the earnings side, include basic salary, house rent allowance (HRA), special allowance, conveyance, and any bonuses or arrears paid in that month. On the deductions side, list provident fund (employee share), ESI where applicable, income tax (TDS), professional tax, and loan recoveries.",
          "Always show gross earnings, total deductions, and net pay in figures and words. Add employer name, employee name, employee ID, designation, pay period, date of payment, and days paid (including LOP if any). Banks and embassies often reject payslips that omit PAN, UAN, or pay-period dates.",
        ],
      },
      {
        heading: "Salary slip vs Form 16 vs salary certificate",
        paragraphs: [
          "A monthly salary slip proves what was actually paid in a specific month. Form 16 is an annual TDS certificate from the employer. A salary certificate is a one-time letter for loans or visas summarising compensation. Professionals search for 'salary slip format' when they need the monthly document — not Form 16.",
          "If you are a CA or HR consultant, offering a clean payslip generator reduces back-and-forth with clients who use inconsistent Excel layouts. Standardising the format also makes year-end reconciliation and TDS working papers easier.",
        ],
      },
      {
        heading: "Compliance notes for Indian employers",
        paragraphs: [
          "While there is no single government-prescribed payslip layout for all sectors, labour codes and state rules expect wage transparency. Shops & Establishments Acts in several states require wage slips to be furnished on payment. IT and startup employees frequently need payslips for home loans — format consistency matters.",
          "For PF-subscribed establishments, showing UAN on the slip helps employees verify credits on the EPFO portal. If you deduct professional tax, mention the state registration context in your records even if not always printed on the slip.",
        ],
      },
    ],
    example: {
      title: "Sample salary slip excerpt",
      body: `TechNova Pvt Ltd — Salary Slip for March 2026
Employee: Priya Sharma | ID: TN-014 | Designation: Accounts Executive
Pay Period: 01-Mar-2026 to 31-Mar-2026 | Paid Days: 30

EARNINGS: Basic ₹25,000 | HRA ₹10,000 | Special Allowance ₹8,000 | Gross ₹43,000
DEDUCTIONS: PF ₹1,800 | Prof. Tax ₹200 | TDS ₹2,100 | Total ₹4,100
NET PAY: ₹38,900 (Rupees Thirty-Eight Thousand Nine Hundred Only)`,
    },
    checklist: [
      "Company name, logo, and registered address on the header",
      "Employee name, ID, designation, PAN/UAN where applicable",
      "Pay period and payment date clearly stated",
      "Separate earnings and deductions tables with totals",
      "Net pay in numbers and words",
      "Authorized signatory or HR stamp for loan/visa submissions",
    ],
    faqs: [
      { question: "What is a salary slip?", answer: "A salary slip is a monthly payroll document showing an employee's earnings, deductions, and net salary for a specific pay period." },
      { question: "Is a salary slip proof of income?", answer: "Yes. Salary slips are commonly accepted by banks, financial institutions, and government authorities as proof of income." },
      { question: "Can salary slips be used for loan applications?", answer: "Yes. Most banks require recent salary slips while processing personal loans, car loans, and home loans." },
      { question: "Is a salary slip mandatory?", answer: "Employers are generally expected to provide salary details to employees. Requirements may vary based on labour laws and company policy." },
      { question: "Can I generate salary slips online?", answer: "Yes. Use ComplianceDraft's Salary Slip Generator to create professional salary slips instantly." },
      { question: "What format is best for salary slips?", answer: "PDF is generally the most professional and widely accepted format." },
      { question: "What is the difference between salary slip format in Word and Excel?", answer: "Word is easier to customise; Excel suits bulk formula payroll. Our generator exports PDF without manual spreadsheet maintenance." },
      { question: "What should a monthly salary slip format include?", answer: "Company details, employee ID, pay period, earnings, deductions, and net salary in figures and words." },
    ],
    relatedDocs: ["GST Invoice", "Board Resolution for Bank Account Opening", "DIR-2 Consent Form"],
  },

  // ── 2. GST Invoice Format ─────────────────────────────────────────
  {
    id: "gst-invoice-format",
    documentName: "GST Invoice",
    slug: "gst-invoice-format",
    generatorUrl: "/invoice",
    category: "GST & Invoicing",
    type: "format",
    trustBadge: "GST Ready",
    metaTitle: "GST Invoice Format India — Tax Invoice Template (Free Generator)",
    metaDescription:
      "Create a GST-compliant tax invoice format with HSN, CGST/SGST/IGST breakup, and buyer GSTIN. Free invoice generator with PDF download.",
    intro:
      "A GST tax invoice is the primary document for B2B supplies in India. Whether you sell services or goods, your invoice format must carry prescribed particulars under CGST Rules — or your buyer cannot claim input tax credit. Use our generator to produce a clean, audit-ready layout in minutes.",
    whatIsIt:
      "A GST invoice (tax invoice) is a legal document issued by a registered supplier showing description of supply, taxable value, GST rate, and tax amount (CGST, SGST, or IGST).",
    whenIsItRequired:
      "Before or at the time of supply for taxable transactions. Mandatory for registered persons making taxable supplies above the threshold and for B2B sales where ITC is claimed.",
    whoNeedsIt:
      "GST-registered businesses, freelancers with GSTIN, traders, service providers, and CAs preparing billing templates for clients.",
    howToUse:
      "Enter seller and buyer GSTIN, line items with HSN/SAC, tax rates, and shipping if any. Preview and download PDF or Word.",
    sections: [
      {
        heading: "Mandatory particulars on a GST tax invoice",
        paragraphs: [
          "Rule 46 of the CGST Rules lists invoice fields: supplier name, address, GSTIN; consecutive invoice number; date; recipient name, address, GSTIN (if registered); HSN/SAC; description; quantity; taxable value; rate; tax amount; place of supply; and signature. Missing GSTIN or wrong tax type (IGST vs CGST/SGST) is a common reason buyers reject invoices.",
          "For inter-state supplies charge IGST. For intra-state supplies split into CGST and SGST. Export invoices need additional declarations. Our generator handles the arithmetic so you focus on line items.",
        ],
      },
      {
        heading: "Bill of supply vs tax invoice",
        paragraphs: [
          "Composition dealers and exempt supplies use a bill of supply — not a tax invoice. If you are on the regular scheme and charge GST, you need the tax invoice format described here. Searching 'GST invoice format' usually means the standard taxable invoice layout.",
          "Credit notes and debit notes follow separate formats but reference the original invoice number. Keep invoice numbering sequential and unique per financial year.",
        ],
      },
      {
        heading: "Practical tips for CA and finance teams",
        paragraphs: [
          "Align invoice branding with the GST registration certificate — trade name mismatches trigger ITC queries. Add payment terms, PO reference, and reverse charge statement only when applicable.",
          "Archive PDF copies with GSTR-1 line mapping. When clients use multiple series (e.g., retail vs corporate), prefix invoice numbers clearly to avoid duplication on the GST portal.",
        ],
      },
    ],
    example: {
      title: "Sample GST invoice line items",
      body: `Invoice No: INV-2026-042 | Date: 08-Jun-2026
Seller: Acme Consulting LLP | GSTIN: 27AAAAA0000A1Z5 (Maharashtra)
Buyer: Beta Traders Pvt Ltd | GSTIN: 27BBBBB0000B1Z6

Item: Professional consulting — 10 hrs @ ₹5,000 | Taxable: ₹50,000
SAC 9983 | CGST 9% ₹4,500 | SGST 9% ₹4,500 | Total ₹59,000`,
    },
    checklist: [
      "Valid supplier and recipient GSTIN (for B2B)",
      "Unique sequential invoice number and date",
      "HSN or SAC for each line item",
      "Taxable value, rate, and tax amount per line",
      "Total invoice value and amount in words",
      "Place of supply and correct IGST/CGST/SGST split",
    ],
    faqs: [
      { question: "Is GST invoice format mandatory for all businesses?", answer: "Registered persons making taxable supplies must issue tax invoices as per CGST Rules. Composition dealers use bill of supply." },
      { question: "Can I create GST invoices without accounting software?", answer: "Yes. Our invoice generator produces compliant layouts you can download as PDF." },
      { question: "What is HSN/SAC on an invoice?", answer: "HSN classifies goods; SAC classifies services. They are required on invoices for proper GST reporting." },
      { question: "Do I need a signature on GST invoices?", answer: "Digital or physical signature of authorised signatory is required unless specifically relaxed for electronic invoices under notified categories." },
      { question: "What if the buyer has no GSTIN?", answer: "For B2C supplies above ₹2.5 lakh (or as notified), invoice particulars still apply; B2C may not need recipient GSTIN." },
      { question: "Can I add company logo?", answer: "Yes. Branding is allowed as long as mandatory fields remain visible and accurate." },
    ],
    relatedDocs: ["Salary Slip", "Board Resolution for Bank Account Opening", "NOC from Owner"],
  },

  // ── 3. Board Resolution Format ────────────────────────────────────
  {
    id: "board-resolution-format-launch",
    documentName: "Board Resolution",
    slug: "board-resolution-format",
    generatorUrl: "/incorporation/private-limited/board-resolution",
    category: "Corporate Compliance",
    type: "format",
    metaTitle: "Board Resolution Format — Free Template for Indian Companies",
    metaDescription:
      "Download board resolution format for company decisions — auditor appointment, bank account, authorised signatory. Certified true copy template with generator.",
    intro:
      "A board resolution is the written record of decisions taken by directors at a validly convened board meeting. ROC filings, banks, and auditors routinely demand certified true copies. Our board resolution format follows common Indian corporate practice under the Companies Act, 2013.",
    whatIsIt:
      "A formal document stating that the Board of Directors resolved a specific matter — appointment, banking, borrowing, or filing authority.",
    whenIsItRequired:
      "For major corporate actions: first auditor appointment, bank account opening, GST registration, director appointments, and loan approvals.",
    whoNeedsIt:
      "Private and public companies, company secretaries, CAs, and startup founders post-incorporation.",
    howToUse:
      "Select resolution type in the generator, enter company and meeting details, preview, and download Word or PDF for director signatures.",
    sections: [
      {
        heading: "Structure of a valid board resolution",
        paragraphs: [
          "Typical format: company name and CIN; reference to Companies Act, 2013; 'Certified true copy of the resolution passed at the meeting of the Board of Directors'; date, time, and place of meeting; resolving clause ('RESOLVED THAT…'); list of directors present; signature block for chairperson or director.",
          "For MCA uploads, resolutions are often scanned as PDF attachments to SPICe+ or post-incorporation forms. Banks want 'certified true copy' wording and sometimes board meeting date within recent months.",
        ],
      },
      {
        heading: "Common resolution types startups need first",
        paragraphs: [
          "First auditor appointment under Section 139(6) is among the earliest resolutions after incorporation. Opening a current account requires a banking resolution naming the bank branch and authorised signatories. GST registration may need a board resolution authorising a director or professional to sign REG-01.",
          "Using separate formats for each purpose reduces rejection risk. A generic 'board resolution format' page should link to the correct generator variant for the user's situation.",
        ],
      },
      {
        heading: "Certification and record-keeping",
        paragraphs: [
          "Minutes of the meeting should be maintained in the minute book. The certified copy handed to third parties is usually signed by a director or company secretary with 'Certified True Copy' stamp.",
          "Keep digital backups aligned with your data room for due diligence. Investors and lenders often request banking and auditor appointment resolutions during funding rounds.",
        ],
      },
    ],
    example: {
      title: "Sample resolving clause (auditor appointment)",
      body: `"RESOLVED THAT pursuant to the provisions of Section 139(6) of the Companies Act, 2013 and other applicable provisions, M/s ABC & Associates, Chartered Accountants (FRN: ______), be and are hereby appointed as the first statutory auditors of the Company to hold office until the conclusion of the first Annual General Meeting on such remuneration as may be determined by the Board."`,
    },
    checklist: [
      "Correct company name and CIN on the header",
      "Meeting date, time, and venue stated",
      "Clear RESOLVED THAT clause with specific action",
      "Directors present / chairperson identified",
      "Certified true copy signing block",
      "Use bank-specific resolution when opening accounts",
    ],
    faqs: [
      { question: "Who signs a board resolution?", answer: "Typically the chairperson of the meeting or any director authorised by the board, marked as certified true copy." },
      { question: "Is a board resolution required for bank account opening?", answer: "Yes. Banks require a board resolution authorising the account, branch, and signatories." },
      { question: "Can one resolution cover multiple items?", answer: "Yes, but separate resolutions are clearer for audits and third-party submissions." },
      { question: "Is notarisation required?", answer: "Usually not for company records; banks may require notarisation in rare cases — check branch KYC." },
      { question: "How is this different from shareholder resolution?", answer: "Board resolutions are passed by directors. Shareholder/EGM/AGM resolutions are passed by members." },
      { question: "Can I edit the format in Word?", answer: "Yes. Generate DOCX from our tool and customise before printing on letterhead." },
    ],
    relatedDocs: ["DIR-2 Consent Form", "Board Resolution for Bank Account Opening", "Management Representation Letter"],
  },

  // ── 4. Board Resolution — Bank Account ────────────────────────────
  {
    id: "board-resolution-bank-opening",
    documentName: "Board Resolution for Bank Account Opening",
    slug: "board-resolution-for-bank-account-opening",
    generatorUrl: "/incorporation/private-limited/bank-account",
    category: "Banking",
    type: "format",
    metaTitle: "Board Resolution for Bank Account Opening | Format, Sample & Generator",
    metaDescription:
      "Download board resolution for bank account opening format, sample resolution, and authorized signatory template. Generate professional board resolutions online.",
    intro:
      "After incorporation, opening a current account is the next critical step. Every bank in India requires a board resolution authorising the account opening, naming the branch, and listing authorised signatories. Our format is tailored for private limited companies and LLPs transitioning to banking KYC.",
    whatIsIt:
      "A board resolution specifically resolving to open a current/savings account with a named bank and designate who can operate it.",
    whenIsItRequired:
      "At the time of submitting account opening forms to any scheduled commercial bank or neo-bank serving businesses.",
    whoNeedsIt:
      "Newly incorporated companies, startups, and CS/CA firms handling post-incorporation compliance.",
    howToUse:
      "Generate the resolution with bank name, branch, account type, and signatory names. Print on company letterhead, get directors to sign, submit with KYC pack.",
    sections: [
      {
        heading: "What banks look for in the resolution",
        paragraphs: [
          "Banks verify: company legal name matches COI; CIN and registered office; explicit permission to open current account; bank and branch name; mode of operation (jointly, severally, or any two directors); names and specimen signatures of authorised signatories.",
          "Mismatch between MOA business objects and account purpose rarely blocks opening but keep activity description consistent. Add GSTIN if already obtained — it speeds KYC.",
        ],
      },
      {
        heading: "Documents usually submitted with the resolution",
        paragraphs: [
          "Certificate of Incorporation, MOA/AOA, PAN of company, director KYC (PAN, Aadhaar, photo), proof of registered office, and specimen signature cards. LLP needs partnership deed and different forms but similar resolution logic for designated partners.",
          "Some banks ask for INC-20A commencement declaration if applicable. Foreign subsidiaries may have expanded documentation — this format targets Indian private companies.",
        ],
      },
      {
        heading: "Authorised signatory modes explained",
        paragraphs: [
          "'Jointly' means all named signatories must sign cheques/transactions. 'Severally' or 'any one' allows individual operation — common for founder-led startups. 'Any two directors jointly' balances control and flexibility.",
          "Align the resolution wording with the bank's account opening form to avoid re-submission. Update the resolution when signatories change.",
        ],
      },
    ],
    example: {
      title: "Sample bank account resolving clause",
      body: `"RESOLVED THAT a current account be opened in the name of the Company with HDFC Bank Ltd, Andheri East Branch, Mumbai, and that Mr. Raj Mehta (Director) and Ms. Ananya Iyer (Director) be authorised to operate the said account jointly, sign cheques, and execute all banking documents on behalf of the Company."`,
    },
    checklist: [
      "Bank name and branch address specified",
      "Account type (current) clearly mentioned",
      "Authorised signatories named with designations",
      "Mode of operation (joint/several) stated",
      "Certified true copy signed by director/CS",
      "Matches names on specimen signature card",
    ],
    faqs: [
      { question: "Is a board resolution mandatory for opening a company bank account?", answer: "Most banks require a board resolution authorizing account opening and signatory powers." },
      { question: "Can one resolution be used for all banks?", answer: "The format is generally similar, though some banks may request specific wording." },
      { question: "Who signs the board resolution?", answer: "Typically certified by an authorized director or company officer." },
      { question: "Is a board meeting required?", answer: "The resolution should be approved according to the company's governance requirements." },
      { question: "Can I generate the resolution online?", answer: "Yes. ComplianceDraft allows you to generate board resolutions instantly." },
      { question: "What is a certified true copy of board resolution?", answer: "A copy signed by an authorized director confirming it matches board minutes." },
      { question: "How recent must the resolution be for the bank?", answer: "Most banks accept within 3–6 months; some prefer current month." },
      { question: "Does the resolution need to name the bank branch?", answer: "Yes — naming the specific bank and branch reduces KYC delays." },
    ],
    relatedDocs: ["Board Resolution", "Specimen Signature Card", "DIR-2 Consent Form"],
  },

  // ── 5. Board Resolution — SBI ─────────────────────────────────────
  {
    id: "board-resolution-sbi",
    documentName: "Board Resolution for Bank Account Opening",
    slug: "board-resolution-for-sbi-account-opening",
    generatorUrl: "/incorporation/private-limited/bank-account",
    category: "Banking",
    type: "format",
    metaTitle: "Board Resolution for SBI Account Opening — Company Current Account",
    metaDescription:
      "Board resolution format for opening company current account with State Bank of India (SBI). Authorised signatories and certified true copy wording.",
    intro:
      "State Bank of India (SBI) is among the most searched banks for startup current accounts. Branch managers expect a crisp board resolution on company letterhead matching SBI's account opening kit. Generate an SBI-ready resolution and pair it with your specimen signature card and COI.",
    whatIsIt:
      "Company board resolution authorising opening of current account with SBI and naming signatories per branch KYC norms.",
    whenIsItRequired:
      "When submitting SBI current account opening forms for a private limited company or LLP.",
    whoNeedsIt:
      "Founders choosing SBI for government-adjacent banking, subsidies, or pan-India branch access.",
    howToUse:
      "Generate resolution mentioning State Bank of India and branch; print; sign; attach to SBI account opening form with standard KYC.",
    sections: [
      {
        heading: "SBI-specific practical notes",
        paragraphs: [
          "Name the exact branch (e.g., 'SBI, Connaught Place New Delhi') — generic 'SBI' wording may be questioned. Confirm whether the branch uses YONO Business or legacy corporate banking — signatory rules are the same but forms differ slightly.",
          "SBI often verifies registered office visit or video KYC for startups. Resolution signatory names must match PAN and Aadhaar submitted in the director set.",
        ],
      },
      {
        heading: "Common reasons SBI returns resolutions",
        paragraphs: [
          "Missing 'certified true copy'; no CIN; signatory not listed as director on MCA; mode of operation ambiguous; company name typo vs COI. Regenerate from our tool to avoid manual copy-paste errors.",
          "If a foreign director is a signatory, passport copies and additional compliance may apply — resolution still required.",
        ],
      },
    ],
    example: {
      title: "Sample SBI resolving clause",
      body: `"RESOLVED THAT a current account be opened in the name of the Company with State Bank of India, IT Park Branch, Bengaluru, and that Mr. Vikram Rao (Director) and Ms. Neha Kapoor (Director) be authorised to operate the account, with signing authority as per the specimen signatures submitted to the Bank."`,
    },
    checklist: [
      "State Bank of India named with specific branch",
      "Company name matches COI exactly",
      "Director signatories match MCA master data",
      "Certified true copy block included",
      "Coordinated with SBI specimen signature form",
    ],
    faqs: [
      { question: "Does SBI need a separate resolution format?", answer: "No separate statutory format — standard board resolution suffices if it names SBI and signatories clearly." },
      { question: "Can we open SBI account online?", answer: "Many steps are digital but board resolution PDF is still uploaded or submitted physically." },
      { question: "Is MOA/AOA required with resolution?", answer: "Yes, as part of the full KYC bundle." },
      { question: "Minimum balance for SBI corporate account?", answer: "Varies by account scheme and branch — confirm with relationship manager." },
      { question: "Same resolution for multiple SBI accounts?", answer: "Use separate resolutions or explicit clauses for each account." },
    ],
    relatedDocs: ["Board Resolution for Bank Account Opening", "Specimen Signature Card", "NOC from Owner"],
  },

  // ── 6. DIR-2 Format ───────────────────────────────────────────────
  {
    id: "dir-2-format-launch",
    documentName: "DIR-2 Consent Form",
    slug: "dir-2-format",
    generatorUrl: "/dir2",
    category: "Incorporation",
    type: "format",
    metaTitle: "DIR-2 Format | Director Consent Form, Sample & Free Generator",
    metaDescription:
      "Download DIR-2 format, director consent form sample, and appointment template. Generate professional DIR-2 documents online for company incorporation.",
    intro:
      "Form DIR-2 is the consent a proposed director gives before appointment. It is uploaded with SPICe+ at incorporation and with DIR-12 for subsequent appointments. Missing or incorrectly signed DIR-2 is a top MCA rejection reason — use a format aligned with Rule 8 of the Companies (Appointment and Qualification of Directors) Rules, 2014.",
    whatIsIt:
      "Written consent and declaration by an individual to act as director, confirming they are not disqualified under Section 164.",
    whenIsItRequired:
      "Before appointment — at incorporation (with SPICe+) or when adding a director later.",
    whoNeedsIt:
      "Every newly appointed director of an Indian company; CAs and CSs filing on their behalf.",
    howToUse:
      "Fill director particulars (DIN if allotted, PAN, address, other directorships), print, sign, scan, and attach to MCA forms.",
    sections: [
      {
        heading: "Key fields in DIR-2",
        paragraphs: [
          "Director name, father's name, DIN (or application number), PAN, date of birth, nationality, residential address, email, mobile, occupation, number of existing directorships and details, membership of professional bodies, declaration of non-disqualification, place and date, signature.",
          "Attach proof of identity and address as per MCA checklist. Foreign nationals have additional ID requirements.",
        ],
      },
      {
        heading: "DIR-2 at incorporation vs later appointment",
        paragraphs: [
          "During SPICe+, DIR-2 is bundled for all first directors. For later appointments, file DIR-12 with DIR-2 and board resolution within 30 days of appointment.",
          "Consent must be obtained before the appointment resolution — sequence matters for audit trails.",
        ],
      },
      {
        heading: "Common SPICe+ rejection fixes",
        paragraphs: [
          "Signature not matching PAN name; outdated address; missing pages; DIN mismatch. Regenerate from a single source of truth (your company profile) to keep DIR-2 aligned with INC-9 and MOA subscriber sheets.",
        ],
      },
    ],
    example: {
      title: "Sample DIR-2 opening declaration",
      body: `I, Amit Patel, son of Ramesh Patel, hereby give my consent to act as Director of Horizon Labs Pvt Ltd (under incorporation) pursuant to Section 152(5) of the Companies Act, 2013 and certify that I am not disqualified under Section 164.`,
    },
    checklist: [
      "Director full name matches PAN/passport",
      "DIN or DIN application reference",
      "Complete residential address and contact details",
      "Declaration of non-disqualification",
      "Physical signature before scanning",
      "ID/address proofs ready for attachment",
    ],
    faqs: [
      { question: "What is DIR-2?", answer: "DIR-2 is a consent form through which an individual agrees to act as a director of a company." },
      { question: "Is DIR-2 mandatory?", answer: "Yes. DIR-2 is required under Section 152(5) whenever a person is appointed as a director." },
      { question: "Who signs DIR-2?", answer: "The proposed director personally signs the consent form." },
      { question: "Can DIR-2 be generated online?", answer: "Yes. ComplianceDraft generates a professionally formatted DIR-2 instantly." },
      { question: "Is DIR-2 required during company incorporation?", answer: "Yes. It is part of the SPICe+ document set for every first director." },
      { question: "What information is required for DIR-2?", answer: "Personal details, DIN, PAN, address, directorships, and consent declaration." },
      { question: "What is the difference between DIR-2 and DIN?", answer: "DIR-2 is consent to act as director; DIN is the unique ID allotted by MCA." },
      { question: "Is notarisation required on DIR-2?", answer: "Generally not for Indian nationals." },
    ],
    relatedDocs: ["NOC from Owner", "Board Resolution", "Specimen Signature Card"],
  },

  // ── 7. NOC Registered Office ──────────────────────────────────────
  {
    id: "noc-for-registered-office-launch",
    documentName: "NOC for Registered Office",
    slug: "noc-for-registered-office",
    generatorUrl: "/noc-format",
    category: "Incorporation",
    type: "format",
    metaTitle: "NOC for Registered Office | Format, Sample & Free Generator",
    metaDescription:
      "Download NOC for Registered Office format, sample NOC letter, and owner consent template. Generate professional NOC documents online for company incorporation and LLP registration.",
    intro:
      "When your registered office is on leased, rented, or shared premises, the property owner must issue a No Objection Certificate (NOC) permitting the company to use the address for official correspondence. ROC scrutinises NOC wording during SPICe+ and address change filings.",
    whatIsIt:
      "A letter from the owner or authorised lessor stating no objection to the company using the premises as its registered office.",
    whenIsItRequired:
      "Incorporation when registered office is not self-owned; ADT-1 address changes; sometimes LLP FiLLiP filings.",
    whoNeedsIt:
      "Founders using co-working, residential, or rented commercial premises as registered office.",
    howToUse:
      "Owner signs on plain paper (usually); attach utility bill in owner's name; upload with SPICe+ INC-22 supporting docs when needed.",
    sections: [
      {
        heading: "What a valid NOC must contain",
        paragraphs: [
          "Owner name and contact; property address; permission granted to [Company Name] to use premises as registered office; statement that owner has no objection; date and signature. If leased, lessor or owner authorisation should be clear.",
          "Utility bill (electricity, gas, water, telephone) not older than 2 months in owner's name is typically filed alongside NOC.",
        ],
      },
      {
        heading: "Owned vs rented premises",
        paragraphs: [
          "Self-owned: sale deed or property tax receipt may suffice without NOC. Rented: rent agreement plus owner NOC is standard. Co-working: agreement with provider and their NOC format.",
          "Using a relative's address is common — still requires their signed NOC and utility proof in their name.",
        ],
      },
      {
        heading: "LLP vs company",
        paragraphs: [
          "LLPs file similar owner consent with FiLLiP. Wording references designated partners. Our LLP NOC generator handles partner-specific blocks.",
        ],
      },
    ],
    example: {
      title: "Sample NOC excerpt",
      body: `I, Suresh Kumar, owner of premises at 42, MG Road, Pune — 411001, hereby state that I have no objection to M/s GreenLeaf Technologies Pvt Ltd using the said address as its registered office for receiving official communications.`,
    },
    checklist: [
      "Owner full name and signature",
      "Complete property address matching utility bill",
      "Company name (exact as in SPICe+)",
      "Plain paper usually acceptable",
      "Recent utility bill in owner's name",
      "Rent agreement if applicable",
    ],
    faqs: [
      { question: "What is an NOC for Registered Office?", answer: "A declaration from the property owner confirming no objection to a company or LLP using the property as registered office." },
      { question: "Is NOC mandatory for company incorporation?", answer: "Commonly required when registered office premises are owned by another person." },
      { question: "Who signs the NOC?", answer: "The property owner or authorized representative." },
      { question: "Can residential property be used as a registered office?", answer: "Yes, subject to applicable requirements and proper owner authorization." },
      { question: "Can I generate an NOC online?", answer: "Yes. ComplianceDraft generates professional NOC for registered office instantly." },
      { question: "What documents should accompany an NOC?", answer: "Utility bill, rent agreement, and owner identity proof are commonly submitted." },
      { question: "Is stamp paper required for NOC?", answer: "Typically plain paper is accepted by ROC." },
      { question: "Is NOC required for LLP registration?", answer: "Yes, when the LLP uses premises owned by another person." },
    ],
    relatedDocs: ["DIR-2 Consent Form", "Specimen Signature Card", "LLP Form 9"],
  },

  // ── 8. MRL Format ─────────────────────────────────────────────────
  {
    id: "management-representation-letter-format",
    documentName: "Management Representation Letter",
    slug: "management-representation-letter-format",
    generatorUrl: "/incorporation/llp/mrl",
    category: "Audit & Accounts",
    type: "format",
    metaTitle: "Management Representation Letter Format | MRL Sample & Free Generator",
    metaDescription:
      "Download Management Representation Letter format, MRL sample, and audit representation template. Generate professional MRL documents online for company and LLP statutory audit.",
    intro:
      "The Management Representation Letter (MRL) is audit evidence where management confirms financial statement accuracy, completeness of records, and disclosure of fraud or illegal acts. Auditors cannot sign the report without it — SA 580 makes it non-negotiable.",
    whatIsIt:
      "A letter on company letterhead signed by directors acknowledging responsibilities for financial statements and confirming representations to auditors.",
    whenIsItRequired:
      "At completion of statutory audit before audit report signing.",
    whoNeedsIt:
      "Company directors, LLP designated partners, and auditors coordinating year-end.",
    howToUse:
      "Customise representations per auditor checklist, print on letterhead, sign by CEO/CFO/directors as requested.",
    sections: [
      {
        heading: "Standard representations in an MRL",
        paragraphs: [
          "Financial statements prepared per applicable framework; internal controls adequate; all transactions recorded; legal and tax compliance; related parties disclosed; subsequent events considered; fraud/intentional errors reported to auditors.",
          "Auditors often provide a draft — management must not blindly sign. Review each bullet for your client's reality.",
        ],
      },
      {
        heading: "MRL for LLP vs private company",
        paragraphs: [
          "LLP MRL references designated partners and LLP Act. Private companies reference Section 134 director responsibility statement concepts. Use the correct variant for your entity.",
        ],
      },
    ],
    example: {
      title: "Sample representation clause",
      body: `"We confirm that we have provided the Auditors with all relevant information and unrestricted access to persons and records necessary for the audit. To the best of our knowledge, there has been no fraud involving management or employees that should have been disclosed."`,
    },
    checklist: [
      "On company/LLP letterhead",
      "Financial year end date stated",
      "Representations match auditor draft",
      "Signed by authorised director/partner",
      "Date before audit report signing",
      "Filed in audit working papers",
    ],
    faqs: [
      { question: "What is a Management Representation Letter (MRL)?", answer: "A letter signed by management confirming accuracy and completeness of financial information provided to auditors." },
      { question: "Is MRL mandatory for statutory audit?", answer: "Yes, under SA 580 auditors must obtain written representations before signing the audit report." },
      { question: "Who signs the Management Representation Letter?", answer: "Typically CEO, CFO, managing director, or designated partners as the auditor specifies." },
      { question: "When is MRL required?", answer: "At completion of statutory audit, before the auditor signs the report." },
      { question: "Can I generate MRL online?", answer: "Yes. ComplianceDraft's MRL Generator creates professionally formatted letters instantly." },
      { question: "Is MRL required for LLP audit?", answer: "Yes. Designated partners provide MRL to the statutory auditor." },
      { question: "What is the difference between MRL and audit report?", answer: "The audit report is issued by the auditor; MRL is management's signed representation to the auditor." },
      { question: "Can management refuse to sign MRL?", answer: "The auditor may qualify or disclaim the audit opinion if representations are refused or limited." },
    ],
    relatedDocs: ["Board Resolution", "Auditor Consent Letter", "DIR-2 Consent Form"],
  },

  // ── 9. Director Resignation ───────────────────────────────────────
  {
    id: "director-resignation-letter-format",
    documentName: "Director Resignation Letter",
    slug: "director-resignation-letter-format",
    generatorUrl: "/incorporation/private-limited/director-resignation/resignation-letter",
    category: "Corporate Compliance",
    type: "format",
    metaTitle: "Director Resignation Letter Format — Companies Act 2013",
    metaDescription:
      "Director resignation letter format with effective date and board acknowledgement. File DIR-12 within 30 days. Free generator.",
    intro:
      "A director wishing to resign must tender written notice to the company. The board accepts the resignation and files DIR-12 with ROC within 30 days. A clear resignation letter format prevents disputes over effective dates and liability cut-off.",
    whatIsIt:
      "Formal notice from a director resigning from the board with date of effect.",
    whenIsItRequired:
      "When any director steps down voluntarily before term end.",
    whoNeedsIt:
      "Resigning directors, company secretaries, and CAs handling post-resignation filings.",
    howToUse:
      "Generate letter with resignation date, deliver to company, obtain board resolution and acknowledgement, file DIR-12.",
    sections: [
      {
        heading: "Legal backdrop — Section 168",
        paragraphs: [
          "Director sends resignation to company; company files DIR-12 within 30 days. Resignation effective from date mentioned in letter or date company receives it if no date specified.",
          "Resigning director may also file DIR-11 as optional intimation to ROC.",
        ],
      },
      {
        heading: "Pack after resignation letter",
        paragraphs: [
          "Board resolution accepting resignation, acknowledgement letter to director, updated statutory registers, and DIR-12. Attendance sheet if board meeting held.",
        ],
      },
    ],
    example: {
      title: "Sample resignation opening",
      body: `To the Board of Directors, Orion Systems Pvt Ltd. I, Meera Shah (DIN: 01234567), hereby resign as Director of the Company with effect from 15 June 2026. I request the Board to file necessary forms with the ROC.`,
    },
    checklist: [
      "Director name and DIN on letter",
      "Clear effective date of resignation",
      "Delivered to registered office/email as per AOA",
      "Board resolution passed accepting resignation",
      "DIR-12 filed within 30 days",
      "MGT-7 and annual return updated if needed",
    ],
    faqs: [
      { question: "Is email resignation valid?", answer: "AOA may permit; signed PDF letter is safer." },
      { question: "DIR-11 mandatory?", answer: "Optional for director; DIR-12 by company is mandatory." },
      { question: "Liability after resignation?", answer: "For acts during tenure; not for post-resignation defaults unless prior acts." },
      { question: "Need board acceptance?", answer: "Company must process resignation and file DIR-12." },
    ],
    relatedDocs: ["Board Resolution", "DIR-2 Consent Form", "Management Representation Letter"],
  },

  // ── 10. LLP Form 9 ────────────────────────────────────────────────
  {
    id: "llp-form-9-format",
    documentName: "LLP Form 9",
    slug: "llp-form-9-format",
    generatorUrl: "/llp/form9",
    category: "LLP Incorporation",
    type: "format",
    metaTitle: "LLP Form 9 Format — Consent to Act as Designated Partner",
    metaDescription:
      "Form 9 LLP format for designated partner consent under FiLLiP. Free template with PDF/DOCX generator for LLP incorporation.",
    intro:
      "LLP Form 9 is the consent form every designated partner signs to act as designated partner in a Limited Liability Partnership. It is filed with FiLLiP during LLP incorporation alongside subscriber sheet and LLP agreement.",
    whatIsIt:
      "Consent and declaration by an individual to act as designated partner of an LLP.",
    whenIsItRequired:
      "LLP incorporation and when admitting a new designated partner.",
    whoNeedsIt:
      "LLP founders, designated partners, and CS/CA filing FiLLiP.",
    howToUse:
      "Complete partner details, sign, attach to FiLLiP incorporation documents.",
    sections: [
      {
        heading: "Form 9 in the FiLLiP bundle",
        paragraphs: [
          "FiLLiP requires Form 9 for each designated partner, subscriber sheet, registered office proof, and LLP agreement (post-incorporation filing). Consent must align with names on PAN and subscriber sheet.",
        ],
      },
      {
        heading: "Designated partner vs partner",
        paragraphs: [
          "Every LLP must have at least two designated partners, at least one resident in India. Form 9 is for designated partners specifically.",
        ],
      },
    ],
    example: {
      title: "Sample Form 9 declaration",
      body: `I, Karan Malhotra, hereby consent to act as Designated Partner of Vertex Consulting LLP (under incorporation) and confirm I am not disqualified from being a partner under the LLP Act, 2008.`,
    },
    checklist: [
      "Partner name matches PAN",
      "DPIN if allotted",
      "Residential address and contact details",
      "Signed before FiLLiP filing",
      "Consistent with subscription sheet",
    ],
    faqs: [
      { question: "Is Form 9 mandatory for LLP?", answer: "Yes, for each designated partner at incorporation." },
      { question: "Form 9 vs DIR-2?", answer: "Form 9 is for LLPs; DIR-2 is for company directors." },
      { question: "Can body corporate be DP?", answer: "Yes, through nominee — separate documentation applies." },
    ],
    relatedDocs: ["LLP Subscription Sheet", "NOC from Owner", "DIR-2 Consent Form"],
  },

  // ── 11. LLP Subscription Sheet ──────────────────────────────────────
  {
    id: "llp-subscription-sheet",
    documentName: "LLP Subscription Sheet",
    slug: "llp-subscription-sheet",
    generatorUrl: "/llp/subscription",
    category: "LLP Incorporation",
    type: "format",
    metaTitle: "LLP Subscription Sheet Format — Partner Contribution (FiLLiP)",
    metaDescription:
      "LLP subscription sheet format showing partner capital contribution for FiLLiP filing. Free generator with totals and partner table.",
    intro:
      "The LLP subscription sheet lists each partner's agreed capital contribution at incorporation. It supports FiLLiP filings and must reconcile with the LLP agreement and Form 9 partner names.",
    whatIsIt:
      "Tabular statement of partner names, contribution amounts, and total capital subscribed.",
    whenIsItRequired:
      "LLP incorporation via FiLLiP.",
    whoNeedsIt:
      "LLP founders and professionals drafting incorporation packs.",
    howToUse:
      "Enter partners and amounts in generator; export; sign by partners; file with incorporation set.",
    sections: [
      {
        heading: "Contribution types",
        paragraphs: [
          "Contribution may be cash, tangible/intangible property, or promissory note as per LLP agreement. Subscription sheet typically states monetary value agreed.",
        ],
      },
      {
        heading: "Reconciliation with agreement",
        paragraphs: [
          "Post-incorporation LLP agreement must match subscription sheet totals. Mismatches delay MCA processing.",
        ],
      },
    ],
    example: {
      title: "Sample subscription table",
      body: `Partner: Karan Malhotra — Contribution: ₹1,00,000
Partner: Priya Nair — Contribution: ₹1,00,000
Total Capital Subscribed: ₹2,00,000`,
    },
    checklist: [
      "All designated partners listed",
      "Contribution amounts in INR",
      "Total matches LLP agreement draft",
      "Partner signatures",
      "Consistent with Form 9 names",
    ],
    faqs: [
      { question: "Minimum LLP capital?", answer: "No statutory minimum; agree commercially and document." },
      { question: "Can contribution be non-cash?", answer: "Yes, per LLP agreement with valuation support." },
    ],
    relatedDocs: ["LLP Form 9", "NOC from Owner", "Board Resolution"],
  },

  // ── 12. Salary Slip Word ──────────────────────────────────────────
  {
    id: "salary-slip-format-word",
    documentName: "Salary Slip",
    slug: "salary-slip-format-word",
    generatorUrl: "/payslips",
    category: "HR & Payroll",
    type: "word",
    trustBadge: "Editable DOCX",
    metaTitle: "Salary Slip Format in Word (.docx) — Editable Payslip Template",
    metaDescription:
      "Download editable salary slip Word format for Indian employees. Customize earnings and deductions, export DOCX or PDF from generator.",
    intro:
      "Many HR teams prefer salary slip format in Word so they can tweak layouts, add company logo, or batch-edit employee fields. Our generator exports an editable payslip you can open in Microsoft Word or Google Docs.",
    whatIsIt:
      "Editable .docx payslip template with standard Indian salary components.",
    whenIsItRequired:
      "Monthly payroll processing when Word editing is part of your workflow.",
    whoNeedsIt:
      "HR departments, payroll consultants, and SMEs outgrowing manual Excel.",
    howToUse:
      "Generate from payslip tool, download Word, adjust branding, save per employee, distribute PDF.",
    sections: [
      {
        heading: "Why Word format still matters",
        paragraphs: [
          "Word allows letterhead integration and comments for approvers. Some legacy payroll workflows archive DOCX per month. Exporting from a structured generator prevents formula errors common in shared Excel files.",
        ],
      },
    ],
    checklist: [
      "Download DOCX from generator",
      "Insert company letterhead if needed",
      "Verify formulas/totals if edited manually",
      "Save PDF for employee distribution",
    ],
    faqs: [
      { question: "Word vs PDF payslip?", answer: "Word for editing; PDF for distribution to employees and banks." },
      { question: "Compatible with Google Docs?", answer: "Yes, upload the DOCX export." },
    ],
    relatedDocs: ["Salary Slip", "GST Invoice", "Board Resolution for Bank Account Opening"],
  },

  // ── 13. GST Invoice Word ──────────────────────────────────────────
  {
    id: "gst-invoice-format-word",
    documentName: "GST Invoice",
    slug: "gst-invoice-format-word",
    generatorUrl: "/invoice",
    category: "GST & Invoicing",
    type: "word",
    trustBadge: "Editable DOCX",
    metaTitle: "GST Invoice Format in Word (.docx) — Editable Tax Invoice",
    metaDescription:
      "GST invoice format in Word for Indian businesses. Edit line items, HSN, and tax breakup. Free generator with DOCX download.",
    intro:
      "GST invoice format in Word gives finance teams flexibility to adjust descriptions, add bank details, or bilingual headers before sending to clients. Start from our compliant template rather than rebuilding from scratch.",
    whatIsIt:
      "Editable tax invoice document with GST fields in Word format.",
    whenIsItRequired:
      "Each taxable supply where your process prefers Word editing.",
    whoNeedsIt:
      "SMBs, agencies, and CAs setting up client billing templates.",
    howToUse:
      "Generate invoice, export Word, customise, save as PDF for email to client.",
    sections: [
      {
        heading: "Editing without breaking compliance",
        paragraphs: [
          "Do not remove GSTIN, tax breakup, or invoice number when editing. Add payment QR and UPI details in footer as needed.",
        ],
      },
    ],
    checklist: [
      "GSTIN and invoice number preserved after edits",
      "CGST/SGST/IGST math verified",
      "Save final PDF for records",
    ],
    faqs: [
      { question: "Is Word invoice valid for ITC?", answer: "Yes, if mandatory particulars are present; PDF issuance is standard practice." },
      { question: "Can I add multiple currencies?", answer: "Export invoices typically INR; foreign currency needs FEMA considerations." },
    ],
    relatedDocs: ["GST Invoice", "Salary Slip", "Board Resolution"],
  },

  // ── 14. Board Resolution Sample ───────────────────────────────────
  {
    id: "board-resolution-sample-launch",
    documentName: "Board Resolution",
    slug: "board-resolution-sample",
    generatorUrl: "/incorporation/private-limited/board-resolution",
    category: "Corporate Compliance",
    type: "sample",
    metaTitle: "Board Resolution Sample — Filled Example for Indian Companies",
    metaDescription:
      "View a filled board resolution sample for auditor appointment and bank account. Reference example before generating your own.",
    intro:
      "Seeing a completed board resolution sample helps first-time founders understand tone, certification block, and resolving clause structure. Use this reference, then generate your company-specific version.",
    whatIsIt:
      "Filled example of board resolutions for common startup scenarios.",
    whenIsItRequired:
      "When learning format before drafting; training junior staff.",
    whoNeedsIt:
      "Founders, CS trainees, and CA article assistants.",
    howToUse:
      "Read sample, then use generator for your company data — do not submit sample as-is.",
    sections: [
      {
        heading: "How to read the sample",
        paragraphs: [
          "Note meeting header, whereas clauses (if any), RESOLVED THAT block, and certification. Samples may combine banking and auditor items — your live documents should separate concerns.",
        ],
      },
    ],
    example: {
      title: "Filled sample — bank + signatory",
      body: `CERTIFIED TRUE COPY of the resolution passed at the Board Meeting of Stellar Apps Pvt Ltd (CIN: U72900MH2024PTC123456) held on 10 May 2026.

RESOLVED THAT a current account be opened with ICICI Bank, BKC Branch, Mumbai, and that Mr. A (Director) and Ms. B (Director) shall operate the account jointly.

For Stellar Apps Pvt Ltd
________________________
Director`,
    },
    checklist: [
      "Use sample as reference only",
      "Generate fresh resolution with your CIN",
      "Match bank branch names exactly",
    ],
    faqs: [
      { question: "Can I file the sample to ROC?", answer: "No — generate your own with actual company data." },
      { question: "Sample for LLP?", answer: "LLP uses partner resolutions — different template." },
    ],
    relatedDocs: ["Board Resolution", "Board Resolution for Bank Account Opening", "DIR-2 Consent Form"],
  },

  // ── 15. DIR-2 Sample ──────────────────────────────────────────────
  {
    id: "dir-2-sample-launch",
    documentName: "DIR-2 Consent Form",
    slug: "dir-2-sample",
    generatorUrl: "/dir2",
    category: "Incorporation",
    type: "sample",
    metaTitle: "DIR-2 Sample — Filled Consent Form Example (Director Appointment)",
    metaDescription:
      "Filled DIR-2 sample showing correct fields for director consent. Reference before generating your SPICe+ DIR-2.",
    intro:
      "A DIR-2 sample with realistic dummy data shows how to complete directorship details, declarations, and signature blocks. Review the sample, then create your own DIR-2 in one click.",
    whatIsIt:
      "Example filled DIR-2 for training and reference.",
    whenIsItRequired:
      "Before first SPICe+ filing or training new team members.",
    whoNeedsIt:
      "First-time directors and compliance beginners.",
    howToUse:
      "Study sample field order, then open DIR-2 generator with your profile data.",
    sections: [
      {
        heading: "Field-by-field walkthrough",
        paragraphs: [
          "Compare sample entries for DIN, PAN, address, other directorships table, and declaration paragraph. Ensure your live form does not leave blanks in mandatory rows.",
        ],
      },
    ],
    example: {
      title: "Sample director details row",
      body: `Name: Rohan Gupta | DIN: 09123456 | PAN: ABCPG1234F
Address: Flat 9, Lake View Apts, Hyderabad — 500032
Other directorships: Nil | Declaration: Not disqualified u/s 164`,
    },
    checklist: [
      "Do not submit sample to MCA",
      "Use generator for actual director data",
      "Match PAN name spelling exactly",
    ],
    faqs: [
      { question: "Sample vs actual DIR-2?", answer: "Sample is illustrative only; generate a fresh form per director per company." },
      { question: "Attach sample to SPICe+?", answer: "No — attach only signed actual DIR-2." },
    ],
    relatedDocs: ["DIR-2 Consent Form", "NOC from Owner", "Board Resolution"],
  },

  // ── 16. Appointment Letter Format ─────────────────────────────────
  {
    id: "appointment-letter-format",
    documentName: "Appointment Letter",
    slug: "appointment-letter-format",
    generatorUrl: "/incorporation/private-limited/appointment-letter",
    category: "HR & Payroll",
    type: "format",
    trustBadge: "HR Ready",
    metaTitle: "Appointment Letter Format | Sample, Word Format & Free Generator",
    metaDescription:
      "Download appointment letter format, employee appointment letter sample, Word template, and PDF examples. Generate professional appointment letters online for free.",
    intro:
      "An appointment letter is official confirmation of employment — designation, salary, joining date, reporting manager, and employment policies. Startups, HR teams, and small businesses search for appointment letter format when onboarding hires without rebuilding Word templates each time.",
    whatIsIt:
      "A formal letter from employer to employee confirming employment terms after offer acceptance.",
    whenIsItRequired:
      "At onboarding — after the candidate accepts the offer and before or on the joining date.",
    whoNeedsIt:
      "HR managers, startup founders, recruiters, consultants, and any employer hiring staff.",
    howToUse:
      "Enter company and employee details in the generator, customise clauses, preview, and download Word or PDF.",
    sections: [
      {
        heading: "Appointment letter vs offer letter",
        paragraphs: [
          "Offer letters propose employment; appointment letters confirm it with fuller terms after acceptance. Searching 'appointment letter format' usually means the post-acceptance joining document, not the initial offer.",
          "Include probation, confidentiality, termination notice, working hours, and leave policy where applicable. Indian employers often state CTC breakup in an annexure.",
        ],
      },
      {
        heading: "Word vs PDF for HR teams",
        paragraphs: [
          "Word formats suit startups editing letterhead and clauses per role. PDF is standard for email issuance and employee records. Generate once, export both from a single source of truth.",
          "Keep signed copies in the employee file and share digital copies for background verification when employees change jobs.",
        ],
      },
      {
        heading: "Keywords professionals search",
        paragraphs: [
          "Common queries: employee appointment letter, job appointment letter, appointment letter template, appointment letter download, employee joining letter. One flagship page can rank for format, sample, Word, and PDF intents when content covers each variant clearly.",
        ],
      },
    ],
    example: {
      title: "Sample appointment letter excerpt",
      body: `Dear Priya Sharma,

We are pleased to appoint you as Software Engineer at Nova Tech Pvt Ltd with effect from 1 July 2026.

Your annual CTC will be ₹12,00,000 subject to applicable deductions and company policies. You will report to Mr. Arjun Mehta, Engineering Lead.

We welcome you to the team.`,
    },
    checklist: [
      "Correct employee name and address",
      "Designation and department stated",
      "Joining date and place of work",
      "Salary / CTC clearly specified",
      "Probation and notice period clauses",
      "Signed by authorized signatory on letterhead",
    ],
    faqs: [
      { question: "What is an appointment letter?", answer: "A formal document confirming an individual's employment with an organization." },
      { question: "Is an appointment letter mandatory?", answer: "Most organizations issue appointment letters to document employment terms and conditions." },
      { question: "What should be included in an appointment letter?", answer: "Employee details, designation, salary, joining date, and employment terms are typically included." },
      { question: "Can I create an appointment letter online?", answer: "Yes. ComplianceDraft allows you to generate professional appointment letters online." },
      { question: "What is the difference between an offer letter and an appointment letter?", answer: "An offer letter proposes employment; an appointment letter confirms employment after acceptance." },
      { question: "Can appointment letters be generated in PDF format?", answer: "Yes. Appointment letters are commonly generated and shared as PDF documents." },
    ],
    relatedDocs: ["Salary Slip", "Board Resolution", "DIR-2 Consent Form"],
  },
];
