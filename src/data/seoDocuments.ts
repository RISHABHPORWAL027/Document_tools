import { launchWeekDocuments, LAUNCH_WEEK_SLUGS } from "./seo/launchWeek15";

export interface SeoDocument {
  id: string;
  documentName: string;
  slug: string;
  generatorUrl: string;
  category: string;
  type: "format" | "pdf" | "word" | "sample" | "faq";
  metaTitle: string;
  metaDescription: string;
  intro: string;
  whatIsIt: string;
  whenIsItRequired: string;
  whoNeedsIt: string;
  howToUse: string;
  faqs: { question: string; answer: string }[];
  relatedDocs: string[];
  /** Long-form sections for launch-quality landing pages (target 1,000–1,500 words total) */
  sections?: { heading: string; paragraphs: string[] }[];
  /** Filled example or sample excerpt */
  example?: { title: string; body: string };
  /** Step-by-step checklist shown above the FAQ */
  checklist?: string[];
  /** Hero trust badge — defaults to "MCA Compliant" */
  trustBadge?: string;
}

/** Map related-doc labels to canonical SEO document names */
const DOCUMENT_ALIASES: Record<string, string> = {
  "NOC from Owner": "NOC for Registered Office",
  "Board Resolution (Bank)": "Board Resolution for Bank Account Opening",
  "Salary Payslip Generator": "Salary Slip",
  "Invoice Generator": "GST Invoice",
  "Form 9 — Consent as Designated Partner": "LLP Form 9",
};

