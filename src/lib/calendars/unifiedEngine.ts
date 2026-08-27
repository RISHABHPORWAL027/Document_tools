import { HOLIDAYS_DATA, getHolidaysByYear } from "./holidays/holidaysData";
import { COMPLIANCE_ITEMS } from "./compliance/complianceData";
import { HolidayItem } from "./holidays/types";
import { ComplianceItem } from "./compliance/types";
import { findLongWeekends, planOptimalLeaves } from "./holidays/longWeekendEngine";

export type EventKind = "national_holiday" | "state_holiday" | "bank_holiday" | "festival_holiday" | "compliance_deadline" | "long_weekend";

export interface UnifiedCalendarEvent {
  id: string;
  kind: EventKind;
  date: string; // YYYY-MM-DD
  title: string;
  subtitle: string;
  categoryName: string;
  badgeColor: string; // "emerald" | "blue" | "amber" | "red" | "purple"
  states: string[];
  isHoliday: boolean;
  isCompliance: boolean;
  isBankClosed?: boolean;
  rawHoliday?: HolidayItem;
  rawCompliance?: ComplianceItem;
}

export interface ActiveFilters {
  showNational: boolean;
  showState: boolean;
  showBank: boolean;
  showFestival: boolean;
  showGst: boolean;
  showIncomeTax: boolean;
  showTds: boolean;
  showRoc: boolean;
}

export const DEFAULT_FILTERS: ActiveFilters = {
  showNational: true,
  showState: true,
  showBank: true,
  showFestival: true,
  showGst: true,
  showIncomeTax: true,
  showTds: true,
  showRoc: true,
};

export function getUnifiedEvents(
  year: number = 2026,
  month: number = 0, // 0 = all months, 1-12 = specific month
  state: string = "all",
  filters: ActiveFilters = DEFAULT_FILTERS
): UnifiedCalendarEvent[] {
  const events: UnifiedCalendarEvent[] = [];

  // 1. Process Holidays
  const holidays = getHolidaysByYear(year, state);
  holidays.forEach((h) => {
    if (month > 0 && h.month !== month) return;

    let include = false;
    let kind: EventKind = "festival_holiday";
    let badgeColor = "blue";

    if (h.category === "national") {
      include = filters.showNational;
      kind = "national_holiday";
      badgeColor = "emerald";
    } else if (h.category === "state") {
      include = filters.showState;
      kind = "state_holiday";
      badgeColor = "purple";
    } else if (h.category === "bank") {
      include = filters.showBank;
      kind = "bank_holiday";
      badgeColor = "amber";
    } else {
      include = filters.showFestival;
      kind = "festival_holiday";
      badgeColor = "blue";
    }

    if (include) {
      events.push({
        id: `event-${h.id}`,
        kind,
        date: h.date,
        title: h.title,
        subtitle: `${h.categoryName} • ${h.dayName}`,
        categoryName: h.categoryName,
        badgeColor,
        states: h.states,
        isHoliday: true,
        isCompliance: false,
        isBankClosed: h.category === "national" || h.category === "bank",
        rawHoliday: h,
      });
    }
  });

  // 2. Process Compliance Items
  COMPLIANCE_ITEMS.forEach((c) => {
    const cDate = new Date(c.dueDate);
    if (cDate.getFullYear() !== year) return;
    if (month > 0 && cDate.getMonth() + 1 !== month) return;

    let include = false;
    if (c.category === "gst") include = filters.showGst;
    else if (c.category === "income_tax") include = filters.showIncomeTax;
    else if (c.category === "tds") include = filters.showTds;
    else if (c.category === "roc") include = filters.showRoc;

    if (include) {
      events.push({
        id: `event-${c.id}`,
        kind: "compliance_deadline",
        date: c.dueDate,
        title: c.title,
        subtitle: `${c.categoryName} Deadline • ${c.whoShouldFile}`,
        categoryName: c.categoryName,
        badgeColor: c.badgeColor === "red" ? "red" : "amber",
        states: ["all"],
        isHoliday: false,
        isCompliance: true,
        rawCompliance: c,
      });
    }
  });

  // Sort chronologically
  return events.sort((a, b) => a.date.localeCompare(b.date));
}

export interface TodaySummary {
  todayDate: string;
  isTodayHoliday: boolean;
  todayHolidayName?: string;
  nextHoliday?: UnifiedCalendarEvent;
  daysToNextHoliday: number;
  nextCompliance?: UnifiedCalendarEvent;
  daysToNextCompliance: number;
  thisWeekHolidaysCount: number;
  thisWeekComplianceCount: number;
}

export function getTodayDashboardSummary(dateStr?: string, state: string = "all"): TodaySummary {
  const targetDate = dateStr ? new Date(dateStr) : new Date();
  const targetDateStr = targetDate.toISOString().split("T")[0];

  const year = targetDate.getFullYear();
  const allEvents = getUnifiedEvents(year, 0, state);

  const todayEvents = allEvents.filter((e) => e.date === targetDateStr);
  const todayHoliday = todayEvents.find((e) => e.isHoliday);

  const futureHolidays = allEvents.filter((e) => e.isHoliday && e.date > targetDateStr);
  const nextHoliday = futureHolidays[0];

  const futureCompliance = allEvents.filter((e) => e.isCompliance && e.date >= targetDateStr);
  const nextCompliance = futureCompliance[0];

  const calcDaysDiff = (dStr?: string) => {
    if (!dStr) return 0;
    const diffTime = new Date(dStr).getTime() - targetDate.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  // 7-day window
  const weekEndDate = new Date(targetDate);
  weekEndDate.setDate(weekEndDate.getDate() + 7);
  const weekEndStr = weekEndDate.toISOString().split("T")[0];

  const thisWeekEvents = allEvents.filter((e) => e.date >= targetDateStr && e.date <= weekEndStr);
  const thisWeekHolidaysCount = thisWeekEvents.filter((e) => e.isHoliday).length;
  const thisWeekComplianceCount = thisWeekEvents.filter((e) => e.isCompliance).length;

  return {
    todayDate: targetDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", weekday: "long" }),
    isTodayHoliday: !!todayHoliday,
    todayHolidayName: todayHoliday?.title,
    nextHoliday,
    daysToNextHoliday: calcDaysDiff(nextHoliday?.date),
    nextCompliance,
    daysToNextCompliance: calcDaysDiff(nextCompliance?.date),
    thisWeekHolidaysCount,
    thisWeekComplianceCount,
  };
}

export function getMonthlyCalendarGrid(year: number, month: number, state: string = "all", filters: ActiveFilters = DEFAULT_FILTERS) {
  const events = getUnifiedEvents(year, month, state, filters);
  const firstDay = new Date(year, month - 1, 1).getDay(); // 0 = Sun
  const totalDays = new Date(year, month, 0).getDate();

  const days: { dayNumber: number; dateStr: string; events: UnifiedCalendarEvent[] }[] = [];

  for (let i = 1; i <= totalDays; i++) {
    const dayStr = i < 10 ? `0${i}` : `${i}`;
    const monthStr = month < 10 ? `0${month}` : `${month}`;
    const dateStr = `${year}-${monthStr}-${dayStr}`;

    const dayEvents = events.filter((e) => e.date === dateStr);
    days.push({
      dayNumber: i,
      dateStr,
      events: dayEvents,
    });
  }

  return {
    firstDayPadding: firstDay,
    totalDays,
    days,
  };
}
