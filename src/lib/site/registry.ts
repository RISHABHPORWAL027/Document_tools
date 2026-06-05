/**
 * Single source of truth for workspace flows and document generators.
 * Add new tools here — they appear on the home catalogue and in the right module.
 */

export type DocCard = {
  id: string;
  title: string;
  description: string;
  badge: string;
  /** Base path for the generator page. Company ID will be appended as ?company=ID */
  href: string;
  icon: string;
  /** When true, card is a preview — not yet available */
  comingSoon?: boolean;
};

export type ToolStatus = "live" | "coming_soon";

export type FlowId = "incorporation" | "bank_account" | "gst" | "payslips" | "invoice";

export type SubflowDefinition = {
  id: string;
  flowId: FlowId;
  title: string;
  /** Short line under the title on module pages */
  summary?: string;
  /** Display order within the workflow */
  order: number;
  /**
   * `shared` — bucket used across paths (no step number).
   * `numbered` — typical child flow, shown as "1) Title".
   */
  variant: "shared" | "numbered";
};

export type FlowDefinition = {
  id: FlowId;
  /** URL segment — maps to `/${path}` in the dashboard */
  path: string;
  title: string;
  subtitle: string;
  icon: string;
  accentColor: string;
  requiredDocs: string[];
  /** Sort order on workspace home */
  order: number;
};

export type ToolDefinition = {
  id: string;
  title: string;
  description: string;
  href: string;
  badge: string;
  icon: string;
  flowId: FlowId;
  /** Child workflow step — must match a subflow id for this flow */
  subflowId: string;
  status: ToolStatus;
  /** Optional — e.g. MCA, Bank — for filters later */
  tags?: string[];
};

export const SUBFLOWS: SubflowDefinition[] = (
  [
    {
      id: "inc-shared",
      flowId: "incorporation",
      title: "Incorporation",
      summary: "Core documents for the SPICe+ filing process.",
      order: 1,
      variant: "shared",
    },
    {
      id: "inc-auditor-first",
      flowId: "incorporation",
      title: "First Auditor Appointment",
      summary: "Documents required for the first auditor appointment after incorporation.",
      order: 2,
      variant: "shared",
    },
    {
      id: "inc-auditor-casual",
      flowId: "incorporation",
      title: "Casual Vacancy of Auditor",
      summary: "Required when an auditor resigns or a vacancy arises before the term ends.",
      order: 3,
      variant: "shared",
    },
    {
      id: "inc-auditor-reappointment",
      flowId: "incorporation",
      title: "Reappointment of Auditor",
      summary: "AGM resolution, appointment letter, acceptance letter, and consent certificate.",
      order: 4,
      variant: "shared",
    },
    {
      id: "inc-auditor-resignation",
      flowId: "incorporation",
      title: "Resignation",
      summary: "Required documents for resignation of directors or statutory auditors.",
      order: 5,
      variant: "shared",
    },
    {
      id: "inc-private-limited",
      flowId: "incorporation",
      title: "Private Limited",
      order: 6,
      variant: "numbered",
    },
    {
      id: "inc-llp",
      flowId: "incorporation",
      title: "LLP",
      order: 7,
      variant: "numbered",
    },
    {
      id: "inc-section-8",
      flowId: "incorporation",
      title: "Section 8 Company",
      order: 8,
      variant: "numbered",
    },
    {
      id: "inc-public-limited",
      flowId: "incorporation",
      title: "Public Limited",
      order: 9,
      variant: "numbered",
    },
    {
      id: "inc-foreign-subsidiary",
      flowId: "incorporation",
      title: "Foreign Subsidiary Company",
      order: 10,
      variant: "numbered",
    },
    {
      id: "inc-nidhi",
      flowId: "incorporation",
      title: "Nidhi Company",
      order: 11,
      variant: "numbered",
    },
    {
      id: "inc-producer",
      flowId: "incorporation",
      title: "Producer Company",
      order: 12,
      variant: "numbered",
    },
    {
      id: "gst-cancellation",
      flowId: "gst",
      title: "GST Cancellation",
      order: 1,
      variant: "numbered",
    },
    {
      id: "gst-registration",
      flowId: "gst",
      title: "GST Registration",
      order: 2,
      variant: "numbered",
    },
    {
      id: "gst-authorization",
      flowId: "gst",
      title: "GST Authorization",
      order: 3,
      variant: "numbered",
    },
    {
      id: "bank-resolution",
      flowId: "bank_account",
      title: "Bank account resolution & opening pack",
      summary: "Board resolution and bank-facing letters.",
      order: 1,
      variant: "numbered",
    },
    {
      id: "payslips-shared",
      flowId: "payslips",
      title: "Payslips & Payroll",
      summary: "Create and print customized monthly payslips for your employees.",
      order: 1,
      variant: "shared",
    },
    {
      id: "invoice-shared",
      flowId: "invoice",
      title: "Invoices",
      summary: "Create and print customized professional invoices.",
      order: 1,
      variant: "shared",
    },
  ] as SubflowDefinition[]
);

