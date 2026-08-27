"use client";

import React from "react";
import { notFound } from "next/navigation";
import { getCalculatorBySlug } from "@/lib/calculators/registry";
import CalculatorLayout from "@/components/calculators/CalculatorLayout";

interface Props {
  slug: string;
}

export default function CalculatorSlugClient({ slug }: Props) {
  const config = getCalculatorBySlug(slug);

  if (!config) {
    notFound();
  }

  return <CalculatorLayout config={config} />;
}
