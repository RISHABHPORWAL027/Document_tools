export type HolidayCategory = "national" | "bank" | "government" | "festival" | "state" | "restricted";

export interface HolidayItem {
  id: string;
  date: string; // YYYY-MM-DD
  year: number; // e.g. 2026
  month: number; // 1-12
  dayName: string; // e.g. "Monday"
  title: string;
  category: HolidayCategory;
  categoryName: string;
  states: string[]; // ["all"] or ["karnataka", "maharashtra", ...]
  isRestricted?: boolean;
  description?: string;
  longWeekendEligible?: boolean;
}

export interface StateInfo {
  code: string;
  name: string;
  slug: string;
  capital: string;
}

export interface LongWeekendPlan {
  id: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  holidays: HolidayItem[];
  leaveDaysRequired: number;
  leaveDates: string[];
  recommendationReason: string;
  summary: string;
}

export interface LeavePlannerResult {
  totalLeavesAvailable: number;
  leavesUsed: number;
  totalDaysOffGained: number;
  multiplier: string;
  plans: LongWeekendPlan[];
}
