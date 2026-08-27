export type ComplianceCategory = "gst" | "income_tax" | "tds" | "roc";
export type BusinessEntityType = "pvt_ltd" | "llp" | "proprietorship" | "gst_registered" | "employer";

export interface ComplianceItem {
  id: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  monthYear: string; // e.g. "august-2026"
  category: ComplianceCategory;
  categoryName: string;
  badgeColor: string; // "red" | "amber" | "blue" | "emerald"
  applicableEntities: BusinessEntityType[];
  whoShouldFile: string;
  description: string;
  penaltyInfo?: string;
  officialLink?: string;
  frequency: "monthly" | "quarterly" | "annual" | "event_based";
  isUrgent?: boolean;
}

export interface ComplianceCategoryInfo {
  id: ComplianceCategory;
  name: string;
  slug: string;
  icon: string;
  description: string;
}
