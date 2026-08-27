import { CalculatorResultData, BreakdownItem } from "../types";
import { formatINR } from "./salaryEngine";

/**
 * 1. Break-even Calculator Logic
 */
export function calculateBreakeven(inputs: Record<string, any>): CalculatorResultData {
  const fixedCosts = Number(inputs.fixedCosts || 0);
  const sellingPrice = Number(inputs.sellingPrice || 0);
  const variableCost = Number(inputs.variableCost || 0);

  const contributionMarginUnit = sellingPrice - variableCost;
  const breakEvenUnits = contributionMarginUnit > 0 ? fixedCosts / contributionMarginUnit : 0;
  const breakEvenRevenue = breakEvenUnits * sellingPrice;
  const contributionMarginRatio = sellingPrice > 0 ? (contributionMarginUnit / sellingPrice) * 100 : 0;

  const breakdown: BreakdownItem[] = [
    { label: "Total Fixed Costs", value: fixedCosts, formattedValue: formatINR(fixedCosts) },
    { label: "Selling Price Per Unit", value: sellingPrice, formattedValue: formatINR(sellingPrice) },
    { label: "Variable Cost Per Unit", value: variableCost, formattedValue: formatINR(variableCost) },
    { label: "Contribution Margin Per Unit", value: Math.round(contributionMarginUnit), formattedValue: formatINR(Math.round(contributionMarginUnit)) },
    { label: "Contribution Margin Ratio", value: Math.round(contributionMarginRatio), formattedValue: `${contributionMarginRatio.toFixed(2)}%` },
    { label: "Break-Even Point (Units)", value: Math.ceil(breakEvenUnits), formattedValue: `${Math.ceil(breakEvenUnits)} Units`, isTotal: true },
    { label: "Break-Even Point (Revenue)", value: Math.round(breakEvenRevenue), formattedValue: formatINR(Math.round(breakEvenRevenue)), isTotal: true },
  ];

  return {
    primaryTitle: "Break-Even Sales Volume",
    primaryValue: Math.ceil(breakEvenUnits),
    formattedPrimaryValue: `${Math.ceil(breakEvenUnits)} Units`,
    secondaryMetrics: [
      { label: "Break-Even Revenue", value: formatINR(Math.round(breakEvenRevenue)) },
      { label: "Margin / Unit", value: formatINR(Math.round(contributionMarginUnit)) },
      { label: "Margin Ratio", value: `${contributionMarginRatio.toFixed(1)}%` },
    ],
    breakdown,
    explanation: `To cover fixed costs of ${formatINR(fixedCosts)} with a selling price of ${formatINR(sellingPrice)} and unit variable cost of ${formatINR(variableCost)}, you must sell at least ${Math.ceil(breakEvenUnits)} units (generating ${formatINR(Math.round(breakEvenRevenue))} in revenue) to break even.`,
  };
}

/**
 * 2. Profit Margin Calculator Logic
 */
export function calculateProfitMargin(inputs: Record<string, any>): CalculatorResultData {
  const costPrice = Number(inputs.costPrice || 0);
  const sellingPrice = Number(inputs.sellingPrice || 0);

  const profit = sellingPrice - costPrice;
  const profitMarginPct = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;
  const markupPct = costPrice > 0 ? (profit / costPrice) * 100 : 0;

  const breakdown: BreakdownItem[] = [
    { label: "Cost Price (Cost)", value: costPrice, formattedValue: formatINR(costPrice) },
    { label: "Selling Price (Revenue)", value: sellingPrice, formattedValue: formatINR(sellingPrice) },
    { label: "Net Profit / Loss", value: Math.round(profit), formattedValue: formatINR(Math.round(profit)), isTotal: true },
    { label: "Profit Margin (%)", value: Math.round(profitMarginPct), formattedValue: `${profitMarginPct.toFixed(2)}%` },
    { label: "Markup Percentage (%)", value: Math.round(markupPct), formattedValue: `${markupPct.toFixed(2)}%` },
  ];

  return {
    primaryTitle: "Gross Profit Margin",
    primaryValue: Number(profitMarginPct.toFixed(2)),
    formattedPrimaryValue: `${profitMarginPct.toFixed(2)}%`,
    secondaryMetrics: [
      { label: "Net Profit Amount", value: formatINR(Math.round(profit)) },
      { label: "Markup Percentage", value: `${markupPct.toFixed(1)}%` },
      { label: "Cost Price", value: formatINR(costPrice) },
    ],
    breakdown,
    explanation: `Selling an item for ${formatINR(sellingPrice)} that cost ${formatINR(costPrice)} yields a profit of ${formatINR(Math.round(profit))}, which translates to a ${profitMarginPct.toFixed(2)}% gross profit margin and a ${markupPct.toFixed(2)}% markup.`,
  };
}