export const FLOWS = (
  [
  {
    id: "incorporation",
    path: "incorporation",
    title: "Company / LLP Incorporation",
    subtitle: "Choose entity type, then use shared or path-specific generators.",
    icon: "🏛️",
    accentColor: "#1a2e7e",
    order: 1,
    requiredDocs: [
      "PAN Card of all Directors",
      "Aadhaar Card of all Directors",
      "Passport Size Photo of Directors",
      "Address Proof (Electricity Bill / Bank Statement)",
      "Rent Agreement / NOC from Owner",
      "MOA & AOA Draft",
      "DSC (Digital Signature Certificate)",
      "DIN (Director Identification Number)",
    ],
  },
  {
    id: "bank_account",
    path: "bank-account",
    title: "Bank Account Opening",
    subtitle: "Current account opening pack for your company.",
    icon: "🏦",
    accentColor: "#0e7490",
    order: 2,
    requiredDocs: [
      "Certificate of Incorporation",
      "MOA & AOA",
      "Board Resolution for Bank Account Opening",
      "PAN Card of Company",
      "PAN & Aadhaar of all Directors/Signatories",
      "Latest Address Proof of Registered Office",
      "KYC Documents of all Directors",
      "Specimen Signatures of Authorised Signatories",
    ],
  },
  {
    id: "gst",
    path: "gst",
    title: "GST",
    subtitle: "Cancellation, registration, and authorization — grouped by sub-stage.",
    icon: "🧾",
    accentColor: "#15803d",
    order: 3,
    requiredDocs: [
      "PAN Card of Business / Proprietor",
      "Aadhaar Card of Promoters / Partners / Directors",
      "Proof of Business Registration",
      "Identity Proof of Promoters",
      "Address Proof of Principal Place of Business",
      "Bank Account Details",
      "Digital Signature (for companies & LLPs)",
      "Letter of Authorisation",
    ],
  },
  {
    id: "payslips",
    path: "payslips",
    title: "Payslips & Payroll",
    subtitle: "Generate, customize, and print professional employee salary slips.",
    icon: "💵",
    accentColor: "#f59e0b",
    order: 4,
    requiredDocs: [
      "Employee PAN & Aadhaar details",
      "Salary structure details",
      "Bank account information",
      "Company attendance registers",
    ],
  },
  {
    id: "invoice",
    path: "invoice",
    title: "Invoices",
    subtitle: "Generate, customize, and download professional invoices.",
    icon: "🧾",
    accentColor: "#059669",
    order: 5,
    requiredDocs: [
      "Seller PAN & GSTIN details",
      "Client Billing and Shipping addresses",
      "Item descriptions & pricing structures",
      "Payment terms & PO numbers",
    ],
  },
] as FlowDefinition[]
).sort((a, b) => a.order - b.order);

