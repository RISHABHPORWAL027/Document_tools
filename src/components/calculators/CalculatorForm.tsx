"use client";

import React from "react";
import { CalculatorConfig } from "@/lib/calculators/types";
import CalculatorInput from "./CalculatorInput";
import { RotateCcw, Calculator as CalcIcon } from "lucide-react";

interface Props {
  config: CalculatorConfig;
  inputs: Record<string, any>;
  mode: string;
  onInputChange: (id: string, val: any) => void;
  onModeChange: (mode: string) => void;
  onReset: () => void;
}

export default function CalculatorForm({
  config,
  inputs,
  mode,
  onInputChange,
  onModeChange,
  onReset,
}: Props) {
  const visibleInputs = config.inputs.filter(
    (field) => field.group === "common" || !field.group || field.group === mode
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-5">
      {/* Mode Toggle (if available) */}
      {config.hasModeToggle && config.modeToggleOptions && (
        <div className="flex rounded-xl bg-slate-100 p-1">
          {config.modeToggleOptions.map((opt) => {
            const active = mode === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onModeChange(opt.value)}
                className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                  active
                    ? "bg-[#1A2E7E] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Input Fields */}
      <div className="space-y-4">
        {visibleInputs.map((field) => (
          <CalculatorInput
            key={field.id}
            field={field}
            value={inputs[field.id]}
            onChange={onInputChange}
          />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
        >
          <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
          Reset
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg">
          <CalcIcon className="h-4 w-4" />
          <span>Real-time Live Calculation</span>
        </div>
      </div>
    </div>
  );
}
