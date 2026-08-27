"use client";

import React from "react";
import { CalculatorInputField } from "@/lib/calculators/types";
import { HelpCircle } from "lucide-react";

interface Props {
  field: CalculatorInputField;
  value: any;
  onChange: (id: string, val: any) => void;
}

export default function CalculatorInput({ field, value, onChange }: Props) {
  const currentValue = value !== undefined ? value : field.defaultValue;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const rawVal = e.target.value;
    if (field.type === "currency" || field.type === "number" || field.type === "slider") {
      const numVal = rawVal === "" ? 0 : parseFloat(rawVal);
      onChange(field.id, isNaN(numVal) ? 0 : numVal);
    } else {
      onChange(field.id, rawVal);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={field.id} className="flex items-center gap-1.5 text-xs font-semibold text-[#1A1C1E]">
          {field.label}
          {field.tooltip && (
            <span className="group relative cursor-help" title={field.tooltip}>
              <HelpCircle className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 transition-colors" />
            </span>
          )}
        </label>
        {field.unit && (
          <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            {field.unit}
          </span>
        )}
      </div>

      {field.type === "select" ? (
        <select
          id={field.id}
          value={currentValue}
          onChange={handleInputChange}
          className="w-full rounded-lg border border-[#C4C6D0] bg-white px-3 py-2 text-sm text-[#1A1C1E] font-medium shadow-xs focus:border-[#1A2E7E] focus:outline-none focus:ring-1 focus:ring-[#1A2E7E] transition-all"
        >
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : field.type === "slider" ? (
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <input
              type="range"
              id={field.id}
              min={field.min ?? 0}
              max={field.max ?? 100}
              step={field.step ?? 1}
              value={currentValue}
              onChange={handleInputChange}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-[#1A2E7E]"
            />
            <div className="flex h-9 w-24 items-center justify-center rounded-lg border border-[#C4C6D0] bg-white px-2 text-xs font-bold text-[#1A2E7E]">
              {currentValue} {field.unit || ""}
            </div>
          </div>
        </div>
      ) : field.type === "date" ? (
        <input
          type="date"
          id={field.id}
          value={currentValue}
          onChange={handleInputChange}
          className="w-full rounded-lg border border-[#C4C6D0] bg-white px-3 py-2 text-sm text-[#1A1C1E] font-medium shadow-xs focus:border-[#1A2E7E] focus:outline-none focus:ring-1 focus:ring-[#1A2E7E] transition-all"
        />
      ) : (
        <div className="relative flex items-center">
          {field.type === "currency" && (
            <span className="absolute left-3 text-sm font-bold text-slate-500">₹</span>
          )}
          <input
            type="number"
            id={field.id}
            min={field.min}
            max={field.max}
            step={field.step || 1}
            value={currentValue}
            onChange={handleInputChange}
            placeholder={`Enter ${field.label}`}
            className={`w-full rounded-lg border border-[#C4C6D0] bg-white py-2 text-sm font-medium text-[#1A1C1E] shadow-xs focus:border-[#1A2E7E] focus:outline-none focus:ring-1 focus:ring-[#1A2E7E] transition-all ${
              field.type === "currency" ? "pl-7 pr-3" : "px-3"
            }`}
          />
        </div>
      )}
    </div>
  );
}