/** Map an in-app path to the live generator when it accidentally points at an SEO slug */
export function inAppHref(path: string): string {
  const slug = path.replace(/^\//, "").split("?")[0];
  const doc = seoDocuments.find((d) => d.slug === slug);
  if (doc?.generatorUrl && doc.generatorUrl !== "#") {
    return doc.generatorUrl;
  }
  return path;
}

/** Live generator path for a document family (used for in-app navigation, not SEO slugs) */
export function resolveGeneratorUrl(documentName: string): string | undefined {
  const canonical = DOCUMENT_ALIASES[documentName] ?? documentName;
  const doc =
    seoDocuments.find((d) => d.documentName === canonical && d.type === "format") ??
    seoDocuments.find((d) => d.documentName === canonical);
  return doc?.generatorUrl;
}

/** One entry per document family for generator links */
export function uniqueGeneratorLinks(): {
  documentName: string;
  generatorUrl: string;
  intro: string;
}[] {
  const seen = new Set<string>();
  const links: { documentName: string; generatorUrl: string; intro: string }[] = [];

  for (const doc of seoDocuments) {
    if (seen.has(doc.documentName) || !doc.generatorUrl || doc.generatorUrl === "#") continue;
    seen.add(doc.documentName);
    links.push({
      documentName: doc.documentName,
      generatorUrl: doc.generatorUrl,
      intro: doc.intro,
    });
  }

  return links;
}

/** Legacy SEO pages — launch-week slugs are overridden by launchWeekDocuments */
const legacySeoDocuments: SeoDocument[] = [
  {
    id: "dir-2-format-legacy",
    documentName: "DIR-2 Consent Form",
    slug: "dir-2-format",
    generatorUrl: "/dir2",
    category: "Incorporation",
    type: "format",
  
    metaTitle: "DIR-2 Format - Consent to Act as Director",
    metaDescription: "Download the standard DIR-2 format required for the appointment of a director in an Indian company. Free and easy to use.",
    intro: "Form DIR-2 is a critical document required during the appointment of a director under the Companies Act, 2013.",
    whatIsIt: "DIR-2 is a consent form signed by a person expressing their willingness to act as a director of a company.",
    whenIsItRequired: "It is required at the time of incorporation of a new company or when appointing a new director to an existing company.",
    whoNeedsIt: "Any individual who is being appointed as a director of a private or public limited company in India.",
    howToUse: "Fill out the required fields, print it, sign it, and submit it along with other incorporation or appointment documents to the ROC.",
    faqs: [
      { question: "Is DIR-2 mandatory?", answer: "Yes, it is mandatory under Section 152(5) of the Companies Act, 2013." },
      { question: "Who needs to sign DIR-2?", answer: "The person being appointed as the director must sign it." }
    ],
    relatedDocs: ["NOC from Owner", "Board Resolution", "Specimen Signature Card"]
  },
  {
    id: "dir-2-pdf-download",
    documentName: "DIR-2 Consent Form",
    slug: "dir-2-pdf-download",
    generatorUrl: "/dir2",
    category: "Incorporation",
    type: "pdf",
    metaTitle: "DIR-2 PDF Download - Consent to Act as Director",
    metaDescription: "Get the DIR-2 PDF download for free. Perfect for immediate printing and signing.",
    intro: "Need a quick PDF version of the DIR-2 consent form? Download it instantly here.",
    whatIsIt: "This is the PDF version of the DIR-2 consent form, required for director appointments.",
    whenIsItRequired: "Use this PDF when you need to quickly print and sign the consent form without editing the formatting.",
    whoNeedsIt: "Individuals and professionals (CA/CS/CMA) needing a ready-to-print format.",
    howToUse: "Download the PDF, fill in the blanks manually, sign, and attach to your ROC filings.",
    faqs: [
      { question: "Can I edit the PDF?", answer: "PDFs are generally for printing. For an editable version, please use our generator." }
    ],
    relatedDocs: ["NOC from Owner", "Board Resolution", "Specimen Signature Card"]
  },
  {
    id: "dir-2-word-format",
    documentName: "DIR-2 Consent Form",
    slug: "dir-2-word-format",
    generatorUrl: "/dir2",
    category: "Incorporation",
    type: "word",
    metaTitle: "DIR-2 Word Format Download (.docx)",
    metaDescription: "Download the fully editable DIR-2 Word format for director appointments.",
    intro: "Get the standard DIR-2 form in an editable Microsoft Word (.docx) format.",
    whatIsIt: "An editable Word document version of the DIR-2 consent form.",
    whenIsItRequired: "When you need to make specific formatting changes or fill details digitally before printing.",
    whoNeedsIt: "Corporate professionals and company founders.",
    howToUse: "Open in MS Word or Google Docs, edit the highlighted fields, and print.",
    faqs: [
      { question: "Is this format compliant with MCA?", answer: "Yes, our formats are aligned with the latest MCA guidelines." }
    ],
    relatedDocs: ["NOC from Owner", "Board Resolution", "Specimen Signature Card"]
  },
  {
    id: "dir-2-sample",
    documentName: "DIR-2 Consent Form",
    slug: "dir-2-sample",
    generatorUrl: "/dir2",
    category: "Incorporation",
    type: "sample",
    metaTitle: "DIR-2 Sample - Filled Consent Form Example",
    metaDescription: "View a filled sample of the DIR-2 consent form to understand how to correctly provide your details.",
    intro: "Not sure how to fill out the DIR-2 form? View our filled sample for guidance.",
    whatIsIt: "A dummy filled example of the DIR-2 form demonstrating correct usage.",
    whenIsItRequired: "When you are confused about what details go into specific fields of the DIR-2 form.",
    whoNeedsIt: "First-time directors or founders filing their own incorporation.",
    howToUse: "Use this as a reference guide while filling your actual DIR-2 form.",
    faqs: [
      { question: "Can I submit this sample?", answer: "No, this is purely for reference. Use our generator to create your own." }
    ],
    relatedDocs: ["NOC from Owner", "Board Resolution", "Specimen Signature Card"]
  },
  {
    id: "what-is-dir-2",
    documentName: "DIR-2 Consent Form",
    slug: "what-is-dir-2",
    generatorUrl: "/dir2",
    category: "Incorporation",
    type: "faq",
    metaTitle: "What is Form DIR-2? Complete Guide & Meaning",
    metaDescription: "Learn everything about Form DIR-2, its meaning, requirements, and process under the Companies Act.",
    intro: "Understanding Form DIR-2 is essential for any aspiring company director in India.",
    whatIsIt: "Form DIR-2 is a declaration and consent provided by a person to act as a director of a company.",
    whenIsItRequired: "At the time of company incorporation (SPICe+) or any subsequent director appointment (DIR-12).",
    whoNeedsIt: "Every person appointed as a director.",
    howToUse: "Read our comprehensive guide to understand the legal implications of signing a DIR-2.",
    faqs: [
      { question: "Is a digital signature required on DIR-2?", answer: "Physical signature is required, which is then scanned and attached." },
      { question: "Does DIR-2 need to be notarized?", answer: "No, notarization is not generally required for Indian nationals." }
    ],
    relatedDocs: ["NOC from Owner", "Board Resolution", "Specimen Signature Card"]
  },
  // Board Resolution
  {
    id: "board-resolution-format",
    documentName: "Board Resolution",
    slug: "board-resolution-format",
    generatorUrl: "/incorporation/private-limited/board-resolution",
    category: "Corporate Compliance",
    type: "format",
    metaTitle: "Board Resolution Format - Free Templates",
    metaDescription: "Download standard board resolution formats for various corporate actions like bank account opening, authorized signatory, etc.",
    intro: "A Board Resolution is a formal document recording the decisions made by the Board of Directors.",
    whatIsIt: "It is a written record of decisions taken at a board meeting.",
    whenIsItRequired: "Required for major corporate decisions such as opening a bank account, appointing an auditor, or authorizing a representative.",
    whoNeedsIt: "Companies holding board meetings.",
    howToUse: "Select the appropriate resolution type, customize it with your company details, and have it signed by the directors.",
    faqs: [
      { question: "Who signs a board resolution?", answer: "It is usually signed by the Chairman of the meeting or the Company Secretary." }
    ],
    relatedDocs: ["DIR-2 Consent Form", "Management Representation Letter"]
  },
  {
    id: "board-resolution-pdf",
    documentName: "Board Resolution",
    slug: "board-resolution-pdf",
    generatorUrl: "/incorporation/private-limited/board-resolution",
    category: "Corporate Compliance",
    type: "pdf",
    metaTitle: "Board Resolution PDF Download",
    metaDescription: "Download generic Board Resolution PDF formats for immediate use.",
    intro: "Quickly download Board Resolution templates in PDF format.",
    whatIsIt: "PDF version of standard board resolutions.",
    whenIsItRequired: "When you need a quick printable version.",
    whoNeedsIt: "Company representatives and professionals.",
    howToUse: "Download, print, fill in the blanks manually, and sign.",
    faqs: [
      { question: "Can I edit the PDF?", answer: "PDFs are fixed format. For an editable version, please use our generator." }
    ],
    relatedDocs: ["DIR-2 Consent Form", "Management Representation Letter"]
  },
  {
    id: "board-resolution-word",
    documentName: "Board Resolution",
    slug: "board-resolution-word",
    generatorUrl: "/incorporation/private-limited/board-resolution",
    category: "Corporate Compliance",
    type: "word",
    metaTitle: "Board Resolution Word Format (.docx)",
    metaDescription: "Get the editable Board Resolution Word format for your company needs.",
    intro: "Download fully customizable Board Resolution templates in Word format.",
    whatIsIt: "MS Word version of standard board resolutions.",
    whenIsItRequired: "When you need to heavily customize the text of the resolution.",
    whoNeedsIt: "Company Secretaries, Founders, and Legal Professionals.",
    howToUse: "Open in MS Word, edit the text to match your specific decision, print, and sign.",
    faqs: [
      { question: "Are these legally binding?", answer: "Once signed by authorized directors, they are legally binding records of the company." }
    ],
    relatedDocs: ["DIR-2 Consent Form", "Management Representation Letter"]
  },
  {
    id: "board-resolution-sample",
    documentName: "Board Resolution",
    slug: "board-resolution-sample",
    generatorUrl: "/incorporation/private-limited/board-resolution",
    category: "Corporate Compliance",
    type: "sample",
    metaTitle: "Board Resolution Sample - Example Templates",
    metaDescription: "View filled samples of Board Resolutions for bank accounts and other common actions.",
    intro: "See how a completed Board Resolution should look with our detailed samples.",
    whatIsIt: "Filled examples of various board resolutions.",
    whenIsItRequired: "For reference when drafting your own complex resolutions.",
    whoNeedsIt: "Anyone tasked with drafting minutes and resolutions.",
    howToUse: "Use as a reference guide.",
    faqs: [
      { question: "Do I need to copy the sample exactly?", answer: "No, adapt it to fit your company's specific situation." }
    ],
    relatedDocs: ["DIR-2 Consent Form", "Management Representation Letter"]
  },
  // NOC
  {
    id: "noc-format",
    documentName: "NOC for Registered Office",
    slug: "noc-for-registered-office",
    generatorUrl: "/noc-format", // I see this is currently at /noc-format in the dashboard
    category: "Incorporation",
    type: "format",
    metaTitle: "NOC Format for Registered Office - Free Template",
    metaDescription: "Download the No Objection Certificate (NOC) format from the owner for the registered office of your company.",
    intro: "An NOC from the property owner is a mandatory requirement for establishing a company's registered office.",
    whatIsIt: "A letter from the property owner stating they have no objection to the company using their premises as its registered office.",
    whenIsItRequired: "During incorporation or when shifting the registered office.",
    whoNeedsIt: "Founders setting up a company in a rented, leased, or family-owned property.",
    howToUse: "Fill in owner and property details, print on plain paper, and get it signed by the owner.",
    faqs: [
      { question: "Does NOC need to be on stamp paper?", answer: "No, a plain paper NOC is generally accepted by the ROC." }
    ],
    relatedDocs: ["DIR-2 Consent Form", "Specimen Signature Card"]
  },
  {
    id: "noc-pdf",
    documentName: "NOC for Registered Office",
    slug: "noc-pdf",
    generatorUrl: "/noc-format",
    category: "Incorporation",
    type: "pdf",
    metaTitle: "NOC for Registered Office PDF Download",
    metaDescription: "Download the No Objection Certificate (NOC) PDF format for registered office.",
    intro: "Get the standard NOC format in a quick PDF download.",
    whatIsIt: "PDF version of the No Objection Certificate.",
    whenIsItRequired: "When you need a quick printable format.",
    whoNeedsIt: "Company founders and property owners.",
    howToUse: "Print, fill manually, and sign.",
    faqs: [
      { question: "Can I use this PDF directly?", answer: "Yes, you can fill in the blanks with a pen and get it signed." }
    ],
    relatedDocs: ["DIR-2 Consent Form", "Specimen Signature Card"]
  },
  {
    id: "noc-word-format",
    documentName: "NOC for Registered Office",
    slug: "noc-word-format",
    generatorUrl: "/noc-format",
    category: "Incorporation",
    type: "word",
    metaTitle: "NOC Format for Registered Office in Word",
    metaDescription: "Download the fully editable MS Word format of the NOC for registered office.",
    intro: "Editable Word format for the No Objection Certificate.",
    whatIsIt: "MS Word version of the No Objection Certificate.",
    whenIsItRequired: "When you prefer to type the details before printing.",
    whoNeedsIt: "Company professionals.",
    howToUse: "Open in MS Word, edit the details, print, and get it signed by the owner.",
    faqs: [
      { question: "What else is needed with the NOC?", answer: "A utility bill in the owner's name is usually required alongside the NOC." }
    ],
    relatedDocs: ["DIR-2 Consent Form", "Specimen Signature Card"]
  },
  {
    id: "noc-sample",
    documentName: "NOC for Registered Office",
    slug: "noc-sample",
    generatorUrl: "/noc-format",
    category: "Incorporation",
    type: "sample",
    metaTitle: "Sample NOC for Registered Office",
    metaDescription: "View a filled sample of a No Objection Certificate from a property owner.",
    intro: "See a completed example of an NOC for reference.",
    whatIsIt: "Filled example of the NOC.",
    whenIsItRequired: "For reference when drafting your own NOC.",
    whoNeedsIt: "Founders.",
    howToUse: "Reference guide.",
    faqs: [
      { question: "Is this sample legally valid?", answer: "It is just a reference. Use the generator to create your valid document." }
    ],
    relatedDocs: ["DIR-2 Consent Form", "Specimen Signature Card"]
  },
  // Management Representation Letter
  {
    id: "management-representation-letter",
    documentName: "Management Representation Letter",
    slug: "management-representation-letter",
    generatorUrl: "/incorporation/llp/mrl",
    category: "Audit & Accounts",
    type: "format",
    metaTitle: "Management Representation Letter Format",
    metaDescription: "Download standard Management Representation Letter (MRL) templates for statutory audits.",
    intro: "The Management Representation Letter is a crucial piece of audit evidence provided by management to the auditors.",
    whatIsIt: "A letter confirming the accuracy and completeness of financial information.",
    whenIsItRequired: "During statutory and tax audits, usually before the audit report is finalized.",
    whoNeedsIt: "Company Directors and Auditors.",
    howToUse: "Customize it based on the auditor's requirements, print on company letterhead, and sign by the directors.",
    faqs: [
      { question: "Is an MRL mandatory for audits?", answer: "Yes, it is required under auditing standards (SA 580)." }
    ],
    relatedDocs: ["Board Resolution", "Auditor Consent Letter"]
  },
  {
    id: "management-representation-letter-pdf",
    documentName: "Management Representation Letter",
    slug: "management-representation-letter-pdf",
    generatorUrl: "/incorporation/llp/mrl",
    category: "Audit & Accounts",
    type: "pdf",
    metaTitle: "Management Representation Letter PDF",
    metaDescription: "Download the MRL template in PDF format.",
    intro: "PDF format of the Management Representation Letter.",
    whatIsIt: "Printable PDF version of the MRL.",
    whenIsItRequired: "When you just need a standard printed copy.",
    whoNeedsIt: "Company Management.",
    howToUse: "Print and sign.",
    faqs: [
      { question: "Should it be on letterhead?", answer: "Yes, the MRL must always be on the company letterhead." }
    ],
    relatedDocs: ["Board Resolution", "Auditor Consent Letter"]
  },
  {
    id: "management-representation-letter-word",
    documentName: "Management Representation Letter",
    slug: "management-representation-letter-word",
    generatorUrl: "/incorporation/llp/mrl",
    category: "Audit & Accounts",
    type: "word",
    metaTitle: "Management Representation Letter Word Format",
    metaDescription: "Editable Word format for the Management Representation Letter.",
    intro: "Easily edit and customize the MRL with our MS Word template.",
    whatIsIt: "Editable MS Word version of the MRL.",
    whenIsItRequired: "When your auditor requests specific customized representations.",
    whoNeedsIt: "Company Directors.",
    howToUse: "Edit in Word, add your letterhead header, and sign.",
    faqs: [
      { question: "Can the auditor draft it for us?", answer: "The auditor often provides the draft, but management must take responsibility for it." }
    ],
    relatedDocs: ["Board Resolution", "Auditor Consent Letter"]
  },
  {
    id: "management-representation-letter-sample",
    documentName: "Management Representation Letter",
    slug: "management-representation-letter-sample",
    generatorUrl: "/incorporation/llp/mrl",
    category: "Audit & Accounts",
    type: "sample",
    metaTitle: "Sample Management Representation Letter",
    metaDescription: "View a completed sample of an MRL for reference.",
    intro: "Understand how a standard MRL looks when fully prepared.",
    whatIsIt: "Filled example of the MRL.",
    whenIsItRequired: "For reference.",
    whoNeedsIt: "Management and Junior Audit Staff.",
    howToUse: "Use as a reference guide.",
    faqs: [
      { question: "Do all companies use the same sample?", answer: "No, representations vary based on the specific circumstances of the audit." }
    ],
    relatedDocs: ["Board Resolution", "Auditor Consent Letter"]
  },
  // Specimen Signature Card
  {
    id: "specimen-signature-card",
    documentName: "Specimen Signature Card",
    slug: "specimen-signature-card",
    generatorUrl: "/specimen-signature",
    category: "Incorporation",
    type: "format",
    metaTitle: "Specimen Signature Card Format (INC-9, EPFO)",
    metaDescription: "Download standard specimen signature card formats for company registration and banking.",
    intro: "A specimen signature card is used to keep an official record of the authorized signatures of directors or partners.",
    whatIsIt: "A document containing the verified signatures of key personnel.",
    whenIsItRequired: "During bank account opening, EPFO registration, or company incorporation.",
    whoNeedsIt: "Directors, Partners, and Authorized Signatories.",
    howToUse: "Fill out the names, sign in the designated boxes, and have it verified/attested by a bank manager or professional.",
    faqs: [
      { question: "Does it need to be attested?", answer: "Yes, usually by a banker, CA, CS, or CMA." }
    ],
    relatedDocs: ["DIR-2 Consent Form", "Board Resolution"]
  },
  {
    id: "specimen-signature-card-pdf",
    documentName: "Specimen Signature Card",
    slug: "specimen-signature-card-pdf",
    generatorUrl: "/specimen-signature",
    category: "Incorporation",
    type: "pdf",
    metaTitle: "Specimen Signature Card PDF Download",
    metaDescription: "Printable PDF version of the specimen signature card.",
    intro: "Get a clean PDF format for immediate printing and signing.",
    whatIsIt: "PDF version of the signature card.",
    whenIsItRequired: "When you need a quick printable copy for signatures.",
    whoNeedsIt: "Authorized Signatories.",
    howToUse: "Print, sign in the boxes, and get it attested.",
    faqs: [
      { question: "Is PDF better for this?", answer: "Yes, PDFs preserve the size of the signature boxes." }
    ],
    relatedDocs: ["DIR-2 Consent Form", "Board Resolution"]
  },
  {
    id: "specimen-signature-card-word",
    documentName: "Specimen Signature Card",
    slug: "specimen-signature-card-word",
    generatorUrl: "/specimen-signature",
    category: "Incorporation",
    type: "word",
    metaTitle: "Specimen Signature Card Word Format",
    metaDescription: "Editable Word format for the specimen signature card.",
    intro: "Customize the specimen signature card with your company details in MS Word.",
    whatIsIt: "MS Word version of the signature card.",
    whenIsItRequired: "When you want to type the names and designations before printing.",
    whoNeedsIt: "Company professionals.",
    howToUse: "Edit in Word, print, and sign.",
    faqs: [
      { question: "Can I add more signature boxes?", answer: "Yes, in the Word format, you can easily add more rows for multiple signatories." }
    ],
    relatedDocs: ["DIR-2 Consent Form", "Board Resolution"]
  },
  // Director Resignation Letter
  {
    id: "director-resignation-letter",
    documentName: "Director Resignation Letter",
    slug: "director-resignation-letter",
    generatorUrl: "/incorporation/private-limited/director-resignation/resignation-letter",
    category: "Corporate Compliance",
    type: "format",
    metaTitle: "Director Resignation Letter Format",
    metaDescription: "Download the format for a director resignation letter. Ready to use under the Companies Act.",
    intro: "A formal resignation letter is the first step a director must take when leaving a company's board.",
    whatIsIt: "A formal written notice of resignation by a director addressed to the company.",
    whenIsItRequired: "When a director wishes to step down from the board.",
    whoNeedsIt: "Resigning Directors.",
    howToUse: "Customize with your dates and reasons, print, sign, and deliver to the company.",
    faqs: [
      { question: "Is an email sufficient for resignation?", answer: "A formal signed letter is strongly recommended and legally safer." }
    ],
    relatedDocs: ["DIR-2 Consent Form", "Board Resolution"]
  },
  {
    id: "director-resignation-sample",
    documentName: "Director Resignation Letter",
    slug: "director-resignation-sample",
    generatorUrl: "/incorporation/private-limited/director-resignation/resignation-letter",
    category: "Corporate Compliance",
    type: "sample",
    metaTitle: "Sample Director Resignation Letter",
    metaDescription: "View a sample resignation letter of a company director.",
    intro: "See how a professional director resignation letter should be phrased.",
    whatIsIt: "Filled example of a resignation letter.",
    whenIsItRequired: "For reference.",
    whoNeedsIt: "Resigning Directors.",
    howToUse: "Use as a reference guide.",
    faqs: [
      { question: "Do I need to state a reason?", answer: "It is good practice to state a brief reason (e.g., personal reasons, preoccupation)." }
    ],
    relatedDocs: ["DIR-2 Consent Form", "Board Resolution"]
  },
  // Auditor Consent Letter
  {
    id: "auditor-consent-letter",
    documentName: "Auditor Consent Letter",
    slug: "auditor-consent-letter",
    generatorUrl: "/incorporation/private-limited/eligibility-consent",
    category: "Audit & Accounts",
    type: "format",
    metaTitle: "Auditor Consent and Certificate Format",
    metaDescription: "Download the standard Auditor Consent and Eligibility Certificate format as required under Section 139.",
    intro: "Before appointment, an auditor must provide written consent and a certificate of eligibility.",
    whatIsIt: "A letter from the auditor accepting the appointment and confirming their eligibility under the Companies Act.",
    whenIsItRequired: "Before the appointment of the auditor in the AGM or by the Board.",
    whoNeedsIt: "Chartered Accountants and Audit Firms.",
    howToUse: "The auditor prints this on their letterhead, signs it, and provides it to the company.",
    faqs: [
      { question: "Is this required for every appointment?", answer: "Yes, written consent and a certificate are mandatory for every auditor appointment." }
    ],
    relatedDocs: ["Board Resolution", "Management Representation Letter"]
  },
  {
    id: "auditor-consent-sample",
    documentName: "Auditor Consent Letter",
    slug: "auditor-consent-sample",
    generatorUrl: "/incorporation/private-limited/eligibility-consent",
    category: "Audit & Accounts",
    type: "sample",
    metaTitle: "Sample Auditor Consent Letter",
    metaDescription: "View a sample of the Auditor Consent and Eligibility Certificate.",
    intro: "Reference sample for the auditor consent letter.",
    whatIsIt: "Filled example of the auditor consent.",
    whenIsItRequired: "For reference.",
    whoNeedsIt: "CA professionals and company management.",
    howToUse: "Reference guide.",
    faqs: [
      { question: "Does the auditor or company prepare this?", answer: "The auditor prepares and signs this on their own letterhead." }
    ],
    relatedDocs: ["Board Resolution", "Management Representation Letter"]
  },
];

/** Launch-week pages first (rich content), then remaining programmatic SEO */
export const seoDocuments: SeoDocument[] = [
  ...launchWeekDocuments,
  ...legacySeoDocuments.filter((d) => !LAUNCH_WEEK_SLUGS.has(d.slug)),
];