export const TOOLS: ToolDefinition[] = [
  {
    id: "dir2",
    title: "DIR-2 Consent Form",
    description: "Consent to act as director — mandatory for SPICe+ filing.",
    badge: "MCA",
    icon: "📄",
    href: "/dir-2-format",
    flowId: "incorporation",
    subflowId: "inc-shared",
    status: "live",
    tags: ["MCA", "Director"],
  },
  {
    id: "specimen",
    title: "Specimen Signature Card",
    description: "Specimen signatures of directors for MCA / bank records.",
    badge: "MCA",
    icon: "✍️",
    href: "/specimen-signature",
    flowId: "incorporation",
    subflowId: "inc-shared",
    status: "live",
    tags: ["MCA", "Bank"],
  },
  {
    id: "noc",
    title: "NOC from Owner",
    description: "No Objection Certificate for registered office address.",
    badge: "Regd. Office",
    icon: "🏠",
    href: "/noc-format",
    flowId: "incorporation",
    subflowId: "inc-shared",
    status: "live",
    tags: ["MCA", "Regd. Office"],
  },
  {
    id: "mrl",
    title: "Management Representation Letter",
    description: "MRL for statutory audit and compliance confirmation.",
    badge: "Audit",
    icon: "📝",
    href: "/incorporation/llp/mrl",
    flowId: "incorporation",
    subflowId: "inc-llp",
    status: "live",
    tags: ["Audit"],
  },
  {
    id: "llp-form9",
    title: "Form 9 — Consent as Designated Partner",
    description:
      "LLP designated partner consent draft — PDF/DOCX with live preview.",
    badge: "LLP · MCA",
    icon: "📋",
    href: "/llp/form9",
    flowId: "incorporation",
    subflowId: "inc-llp",
    status: "live",
    tags: ["LLP", "FiLLiP", "Designated Partner"],
  },
  {
    id: "llp-noc-ro",
    title: "NOC — Registered Office (LLP)",
    description:
      "Owner consent for LLP registered office — DPIN acceptance block.",
    badge: "LLP · Regd. Office",
    icon: "🏠",
    href: "/llp/noc-ro",
    flowId: "incorporation",
    subflowId: "inc-llp",
    status: "live",
    tags: ["LLP", "NOC", "MCA"],
  },
  {
    id: "llp-subscription",
    title: "Subscription Sheet",
    description:
      "Partner contribution table with totals — LLP formation pack.",
    badge: "LLP",
    icon: "📊",
    href: "/llp/subscription",
    flowId: "incorporation",
    subflowId: "inc-llp",
    status: "live",
    tags: ["LLP", "Contribution", "FiLLiP"],
  },
  {
    id: "board-resolution",
    title: "Board Resolution",
    description: "Certified true copy of board resolution for incorporation.",
    badge: "MCA",
    icon: "📋",
    href: "/incorporation/private-limited/board-resolution",
    flowId: "incorporation",
    subflowId: "inc-auditor-first",
    status: "live",
    tags: ["MCA", "Board Resolution"],
  },
  {
    id: "eligibility-consent",
    title: "Eligibility & Consent Letter",
    description: "Auditor eligibility and consent letter for appointment.",
    badge: "Audit",
    icon: "✉️",
    href: "/incorporation/private-limited/eligibility-consent",
    flowId: "incorporation",
    subflowId: "inc-auditor-first",
    status: "live",
    tags: ["Audit", "Incorporation"],
  },
  {
    id: "appointment-letter",
    title: "Letter of Appointment",
    description: "Formal letter of appointment for directors/auditors.",
    badge: "Legal",
    icon: "📄",
    href: "/incorporation/private-limited/appointment-letter",
    flowId: "incorporation",
    subflowId: "inc-auditor-first",
    status: "live",
    tags: ["Legal", "Director"],
  },
  {
    id: "first-auditor-attendance-sheet",
    title: "BM Attendance Sheet",
    description: "Attendance sheet of the board meeting for first auditor appointment.",
    badge: "Auditor",
    icon: "📋",
    href: "/incorporation/private-limited/attendance-sheet",
    flowId: "incorporation",
    subflowId: "inc-auditor-first",
    status: "live",
    tags: ["Auditor", "Attendance"],
  },
  {
    id: "board-resolution-bank",
    title: "Board Resolution (Bank)",
    description: "Resolution authorising opening of current bank account.",
    badge: "Bank",
    icon: "🏦",
    href: "/incorporation/private-limited/bank-account",
    flowId: "bank_account",
    subflowId: "bank-resolution",
    status: "live",
    tags: ["Bank"],
  },
  {
    id: "authorised-signatory",
    title: "Authorised Signatory Letter",
    description: "Letter declaring authorised signatories for the bank account.",
    badge: "Bank",
    icon: "✉️",
    href: "#",
    flowId: "bank_account",
    subflowId: "bank-resolution",
    status: "coming_soon",
    tags: ["Bank"],
  },
  {
    id: "specimen-bank",
    title: "Specimen Signature Card",
    description: "Specimen signatures of authorised signatories for the bank.",
    badge: "Bank",
    icon: "✍️",
    href: "/specimen-signature",
    flowId: "bank_account",
    subflowId: "bank-resolution",
    status: "live",
    tags: ["Bank"],
  },
  {
    id: "gst-auth-letter",
    title: "GST Authorisation Letter",
    description: "Letter authorising a representative for GST filing.",
    badge: "GST",
    icon: "📜",
    href: "#",
    flowId: "gst",
    subflowId: "gst-authorization",
    status: "coming_soon",
    tags: ["GST"],
  },
  {
    id: "gst-cover-letter",
    title: "GST Cover Letter",
    description: "Cover letter with GST registration application.",
    badge: "GST",
    icon: "✉️",
    href: "#",
    flowId: "gst",
    subflowId: "gst-registration",
    status: "coming_soon",
    tags: ["GST"],
  },
  {
    id: "business-declaration",
    title: "Business Activity Declaration",
    description: "Declaration of principal business activity for GST purposes.",
    badge: "GST",
    icon: "🏢",
    href: "#",
    flowId: "gst",
    subflowId: "gst-registration",
    status: "coming_soon",
    tags: ["GST"],
  },
  {
    id: "board-resolution-gst",
    title: "Board Resolution for GST",
    description: "Resolution authorising GST registration and signatory.",
    badge: "MCA / GST",
    icon: "📋",
    href: "#",
    flowId: "gst",
    subflowId: "gst-registration",
    status: "coming_soon",
    tags: ["GST", "MCA"],
  },
  {
    id: "auditor-cv-egm",
    title: "EGM Resolution",
    description: "Ordinary resolution for appointing a statutory auditor in casual vacancy.",
    badge: "Auditor",
    icon: "📋",
    href: "/incorporation/private-limited/auditor/casual-vacancy/egm-resolution",
    flowId: "incorporation",
    subflowId: "inc-auditor-casual",
    status: "live",
    tags: ["Auditor", "Resolution"],
  },
  {
    id: "auditor-cv-appointment",
    title: "Appointment Letter",
    description: "Letter informing the auditor firm of their appointment.",
    badge: "Auditor",
    icon: "✉️",
    href: "/incorporation/private-limited/auditor/casual-vacancy/appointment-letter",
    flowId: "incorporation",
    subflowId: "inc-auditor-casual",
    status: "live",
    tags: ["Auditor", "Appointment"],
  },
  {
    id: "auditor-cv-eligibility",
    title: "Eligibility Certificate",
    description: "Certificate of eligibility cum consent from the auditor.",
    badge: "Auditor",
    icon: "📄",
    href: "/incorporation/private-limited/auditor/casual-vacancy/eligibility-certificate",
    flowId: "incorporation",
    subflowId: "inc-auditor-casual",
    status: "live",
    tags: ["Auditor", "Consent"],
  },
  {
    id: "auditor-ra-agm-resolution",
    title: "AGM Resolution",
    description: "Ordinary resolution passed at AGM for auditor reappointment.",
    badge: "Auditor",
    icon: "📋",
    href: "/incorporation/private-limited/auditor/reappointment/agm-resolution",
    flowId: "incorporation",
    subflowId: "inc-auditor-reappointment",
    status: "live",
    tags: ["Auditor", "Resolution", "AGM"],
  },
  {
    id: "auditor-ra-appointment-letter",
    title: "Appointment Letter",
    description: "Company letter confirming auditor reappointment for five financial years.",
    badge: "Auditor",
    icon: "✉️",
    href: "/incorporation/private-limited/auditor/reappointment/appointment-letter",
    flowId: "incorporation",
    subflowId: "inc-auditor-reappointment",
    status: "live",
    tags: ["Auditor", "Appointment"],
  },
  {
    id: "auditor-ra-acceptance-letter",
    title: "Acceptance Letter",
    description: "Auditor acceptance letter for reappointment as statutory auditor.",
    badge: "Auditor",
    icon: "✅",
    href: "/incorporation/private-limited/auditor/reappointment/acceptance-letter",
    flowId: "incorporation",
    subflowId: "inc-auditor-reappointment",
    status: "live",
    tags: ["Auditor", "Acceptance"],
  },
  {
    id: "auditor-ra-consent-certificate",
    title: "Consent Letter and Certificate",
    description: "Eligibility certificate and consent under sections 139 and 141.",
    badge: "Auditor",
    icon: "📄",
    href: "/incorporation/private-limited/auditor/reappointment/consent-certificate",
    flowId: "incorporation",
    subflowId: "inc-auditor-reappointment",
    status: "live",
    tags: ["Auditor", "Consent", "Certificate"],
  },
  {
    id: "auditor-resignation",
    title: "Resignation of Auditor",
    description: "Documents for resignation of the statutory auditor.",
    badge: "Auditor",
    icon: "📄",
    href: "#",
    flowId: "incorporation",
    subflowId: "inc-auditor-resignation",
    status: "coming_soon",
  },
  {
    id: "director-resignation-letter",
    title: "Resignation Letter",
    description: "Formal resignation notice tendered by a director.",
    badge: "Director",
    icon: "✉️",
    href: "/incorporation/private-limited/director-resignation/resignation-letter",
    flowId: "incorporation",
    subflowId: "inc-auditor-resignation",
    status: "live",
    tags: ["Director", "Resignation"],
  },
  {
    id: "director-resignation-acknowledgement",
    title: "Acknowledgement Letter",
    description: "Company's acknowledgement of receipt of resignation.",
    badge: "Director",
    icon: "📄",
    href: "/incorporation/private-limited/director-resignation/acknowledgement",
    flowId: "incorporation",
    subflowId: "inc-auditor-resignation",
    status: "live",
    tags: ["Director", "Resignation"],
  },
  {
    id: "director-resignation-board-resolution",
    title: "Board Resolution",
    description: "Resolution passed by the board accepting the director's resignation.",
    badge: "Director",
    icon: "📋",
    href: "/incorporation/private-limited/director-resignation/board-resolution",
    flowId: "incorporation",
    subflowId: "inc-auditor-resignation",
    status: "live",
    tags: ["Director", "Resignation", "Resolution"],
  },
  {
    id: "director-resignation-attendance-sheet",
    title: "BM Attendance Sheet",
    description: "Attendance sheet for the board meeting accepting resignation.",
    badge: "Director",
    icon: "📋",
    href: "/incorporation/private-limited/director-resignation/attendance-sheet",
    flowId: "incorporation",
    subflowId: "inc-auditor-resignation",
    status: "live",
    tags: ["Director", "Resignation", "Attendance"],
  },
  {
    id: "payslip-generator",
    title: "Salary Payslip Generator",
    description: "Generate professional salary slips with multiple templates, logo, and automated net pay calculation.",
    badge: "Payroll",
    icon: "📄",
    href: "/payslips",
    flowId: "payslips",
    subflowId: "payslips-shared",
    status: "live",
    tags: ["Payroll", "HR", "Payslip"],
  },
  {
    id: "invoice-generator",
    title: "Invoice Generator",
    description: "Generate professional invoices with custom line items, tax, discount, shipping calculations, and logo uploads.",
    badge: "Invoicing",
    icon: "📄",
    href: "/invoice",
    flowId: "invoice",
    subflowId: "invoice-shared",
    status: "live",
    tags: ["Invoicing", "Sales", "Invoice"],
  },
];

