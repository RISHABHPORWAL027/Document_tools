export type CalculatorCategory = "finance" | "salary" | "business";

export type InputType = "currency" | "number" | "percentage" | "select" | "toggle" | "slider" | "date";

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface CalculatorInputField {
  id: string;
  label: string;
  type: InputType;
  defaultValue: any;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  tooltip?: string;
  options?: SelectOption[];
  group?: "quick" | "detailed" | "common";
}

export interface BreakdownItem {
  label: string;
  value: number;
  formattedValue: string;
  percentage?: number;
  badge?: string;
  isTotal?: boolean;
  isDeduction?: boolean;
  subItems?: BreakdownItem[];
}

export interface AmortizationRow {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface CalculatorResultData {
  primaryTitle: string;
  primaryValue: number;
  formattedPrimaryValue: string;
  secondaryMetrics?: { label: string; value: string | number; badge?: string }[];
  breakdown: BreakdownItem[];
  tableData?: {
    headers: string[];
    rows: (string | number)[][];
  };
  explanation?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface RelatedToolItem {
  id: string;
  title: string;
  description: string;
  href: string;
  badge: string;
  icon: string;
}

export interface CalculatorConfig {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  category: CalculatorCategory;
  categoryName: string;
  icon: string;
  badge: string;

  // Inputs configuration
  hasModeToggle?: boolean;
  modeToggleOptions?: { label: string; value: string }[];
  inputs: CalculatorInputField[];

  // Calculation Engine identifier
  calculate: (inputs: Record<string, any>, mode?: string) => CalculatorResultData;

  // Formula & Method
  formulaText: string;
  formulaDescription: string;

  // SEO Content
  seoMeta: {
    title: string;
    description: string;
    keywords: string[];
  };
  whatIs: {
    title: string;
    content: string;
  };
  howItWorks: {
    title: string;
    content: string;
  };
  exampleCalculation: {
    title: string;
    scenario: string;
    steps: { label: string; value: string }[];
    conclusion: string;
  };
  factorsAffecting: {
    title: string;
    factors: { name: string; impact?: string; value?: string }[];
  };

  faqs: FAQItem[];
  relatedCalculatorSlugs: string[];
  relatedComplianceTools: RelatedToolItem[];
}
