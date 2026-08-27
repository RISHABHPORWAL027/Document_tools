import { HolidayItem, LongWeekendPlan, LeavePlannerResult } from "./types";
import { getHolidaysByYear } from "./holidaysData";

export function findLongWeekends(year: number = 2026, state: string = "all"): LongWeekendPlan[] {
  const holidays = getHolidaysByYear(year, state);
  const plans: LongWeekendPlan[] = [];

  holidays.forEach((h) => {
    const date = new Date(h.date);
    const dayOfWeek = date.getDay(); // 0 = Sun, 1 = Mon, ..., 5 = Fri, 6 = Sat

    // 1. Natural 3-day long weekends (Friday or Monday Holiday)
    if (dayOfWeek === 5) {
      // Friday Holiday -> Fri + Sat + Sun = 3 Days
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 2);

      plans.push({
        id: `lw-${h.id}`,
        startDate: h.date,
        endDate: endDate.toISOString().split("T")[0],
        durationDays: 3,
        holidays: [h],
        leaveDaysRequired: 0,
        leaveDates: [],
        recommendationReason: "Natural 3-Day Long Weekend! No leave required.",
        summary: `Friday (${h.title}) + Saturday + Sunday = 3 Days Off 🎉`,
      });
    } else if (dayOfWeek === 1) {
      // Monday Holiday -> Sat + Sun + Mon = 3 Days
      const startDate = new Date(date);
      startDate.setDate(startDate.getDate() - 2);

      plans.push({
        id: `lw-${h.id}`,
        startDate: startDate.toISOString().split("T")[0],
        endDate: h.date,
        durationDays: 3,
        holidays: [h],
        leaveDaysRequired: 0,
        leaveDates: [],
        recommendationReason: "Natural 3-Day Long Weekend! No leave required.",
        summary: `Saturday + Sunday + Monday (${h.title}) = 3 Days Off 🎉`,
      });
    }

    // 2. Take 1 Leave, Get 4 Days Off (Thursday or Tuesday Holiday)
    else if (dayOfWeek === 4) {
      // Thursday Holiday -> Thu (Holiday) + Fri (Take 1 Leave) + Sat + Sun = 4 Days
      const friDate = new Date(date);
      friDate.setDate(friDate.getDate() + 1);
      const friStr = friDate.toISOString().split("T")[0];

      const sunDate = new Date(date);
      sunDate.setDate(sunDate.getDate() + 3);

      plans.push({
        id: `lw-bridge-${h.id}`,
        startDate: h.date,
        endDate: sunDate.toISOString().split("T")[0],
        durationDays: 4,
        holidays: [h],
        leaveDaysRequired: 1,
        leaveDates: [friStr],
        recommendationReason: `Take 1 Leave on Friday (${friStr}) to bridge Thursday holiday!`,
        summary: `Thursday (${h.title}) + Friday (Leave) + Sat + Sun = 4 Days Off 🎉`,
      });
    } else if (dayOfWeek === 2) {
      // Tuesday Holiday -> Sat + Sun + Mon (Take 1 Leave) + Tue (Holiday) = 4 Days
      const monDate = new Date(date);
      monDate.setDate(monDate.getDate() - 1);
      const monStr = monDate.toISOString().split("T")[0];

      const satDate = new Date(date);
      satDate.setDate(satDate.getDate() - 3);

      plans.push({
        id: `lw-bridge-${h.id}`,
        startDate: satDate.toISOString().split("T")[0],
        endDate: h.date,
        durationDays: 4,
        holidays: [h],
        leaveDaysRequired: 1,
        leaveDates: [monStr],
        recommendationReason: `Take 1 Leave on Monday (${monStr}) to bridge Tuesday holiday!`,
        summary: `Sat + Sun + Monday (Leave) + Tuesday (${h.title}) = 4 Days Off 🎉`,
      });
    }
  });

  return plans;
}

export function planOptimalLeaves(
  availableLeaves: number = 15,
  year: number = 2026,
  state: string = "all"
): LeavePlannerResult {
  const allLongWeekends = findLongWeekends(year, state);
  
  // Sort long weekends by efficiency multiplier (durationDays / max(1, leaveDaysRequired))
  const sortedPlans = [...allLongWeekends].sort((a, b) => {
    const effA = a.durationDays / Math.max(1, a.leaveDaysRequired);
    const effB = b.durationDays / Math.max(1, b.leaveDaysRequired);
    return effB - effA;
  });

  let remainingLeaves = availableLeaves;
  let totalDaysOff = 0;
  let leavesUsed = 0;
  const selectedPlans: LongWeekendPlan[] = [];

  for (const plan of sortedPlans) {
    if (plan.leaveDaysRequired <= remainingLeaves) {
      selectedPlans.push(plan);
      remainingLeaves -= plan.leaveDaysRequired;
      leavesUsed += plan.leaveDaysRequired;
      totalDaysOff += plan.durationDays;
    }
  }

  const multiplier = leavesUsed > 0 ? (totalDaysOff / leavesUsed).toFixed(1) + "x" : "3.0x";

  return {
    totalLeavesAvailable: availableLeaves,
    leavesUsed,
    totalDaysOffGained: totalDaysOff,
    multiplier,
    plans: selectedPlans,
  };
}