const flowById = Object.fromEntries(FLOWS.map((f) => [f.id, f])) as Record<
  FlowId,
  FlowDefinition
>;

export function getFlow(id: FlowId): FlowDefinition {
  return flowById[id];
}

export function subflowsForFlow(flowId: FlowId): SubflowDefinition[] {
  return SUBFLOWS.filter((s) => s.flowId === flowId).sort(
    (a, b) => a.order - b.order,
  );
}

export function getSubflow(flowId: FlowId, subflowId: string): SubflowDefinition | undefined {
  return SUBFLOWS.find((s) => s.flowId === flowId && s.id === subflowId);
}

export function toolsForFlow(flowId: FlowId): ToolDefinition[] {
  return TOOLS.filter((t) => t.flowId === flowId);
}

export function toolsForSubflow(flowId: FlowId, subflowId: string): ToolDefinition[] {
  return TOOLS.filter((t) => t.flowId === flowId && t.subflowId === subflowId);
}

export type WorkflowDocGroup = {
  subflow: SubflowDefinition;
  docs: DocCard[];
};

function toolToDocCard(t: ToolDefinition): DocCard {
  return {
    id: t.id,
    title: t.title,
    description: t.description,
    badge: t.badge,
    href: t.status === "live" ? t.href : "#",
    icon: t.icon,
    comingSoon: t.status === "coming_soon",
  };
}

