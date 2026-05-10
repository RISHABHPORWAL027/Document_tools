"use client";

import React from "react";

export type LegalDateParts = {
  dateIso: string;
  dayOfMonth: number;
  ordinalDayUpper: string; // e.g. "1ST", "2ND"
  ordinalDayLower: string; // e.g. "1st", "2nd"
  monthNameUpper: string; // e.g. "JANUARY"
  monthNameLower: string; // e.g. "January"
  year: string; // e.g. "2024"
  weekdayUpper: string; // e.g. "MONDAY"
  weekdayLower: string; // e.g. "Monday"
  fullFormatted: string; // e.g. "1st January 2024"
};

interface LegalDatePickerProps {
  value?: string;
  onChange: (parts: LegalDateParts) => void;
  className?: string;
}

export function getOrdinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default function LegalDatePicker({ value, onChange, className }: LegalDatePickerProps) {
  return (
    <input
      type="date"
      className={className}
      value={value || ""}
      onChange={(e) => {
        const dateStr = e.target.value;
        if (!dateStr) return;
        
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return;

        const day = d.getDate();
        const ordinalLower = getOrdinal(day);
        const ordinalUpper = ordinalLower.toUpperCase();
        
        const monthLower = d.toLocaleDateString("en-IN", { month: "long" });
        const monthUpper = monthLower.toUpperCase();
        
        const year = d.getFullYear().toString();
        
        const weekdayLower = d.toLocaleDateString("en-IN", { weekday: "long" });
        const weekdayUpper = weekdayLower.toUpperCase();

        onChange({
          dateIso: dateStr,
          dayOfMonth: day,
          ordinalDayUpper: ordinalUpper,
          ordinalDayLower: ordinalLower,
          monthNameUpper: monthUpper,
          monthNameLower: monthLower,
          year: year,
          weekdayUpper: weekdayUpper,
          weekdayLower: weekdayLower,
          fullFormatted: `${ordinalLower} ${monthLower} ${year}`
        });
      }}
    />
  );
}
