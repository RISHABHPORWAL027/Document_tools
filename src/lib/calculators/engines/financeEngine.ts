import { CalculatorResultData, BreakdownItem, AmortizationRow } from "../types";
import { formatINR } from "./salaryEngine";

/**
 * 1. EMI Calculator Logic
 */
export function calculateEmi(inputs: Record<string, any>): CalculatorResultData {
  const principal = Number(inputs.loanAmount || 0);
  const annualRate = Number(inputs.interestRate || 0);
  const tenureValue = Number(inputs.tenure || 0);
  const tenureType = inputs.tenureType || "years"; // "years" | "months"

  const months = tenureType === "years" ? tenureValue * 12 : tenureValue;
  const monthlyRate = annualRate / 12 / 100;

  let emi = 0;
  if (monthlyRate > 0 && months > 0) {
    emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  } else if (months > 0) {
    emi = principal / months;
  }

  const totalPayment = emi * months;
  const totalInterest = Math.max(0, totalPayment - principal);

  const breakdown: BreakdownItem[] = [
    { label: "Principal Loan Amount", value: principal, formattedValue: formatINR(principal) },
    { label: "Monthly EMI", value: Math.round(emi), formattedValue: formatINR(Math.round(emi)), isTotal: true },
    { label: "Total Interest Payable", value: Math.round(totalInterest), formattedValue: formatINR(Math.round(totalInterest)) },
    { label: "Total Amount Payable (Principal + Interest)", value: Math.round(totalPayment), formattedValue: formatINR(Math.round(totalPayment)), isTotal: true },
  ];

  // Amortization table snippet
  const amortization: AmortizationRow[] = [];
  let balance = principal;

  for (let m = 1; m <= Math.min(months, 360); m++) {
    const interestPart = balance * monthlyRate;
    const principalPart = Math.min(balance, emi - interestPart);
    balance = Math.max(0, balance - principalPart);
    amortization.push({
      period: m,
      payment: Math.round(emi),
      principal: Math.round(principalPart),
      interest: Math.round(interestPart),
      balance: Math.round(balance),
    });
  }

  return {
    primaryTitle: "Monthly Loan EMI",
    primaryValue: Math.round(emi),
    formattedPrimaryValue: formatINR(Math.round(emi)),
    secondaryMetrics: [
      { label: "Total Interest", value: formatINR(Math.round(totalInterest)) },
      { label: "Total Payment", value: formatINR(Math.round(totalPayment)) },
      { label: "Loan Duration", value: `${tenureValue} ${tenureType}` },
    ],
    breakdown,
    tableData: {
      headers: ["Month", "EMI", "Principal Paid", "Interest Paid", "Balance"],
      rows: amortization.slice(0, 12).map((r) => [
        `Month ${r.period}`,
        formatINR(r.payment),
        formatINR(r.principal),
        formatINR(r.interest),
        formatINR(r.balance),
      ]),
    },
    explanation: `For a loan of ${formatINR(principal)} at ${annualRate}% interest for ${tenureValue} ${tenureType}, your monthly EMI is ${formatINR(Math.round(emi))}. Total interest paid across the tenure will be ${formatINR(Math.round(totalInterest))}.`,
  };
}

/**
 * 2. SIP Calculator Logic
 */
export function calculateSip(inputs: Record<string, any>): CalculatorResultData {
  const monthlyInv = Number(inputs.monthlyInvestment || 0);
  const annualReturn = Number(inputs.expectedReturn || 0);
  const years = Number(inputs.years || 0);

  const months = years * 12;
  const i = annualReturn / 12 / 100;

  let maturityValue = 0;
  if (i > 0) {
    maturityValue = monthlyInv * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
  } else {
    maturityValue = monthlyInv * months;
  }

  const totalInvested = monthlyInv * months;
  const estimatedReturns = Math.max(0, maturityValue - totalInvested);

  const breakdown: BreakdownItem[] = [
    { label: "Monthly Investment", value: monthlyInv, formattedValue: formatINR(monthlyInv) },
    { label: "Total Amount Invested", value: totalInvested, formattedValue: formatINR(totalInvested) },
    { label: "Estimated Wealth Gain", value: Math.round(estimatedReturns), formattedValue: formatINR(Math.round(estimatedReturns)) },
    { label: "Estimated Maturity Value", value: Math.round(maturityValue), formattedValue: formatINR(Math.round(maturityValue)), isTotal: true },
  ];

  return {
    primaryTitle: "Estimated Maturity Corpus",
    primaryValue: Math.round(maturityValue),
    formattedPrimaryValue: formatINR(Math.round(maturityValue)),
    secondaryMetrics: [
      { label: "Total Invested", value: formatINR(totalInvested) },
      { label: "Est. Wealth Gain", value: formatINR(Math.round(estimatedReturns)) },
      { label: "Investment Period", value: `${years} Years` },
    ],
    breakdown,
    explanation: `By investing ${formatINR(monthlyInv)} monthly for ${years} years at an expected annual return of ${annualReturn}%, your total investment of ${formatINR(totalInvested)} is projected to grow to ${formatINR(Math.round(maturityValue))}.`,
  };
}

