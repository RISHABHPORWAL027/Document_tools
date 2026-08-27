import { CalculatorResultData, BreakdownItem } from "../types";

export function formatINR(val: number): string {
  if (isNaN(val)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
}

/**
 * 1. In-Hand Salary Calculator Logic
 */
export function calculateInHandSalary(
  inputs: Record<string, any>,
  mode: string = "quick"
): CalculatorResultData {
  const ctc = Number(inputs.ctc || 0);

  let basicAnnual = 0;
  let hraAnnual = 0;
  let bonusAnnual = Number(inputs.bonus || 0);
  let otherAllowancesAnnual = 0;
  let employeePfMonthly = 0;
  let employerPfMonthly = 0;
  let ptMonthly = 0;
  let customDeductionsMonthly = Number(inputs.otherDeductions || 0);
  const state = inputs.state || "maharashtra";
  if (inputs.professionalTax !== undefined && inputs.professionalTax !== 200) {
    ptMonthly = Number(inputs.professionalTax);
  } else if (state === "delhi" || state === "no_pt") {
    ptMonthly = 0;
  } else if (state === "tamil_nadu") {
    ptMonthly = 208;
  } else {
    ptMonthly = (ctc / 12 > 15000) ? 200 : 0;
  }

  if (mode === "quick") {
    basicAnnual = ctc * 0.5; // Standard 50% basic assumption
    hraAnnual = basicAnnual * 0.4; // 40% HRA
    const pfCapped = inputs.pfCap !== false;
    const basicMonthly = basicAnnual / 12;
    employeePfMonthly = pfCapped ? Math.min(1800, basicMonthly * 0.12) : basicMonthly * 0.12;
    employerPfMonthly = employeePfMonthly;
    otherAllowancesAnnual = Math.max(0, ctc - (basicAnnual + hraAnnual + bonusAnnual + employerPfMonthly * 12));
  } else {
    basicAnnual = Number(inputs.basicSalary || ctc * 0.5);
    hraAnnual = Number(inputs.hra || basicAnnual * 0.4);
    employeePfMonthly = Number(inputs.employeePf || 1800);
    employerPfMonthly = Number(inputs.employerPf || employeePfMonthly);
    otherAllowancesAnnual = Math.max(0, ctc - (basicAnnual + hraAnnual + bonusAnnual + employerPfMonthly * 12));
  }

  const grossMonthly = (basicAnnual + hraAnnual + otherAllowancesAnnual + bonusAnnual) / 12;
  const grossAnnual = grossMonthly * 12;

  const totalDeductionsMonthly = employeePfMonthly + ptMonthly + customDeductionsMonthly;
  const totalDeductionsAnnual = totalDeductionsMonthly * 12;

  const netMonthlyInHand = Math.max(0, grossMonthly - totalDeductionsMonthly);
  const netAnnualInHand = netMonthlyInHand * 12;

  const breakdown: BreakdownItem[] = [
    {
      label: "Annual CTC",
      value: ctc,
      formattedValue: formatINR(ctc),
      isTotal: true,
    },
    {
      label: "Monthly Gross Salary",
      value: Math.round(grossMonthly),
      formattedValue: formatINR(Math.round(grossMonthly)),
    },
    {
      label: "Basic Salary (Monthly)",
      value: Math.round(basicAnnual / 12),
      formattedValue: formatINR(Math.round(basicAnnual / 12)),
    },
    {
      label: "HRA (Monthly)",
      value: Math.round(hraAnnual / 12),
      formattedValue: formatINR(Math.round(hraAnnual / 12)),
    },
    {
      label: "Special Allowances (Monthly)",
      value: Math.round(otherAllowancesAnnual / 12),
      formattedValue: formatINR(Math.round(otherAllowancesAnnual / 12)),
    },
    {
      label: "Employee PF (Monthly)",
      value: Math.round(employeePfMonthly),
      formattedValue: formatINR(Math.round(employeePfMonthly)),
      isDeduction: true,
    },
    {
      label: "Professional Tax (Monthly)",
      value: Math.round(ptMonthly),
      formattedValue: formatINR(Math.round(ptMonthly)),
      isDeduction: true,
    },
    {
      label: "Other Deductions (Monthly)",
      value: Math.round(customDeductionsMonthly),
      formattedValue: formatINR(Math.round(customDeductionsMonthly)),
      isDeduction: true,
    },
    {
      label: "Estimated Monthly In-Hand",
      value: Math.round(netMonthlyInHand),
      formattedValue: formatINR(Math.round(netMonthlyInHand)),
      isTotal: true,
    },
  ];

  return {
    primaryTitle: "Estimated Monthly Take-Home Salary",
    primaryValue: Math.round(netMonthlyInHand),
    formattedPrimaryValue: formatINR(Math.round(netMonthlyInHand)),
    secondaryMetrics: [
      { label: "Annual In-Hand", value: formatINR(Math.round(netAnnualInHand)) },
      { label: "Monthly Gross", value: formatINR(Math.round(grossMonthly)) },
      { label: "Total Deductions", value: formatINR(Math.round(totalDeductionsMonthly)) },
    ],
    breakdown,
    explanation: `Out of your Annual CTC of ${formatINR(ctc)}, your Monthly Gross Salary comes to ${formatINR(Math.round(grossMonthly))}. After deducting Employee PF (${formatINR(Math.round(employeePfMonthly))}), Professional Tax (${formatINR(Math.round(ptMonthly))}), and other adjustments, your net estimated monthly in-hand salary is ${formatINR(Math.round(netMonthlyInHand))}.`,
  };
}

/**
 * 2. CTC Calculator Logic
 */
export function calculateCtc(inputs: Record<string, any>): CalculatorResultData {
  const ctc = Number(inputs.ctc || 0);
  const basicPct = Number(inputs.basicPercent || 50) / 100;
  const hraPct = Number(inputs.hraPercent || 40) / 100;

  const basicAnnual = ctc * basicPct;
  const hraAnnual = basicAnnual * hraPct;
  const basicMonthly = basicAnnual / 12;
  const employeePfMonthly = Math.min(1800, basicMonthly * 0.12);
  const employerPfMonthly = employeePfMonthly;
  const otherAllowancesAnnual = Math.max(0, ctc - (basicAnnual + hraAnnual + employerPfMonthly * 12));

  const monthlyCtc = ctc / 12;
  const monthlyGross = (basicAnnual + hraAnnual + otherAllowancesAnnual) / 12;
  const estimatedInHandMonthly = monthlyGross - (employeePfMonthly + 200);

  const breakdown: BreakdownItem[] = [
    { label: "Annual CTC", value: ctc, formattedValue: formatINR(ctc), isTotal: true },
    { label: "Monthly CTC", value: Math.round(monthlyCtc), formattedValue: formatINR(Math.round(monthlyCtc)) },
    { label: "Basic Salary (Annual)", value: Math.round(basicAnnual), formattedValue: formatINR(Math.round(basicAnnual)) },
    { label: "HRA (Annual)", value: Math.round(hraAnnual), formattedValue: formatINR(Math.round(hraAnnual)) },
    { label: "Other Allowances (Annual)", value: Math.round(otherAllowancesAnnual), formattedValue: formatINR(Math.round(otherAllowancesAnnual)) },
    { label: "Employer PF Contribution (Annual)", value: Math.round(employerPfMonthly * 12), formattedValue: formatINR(Math.round(employerPfMonthly * 12)) },
    { label: "Estimated Monthly Take-Home", value: Math.round(estimatedInHandMonthly), formattedValue: formatINR(Math.round(estimatedInHandMonthly)), isTotal: true },
  ];

  return {
    primaryTitle: "Monthly Gross Salary",
    primaryValue: Math.round(monthlyGross),
    formattedPrimaryValue: formatINR(Math.round(monthlyGross)),
    secondaryMetrics: [
      { label: "Annual CTC", value: formatINR(ctc) },
      { label: "Monthly CTC", value: formatINR(Math.round(monthlyCtc)) },
      { label: "Est. Monthly Take-Home", value: formatINR(Math.round(estimatedInHandMonthly)) },
    ],
    breakdown,
    explanation: `For an Annual CTC of ${formatINR(ctc)}, your monthly salary package is structured into Basic (${formatINR(Math.round(basicMonthly))}), HRA (${formatINR(Math.round(hraAnnual / 12))}), and Allowances. Your estimated take-home pay after standard PF & PT deductions is ${formatINR(Math.round(estimatedInHandMonthly))}.`,
  };
}

/**
 * 3. PF (Provident Fund) Calculator Logic
 */
export function calculatePf(inputs: Record<string, any>): CalculatorResultData {
  const basicSalary = Number(inputs.basicSalary || 0);
  const employeeContribPct = Number(inputs.employeeContribPct || 12) / 100;
  const employerContribPct = Number(inputs.employerContribPct || 12) / 100;
  const years = Number(inputs.years || 10);
  const interestRate = Number(inputs.interestRate || 8.25) / 100;

  const monthlyEmpContrib = basicSalary * employeeContribPct;
  const monthlyEmprContribTotal = basicSalary * employerContribPct;
  const monthlyEpsContrib = Math.min(1250, basicSalary * 0.0833);
  const monthlyEpfEmprContrib = Math.max(0, monthlyEmprContribTotal - monthlyEpsContrib);

  const monthlyTotalDeposit = monthlyEmpContrib + monthlyEpfEmprContrib;
  const totalMonths = years * 12;

  let totalCorpus = 0;
  const monthlyRate = interestRate / 12;

  for (let m = 1; m <= totalMonths; m++) {
    totalCorpus = (totalCorpus + monthlyTotalDeposit) * (1 + monthlyRate);
  }

  const totalInvested = monthlyTotalDeposit * totalMonths;
  const totalInterest = Math.max(0, totalCorpus - totalInvested);

  const breakdown: BreakdownItem[] = [
    { label: "Employee Monthly PF Contribution", value: Math.round(monthlyEmpContrib), formattedValue: formatINR(Math.round(monthlyEmpContrib)) },
    { label: "Employer Monthly EPF Share", value: Math.round(monthlyEpfEmprContrib), formattedValue: formatINR(Math.round(monthlyEpfEmprContrib)) },
    { label: "Employer Monthly Pension (EPS) Share", value: Math.round(monthlyEpsContrib), formattedValue: formatINR(Math.round(monthlyEpsContrib)) },
    { label: "Total Monthly Contribution", value: Math.round(monthlyTotalDeposit), formattedValue: formatINR(Math.round(monthlyTotalDeposit)), isTotal: true },
    { label: "Total Invested Amount", value: Math.round(totalInvested), formattedValue: formatINR(Math.round(totalInvested)) },
    { label: "Interest Accumulated", value: Math.round(totalInterest), formattedValue: formatINR(Math.round(totalInterest)) },
    { label: "Estimated EPF Maturity Corpus", value: Math.round(totalCorpus), formattedValue: formatINR(Math.round(totalCorpus)), isTotal: true },
  ];

  return {
    primaryTitle: "Estimated EPF Maturity Corpus",
    primaryValue: Math.round(totalCorpus),
    formattedPrimaryValue: formatINR(Math.round(totalCorpus)),
    secondaryMetrics: [
      { label: "Total Invested", value: formatINR(Math.round(totalInvested)) },
      { label: "Interest Earned", value: formatINR(Math.round(totalInterest)) },
      { label: "Monthly Deposit", value: formatINR(Math.round(monthlyTotalDeposit)) },
    ],
    breakdown,
    explanation: `By contributing ${formatINR(Math.round(monthlyEmpContrib))} per month along with your employer's EPF share of ${formatINR(Math.round(monthlyEpfEmprContrib))}, your total monthly deposit of ${formatINR(Math.round(monthlyTotalDeposit))} grows to ${formatINR(Math.round(totalCorpus))} in ${years} years at ${inputs.interestRate || 8.25}% EPF interest rate.`,
  };
}

/**
 * 4. HRA Calculator Logic
 */
export function calculateHra(inputs: Record<string, any>): CalculatorResultData {
  const isAnnual = inputs.frequency === "annual";
  const basicInput = Number(inputs.basicSalary || 0);
  const hraInput = Number(inputs.hraReceived || 0);
  const rentInput = Number(inputs.rentPaid || 0);
  const isMetro = inputs.cityType === "metro";

  const mult = isAnnual ? 1 : 12;
  const basicAnnual = basicInput * mult;
  const hraAnnual = hraInput * mult;
  const rentAnnual = rentInput * mult;

  // HRA exemption rules (Min of 3)
  const cond1 = hraAnnual;
  const cond2 = isMetro ? basicAnnual * 0.5 : basicAnnual * 0.4;
  const cond3 = Math.max(0, rentAnnual - basicAnnual * 0.1);

  const eligibleExemptionAnnual = Math.min(cond1, cond2, cond3);
  const taxableHraAnnual = Math.max(0, hraAnnual - eligibleExemptionAnnual);

  const breakdown: BreakdownItem[] = [
    { label: "Actual HRA Received (Annual)", value: Math.round(hraAnnual), formattedValue: formatINR(Math.round(hraAnnual)) },
    { label: "50% / 40% of Basic Salary", value: Math.round(cond2), formattedValue: formatINR(Math.round(cond2)) },
    { label: "Rent Paid minus 10% of Basic", value: Math.round(cond3), formattedValue: formatINR(Math.round(cond3)) },
    { label: "Exempt HRA (Tax Free)", value: Math.round(eligibleExemptionAnnual), formattedValue: formatINR(Math.round(eligibleExemptionAnnual)), isTotal: true },
    { label: "Taxable HRA", value: Math.round(taxableHraAnnual), formattedValue: formatINR(Math.round(taxableHraAnnual)), isDeduction: true },
  ];

  return {
    primaryTitle: "Eligible HRA Tax Exemption",
    primaryValue: Math.round(eligibleExemptionAnnual),
    formattedPrimaryValue: formatINR(Math.round(eligibleExemptionAnnual)),
    secondaryMetrics: [
      { label: "Exempt HRA (Monthly)", value: formatINR(Math.round(eligibleExemptionAnnual / 12)) },
      { label: "Taxable HRA (Annual)", value: formatINR(Math.round(taxableHraAnnual)) },
      { label: "City Classification", value: isMetro ? "Metro (50%)" : "Non-Metro (40%)" },
    ],
    breakdown,
    explanation: `Based on your rent paid of ${formatINR(Math.round(rentAnnual))} per year and basic salary of ${formatINR(Math.round(basicAnnual))}, your maximum tax-exempt HRA is ${formatINR(Math.round(eligibleExemptionAnnual))}. The remaining HRA amount of ${formatINR(Math.round(taxableHraAnnual))} is taxable.`,
  };
}

/**
 * 5. Gratuity Calculator Logic
 */
export function calculateGratuity(inputs: Record<string, any>): CalculatorResultData {
  const basicSalary = Number(inputs.lastDrawnSalary || 0); // Monthly Basic + DA
  const yearsOfService = Number(inputs.yearsOfService || 0);
  const isCovered = inputs.isCovered !== false; // Payment of Gratuity Act covered

  let gratuityAmount = 0;

  if (yearsOfService >= 5) {
    if (isCovered) {
      gratuityAmount = (15 * basicSalary * yearsOfService) / 26;
    } else {
      gratuityAmount = (15 * basicSalary * yearsOfService) / 30;
    }
  }

  const taxExemptLimit = 2000000; // ₹20 Lakh statutory cap
  const exemptGratuity = Math.min(gratuityAmount, taxExemptLimit);
  const taxableGratuity = Math.max(0, gratuityAmount - taxExemptLimit);

  const breakdown: BreakdownItem[] = [
    { label: "Last Drawn Basic Salary + DA", value: basicSalary, formattedValue: formatINR(basicSalary) },
    { label: "Total Completed Years of Service", value: yearsOfService, formattedValue: `${yearsOfService} Years` },
    { label: "Calculated Gratuity Payable", value: Math.round(gratuityAmount), formattedValue: formatINR(Math.round(gratuityAmount)), isTotal: true },
    { label: "Tax-Exempt Gratuity Limit", value: Math.round(exemptGratuity), formattedValue: formatINR(Math.round(exemptGratuity)) },
    { label: "Taxable Gratuity Portion", value: Math.round(taxableGratuity), formattedValue: formatINR(Math.round(taxableGratuity)), isDeduction: true },
  ];

  return {
    primaryTitle: "Estimated Gratuity Payable",
    primaryValue: Math.round(gratuityAmount),
    formattedPrimaryValue: formatINR(Math.round(gratuityAmount)),
    secondaryMetrics: [
      { label: "Years of Service", value: `${yearsOfService} Years` },
      { label: "Tax-Exempt Portion", value: formatINR(Math.round(exemptGratuity)) },
      { label: "Eligibility Status", value: yearsOfService >= 5 ? "Eligible (5+ Yrs)" : "Not Eligible (<5 Yrs)" },
    ],
    breakdown,
    explanation: yearsOfService < 5
      ? "Gratuity requires a minimum of 5 continuous years of service with the same employer."
      : `Based on ${yearsOfService} years of service and a last drawn monthly basic salary of ${formatINR(basicSalary)}, your estimated gratuity payout is ${formatINR(Math.round(gratuityAmount))}.`,
  };
}