/** Module page: one section per subflow, tools nested underneath */
export function moduleGroupedDocsForFlow(flowId: FlowId): WorkflowDocGroup[] {
  return subflowsForFlow(flowId).map((subflow) => ({
    subflow,
    docs: toolsForSubflow(flowId, subflow.id).map(toolToDocCard),
  }));
}

/** Live-only cards (e.g. deep links that must resolve) */
export function docCardsForFlow(flowId: FlowId): DocCard[] {
  return toolsForFlow(flowId)
    .filter((t) => t.status === "live")
    .map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      badge: t.badge,
      href: t.href,
      icon: t.icon,
    }));
}

/** Flat list of module cards (legacy); prefer moduleGroupedDocsForFlow */
export function moduleDocCardsForFlow(flowId: FlowId): DocCard[] {
  return toolsForFlow(flowId).map(toolToDocCard);
}

export function allLiveTools(): ToolDefinition[] {
  return TOOLS.filter((t) => t.status === "live");
}

export type RelatedDoc = {
  id: string;
  title: string;
  href: string;
  icon: string;
};

export function getRelatedDocs(currentToolId: string, currentSubflowId: string): RelatedDoc[] {
  return allLiveTools()
    .filter((t) => t.id !== currentToolId && t.status === "live" && t.href !== "#" && t.href !== "")
    .sort((a, b) => {
      if (a.subflowId === currentSubflowId && b.subflowId !== currentSubflowId) return -1;
      if (a.subflowId !== currentSubflowId && b.subflowId === currentSubflowId) return 1;
      return 0;
    })
    .slice(0, 4)
    .map((t) => ({
      id: t.id,
      title: t.title,
      href: t.href,
      icon: t.icon,
    }));
}