/**
 * 3. FD (Fixed Deposit) Calculator Logic
 */
export function calculateFd(inputs: Record<string, any>): CalculatorResultData {
  const principal = Number(inputs.depositAmount || 0);
  const annualRate = Number(inputs.interestRate || 0);
  const tenure = Number(inputs.tenure || 0);
  const compFreq = inputs.compoundingFrequency || "quarterly"; // quarterly, monthly, half_yearly, yearly

  let n = 4;
  if (compFreq === "monthly") n = 12;
  if (compFreq === "half_yearly") n = 2;
  if (compFreq === "yearly") n = 1;

  const r = annualRate / 100;
  const maturityAmount = principal * Math.pow(1 + r / n, n * tenure);
  const interestEarned = Math.max(0, maturityAmount - principal);

  const breakdown: BreakdownItem[] = [
    { label: "Initial Deposit Amount", value: principal, formattedValue: formatINR(principal) },
    { label: "Total Interest Earned", value: Math.round(interestEarned), formattedValue: formatINR(Math.round(interestEarned)) },
    { label: "Maturity Amount", value: Math.round(maturityAmount), formattedValue: formatINR(Math.round(maturityAmount)), isTotal: true },
  ];

  return {
    primaryTitle: "FD Maturity Amount",
    primaryValue: Math.round(maturityAmount),
    formattedPrimaryValue: formatINR(Math.round(maturityAmount)),
    secondaryMetrics: [
      { label: "Total Interest", value: formatINR(Math.round(interestEarned)) },
      { label: "Deposit Principal", value: formatINR(principal) },
      { label: "Tenure", value: `${tenure} Years` },
    ],
    breakdown,
    explanation: `A fixed deposit of ${formatINR(principal)} at ${annualRate}% p.a. compounded ${compFreq.replace("_", " ")} over ${tenure} years will earn ${formatINR(Math.round(interestEarned))} in interest, giving a final maturity payout of ${formatINR(Math.round(maturityAmount))}.`,
  };
}

/**
 * 4. Compound Interest Calculator Logic
 */
export function calculateCompoundInterest(inputs: Record<string, any>): CalculatorResultData {
  const principal = Number(inputs.principalAmount || 0);
  const annualRate = Number(inputs.interestRate || 0);
  const years = Number(inputs.timePeriod || 0);
  const compFreq = inputs.compoundingFrequency || "yearly";

  let n = 1;
  if (compFreq === "half_yearly") n = 2;
  if (compFreq === "quarterly") n = 4;
  if (compFreq === "monthly") n = 12;
  if (compFreq === "daily") n = 365;

  const r = annualRate / 100;
  const finalAmount = principal * Math.pow(1 + r / n, n * years);
  const compoundInterest = Math.max(0, finalAmount - principal);

  const breakdown: BreakdownItem[] = [
    { label: "Principal Amount", value: principal, formattedValue: formatINR(principal) },
    { label: "Total Compound Interest", value: Math.round(compoundInterest), formattedValue: formatINR(Math.round(compoundInterest)) },
    { label: "Final Amount", value: Math.round(finalAmount), formattedValue: formatINR(Math.round(finalAmount)), isTotal: true },
  ];

  return {
    primaryTitle: "Final Compounded Amount",
    primaryValue: Math.round(finalAmount),
    formattedPrimaryValue: formatINR(Math.round(finalAmount)),
    secondaryMetrics: [
      { label: "Compound Interest", value: formatINR(Math.round(compoundInterest)) },
      { label: "Principal", value: formatINR(principal) },
      { label: "Compounding", value: compFreq.replace("_", " ") },
    ],
    breakdown,
    explanation: `Investing ${formatINR(principal)} at ${annualRate}% interest compounded ${compFreq.replace("_", " ")} for ${years} years generates ${formatINR(Math.round(compoundInterest))} in compound interest, growing your final amount to ${formatINR(Math.round(finalAmount))}.`,
  };
}