/**
 * 3. Discount Calculator Logic
 */
export function calculateDiscount(inputs: Record<string, any>): CalculatorResultData {
  const originalPrice = Number(inputs.originalPrice || 0);
  const discountPct = Number(inputs.discountPercentage || 0);

  const discountAmount = originalPrice * (discountPct / 100);
  const finalPrice = Math.max(0, originalPrice - discountAmount);

  const breakdown: BreakdownItem[] = [
    { label: "Original List Price", value: originalPrice, formattedValue: formatINR(originalPrice) },
    { label: `Discount Off (${discountPct}%)`, value: Math.round(discountAmount), formattedValue: formatINR(Math.round(discountAmount)), isDeduction: true },
    { label: "Final Price After Discount", value: Math.round(finalPrice), formattedValue: formatINR(Math.round(finalPrice)), isTotal: true },
    { label: "Total Customer Savings", value: Math.round(discountAmount), formattedValue: formatINR(Math.round(discountAmount)) },
  ];

  return {
    primaryTitle: "Final Discounted Price",
    primaryValue: Math.round(finalPrice),
    formattedPrimaryValue: formatINR(Math.round(finalPrice)),
    secondaryMetrics: [
      { label: "You Save", value: formatINR(Math.round(discountAmount)) },
      { label: "Original Price", value: formatINR(originalPrice) },
      { label: "Discount Rate", value: `${discountPct}%` },
    ],
    breakdown,
    explanation: `Applying a ${discountPct}% discount to an original price of ${formatINR(originalPrice)} saves ${formatINR(Math.round(discountAmount))}, resulting in a net price of ${formatINR(Math.round(finalPrice))}.`,
  };
}

/**
 * 4. Invoice Due Date Calculator Logic
 */
export function calculateInvoiceDueDate(inputs: Record<string, any>): CalculatorResultData {
  const invoiceDateStr = inputs.invoiceDate || new Date().toISOString().split("T")[0];
  const paymentTerm = inputs.paymentTerms || "net_30";
  const customDays = Number(inputs.customDays || 0);

  let termDays = 0;
  if (paymentTerm === "receipt") termDays = 0;
  else if (paymentTerm === "net_7") termDays = 7;
  else if (paymentTerm === "net_15") termDays = 15;
  else if (paymentTerm === "net_30") termDays = 30;
  else if (paymentTerm === "net_45") termDays = 45;
  else if (paymentTerm === "net_60") termDays = 60;
  else if (paymentTerm === "custom") termDays = customDays;

  const invDate = new Date(invoiceDateStr);
  const dueDate = new Date(invDate);
  dueDate.setDate(dueDate.getDate() + termDays);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = dueDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
  const formattedInvoiceDate = invDate.toLocaleDateString("en-IN", options);
  const formattedDueDate = dueDate.toLocaleDateString("en-IN", options);

  let statusBadge = "Payment Due Soon";
  if (daysRemaining < 0) statusBadge = `Overdue by ${Math.abs(daysRemaining)} Days`;
  else if (daysRemaining === 0) statusBadge = "Due Today!";
  else statusBadge = `${daysRemaining} Days Remaining`;

  const breakdown: BreakdownItem[] = [
    { label: "Invoice Issue Date", value: invDate.getTime(), formattedValue: formattedInvoiceDate },
    { label: "Credit Term Standard", value: termDays, formattedValue: termDays === 0 ? "Due on Receipt" : `${termDays} Days (${paymentTerm.replace("_", " ").toUpperCase()})` },
    { label: "Payment Due Date", value: dueDate.getTime(), formattedValue: formattedDueDate, isTotal: true },
    { label: "Payment Status", value: daysRemaining, formattedValue: statusBadge, badge: daysRemaining < 0 ? "Overdue" : "Active" },
  ];

  return {
    primaryTitle: "Payment Due Date",
    primaryValue: dueDate.getTime(),
    formattedPrimaryValue: formattedDueDate,
    secondaryMetrics: [
      { label: "Payment Terms", value: termDays === 0 ? "Due on Receipt" : `Net ${termDays}` },
      { label: "Days Allowed", value: `${termDays} Days` },
      { label: "Status", value: statusBadge },
    ],
    breakdown,
    explanation: `For an invoice issued on ${formattedInvoiceDate} with ${termDays === 0 ? "Due on Receipt" : `Net ${termDays}`} payment terms, payment is officially due by ${formattedDueDate}.`,
  };
}