export function allFlowsSorted(): FlowDefinition[] {
  return [...FLOWS].sort((a, b) => a.order - b.order);
}

/** Nav / command-palette style search over flows and tools */
export type GlobalSearchHit =
  | { kind: "flow"; flow: FlowDefinition }
  | { kind: "tool"; tool: ToolDefinition; flow: FlowDefinition };

function includesI(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle);
}

export function searchWorkspace(query: string, limit = 15): GlobalSearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const flowHits: GlobalSearchHit[] = [];
  for (const flow of FLOWS) {
    const blob = `${flow.title} ${flow.subtitle} ${flow.path} ${flow.id}`;
    if (includesI(blob, q)) {
      flowHits.push({ kind: "flow", flow });
    }
  }

  const toolHits: GlobalSearchHit[] = [];
  for (const tool of TOOLS) {
    const flow = flowById[tool.flowId];
    const sub = getSubflow(tool.flowId, tool.subflowId);
    const blob = `${tool.title} ${tool.description} ${tool.badge} ${tool.flowId} ${tool.subflowId} ${sub?.title ?? ""} ${(tool.tags ?? []).join(" ")} ${flow.title}`;
    if (includesI(blob, q)) {
      toolHits.push({ kind: "tool", tool, flow });
    }
  }

  return [...flowHits, ...toolHits].slice(0, limit);
}