/**
 * 5. Simple Interest Calculator Logic
 */
export function calculateSimpleInterest(inputs: Record<string, any>): CalculatorResultData {
  const principal = Number(inputs.principalAmount || 0);
  const rate = Number(inputs.interestRate || 0);
  const years = Number(inputs.timePeriod || 0);

  const simpleInterest = (principal * rate * years) / 100;
  const totalAmount = principal + simpleInterest;

  const breakdown: BreakdownItem[] = [
    { label: "Principal Amount", value: principal, formattedValue: formatINR(principal) },
    { label: "Simple Interest Earned", value: Math.round(simpleInterest), formattedValue: formatINR(Math.round(simpleInterest)) },
    { label: "Total Amount (Principal + Interest)", value: Math.round(totalAmount), formattedValue: formatINR(Math.round(totalAmount)), isTotal: true },
  ];

  return {
    primaryTitle: "Total Accumulated Amount",
    primaryValue: Math.round(totalAmount),
    formattedPrimaryValue: formatINR(Math.round(totalAmount)),
    secondaryMetrics: [
      { label: "Simple Interest", value: formatINR(Math.round(simpleInterest)) },
      { label: "Initial Principal", value: formatINR(principal) },
      { label: "Time Period", value: `${years} Years` },
    ],
    breakdown,
    explanation: `A principal of ${formatINR(principal)} at ${rate}% simple interest per annum over ${years} years accumulates ${formatINR(Math.round(simpleInterest))} in interest, making the total value ${formatINR(Math.round(totalAmount))}.`,
  };
}

/**
 * 6. GST Calculator Logic
 */
export function calculateGst(inputs: Record<string, any>): CalculatorResultData {
  const amount = Number(inputs.amount || 0);
  const gstRate = Number(inputs.gstRate ?? 18);
  const isInclusive = inputs.taxType === "inclusive";
  const isInterState = inputs.transactionType === "interstate";

  let originalAmount = 0;
  let gstAmount = 0;
  let finalAmount = 0;

  if (isInclusive) {
    originalAmount = amount / (1 + gstRate / 100);
    gstAmount = amount - originalAmount;
    finalAmount = amount;
  } else {
    originalAmount = amount;
    gstAmount = amount * (gstRate / 100);
    finalAmount = amount + gstAmount;
  }

  const cgst = isInterState ? 0 : gstAmount / 2;
  const sgst = isInterState ? 0 : gstAmount / 2;
  const igst = isInterState ? gstAmount : 0;

  const breakdown: BreakdownItem[] = [
    { label: "Net Original Amount", value: Math.round(originalAmount), formattedValue: formatINR(Math.round(originalAmount)) },
    { label: `GST Tax (${gstRate}%)`, value: Math.round(gstAmount), formattedValue: formatINR(Math.round(gstAmount)) },
    ...(isInterState
      ? [{ label: `IGST (${gstRate}%)`, value: Math.round(igst), formattedValue: formatINR(Math.round(igst)) }]
      : [
          { label: `CGST (${gstRate / 2}%)`, value: Math.round(cgst), formattedValue: formatINR(Math.round(cgst)) },
          { label: `SGST / UTGST (${gstRate / 2}%)`, value: Math.round(sgst), formattedValue: formatINR(Math.round(sgst)) },
        ]),
    { label: "Final Total Amount", value: Math.round(finalAmount), formattedValue: formatINR(Math.round(finalAmount)), isTotal: true },
  ];

  return {
    primaryTitle: isInclusive ? "Net Base Amount (Excl. Tax)" : "Gross Total Amount (Incl. Tax)",
    primaryValue: Math.round(isInclusive ? originalAmount : finalAmount),
    formattedPrimaryValue: formatINR(Math.round(isInclusive ? originalAmount : finalAmount)),
    secondaryMetrics: [
      { label: "GST Amount", value: formatINR(Math.round(gstAmount)) },
      { label: "GST Rate", value: `${gstRate}%` },
      { label: "Tax Mode", value: isInclusive ? "GST Inclusive" : "GST Exclusive" },
    ],
    breakdown,
    explanation: isInclusive
      ? `For an inclusive price of ${formatINR(amount)} at ${gstRate}% GST, the net base price before tax is ${formatINR(Math.round(originalAmount))} and total GST is ${formatINR(Math.round(gstAmount))}.`
      : `For an exclusive price of ${formatINR(amount)} at ${gstRate}% GST, the GST tax added is ${formatINR(Math.round(gstAmount))}, bringing the total payable to ${formatINR(Math.round(finalAmount))}.`,
  };
}
