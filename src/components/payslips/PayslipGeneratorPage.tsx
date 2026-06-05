"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCompanyProfile } from "@/lib/profiles/use-profiles";
import { useDocumentPrefill } from "@/lib/profiles/useDocumentPrefill";
import { getAllPersons } from "@/lib/storage/personStorage";
import DocumentEditorLayout from "@/components/layouts/DocumentEditorLayout";
import { numberToIndianWords } from "@/lib/utils/number-words";
import { downloadPdf } from "@/lib/render/pdf-client";
import { getRelatedDocs } from "@/lib/site/registry";

interface SalaryItem {
  label: string;
  amount: number;
}

interface DetailItem {
  label: string;
  value: string;
}

interface PayslipData {
  companyName: string;
  companyAddress: string;
  companyLogo: string;
  payPeriod: string;
  employeeDetails: DetailItem[];
  earnings: SalaryItem[];
  deductions: SalaryItem[];
  templateId: "modern" | "grid" | "list";
  issueDate: string;
}

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none";
const labelClass = "text-xs font-semibold uppercase text-zinc-500 block mb-1";

function initialData(): PayslipData {
  return {
    companyName: "ComplianceDraft",
    companyAddress: "456 Corporate Towers, Mumbai, Maharashtra, India",
    companyLogo: "/Assets/logo.webp",
    payPeriod: new Date().toLocaleString("en-US", { month: "long", year: "numeric" }),
    employeeDetails: [
      { label: "Employee Name", value: "Rishabh Dapkara" },
      { label: "Employee ID", value: "EMP21" },
      { label: "Designation", value: "NA" },
      { label: "Department", value: "N/A" },
      { label: "Date of Joining", value: "01 July 2026" },
      { label: "Days Worked", value: "26" },
      { label: "Bank Name", value: "HDFC" },
      { label: "Bank Account No.", value: "3201021" },
    ],
    earnings: [
      { label: "Basic Pay", amount: 10000 },
      { label: "Incentive Pay", amount: 1000 },
      { label: "House Rent Allowance", amount: 400 },
      { label: "Meal Allowance", amount: 200 },
    ],
    deductions: [
      { label: "Provident Fund", amount: 1200 },
      { label: "Professional Tax", amount: 500 },
      { label: "Loan Recovery", amount: 400 },
    ],
    templateId: "modern",
    issueDate: new Date().toISOString().split("T")[0],
  };
}

export default function PayslipGeneratorPage() {
  const searchParams = useSearchParams();
  const companyId = searchParams.get("company");
  const templateParam = searchParams.get("template");

  const { profile } = useCompanyProfile(companyId || undefined);
  const [data, setData] = useState<PayslipData>(initialData);
  const [busy, setBusy] = useState(false);
  const [showSelector, setShowSelector] = useState(true);

  // Sync state with template parameter
  useEffect(() => {
    if (templateParam === "modern" || templateParam === "grid" || templateParam === "list") {
      setData((prev) => ({ ...prev, templateId: templateParam as any }));
      setShowSelector(false);
    } else {
      setShowSelector(true);
    }
  }, [templateParam]);

  useDocumentPrefill(profile, setData, {
    companyName: (p) => p.companyName || "",
    companyAddress: (p) => p.registeredAddress || "",
    employeeDetails: (p) => {
      return [
        { label: "Employee Name", value: p.directors[0]?.directorName || "" },
        { label: "Employee ID", value: "EMP21" },
        { label: "Designation", value: p.directors[0]?.designation || "Director" },
        { label: "Department", value: "N/A" },
        { label: "Date of Joining", value: "01 July 2026" },
        { label: "Days Worked", value: "26" },
        { label: "Bank Name", value: "HDFC" },
        { label: "Bank Account No.", value: "3201021" },
      ];
    },
  });

  // Auto-fill employee details from saved persons in localStorage
  useEffect(() => {
    const persons = getAllPersons();
    if (persons.length) {
      const p = persons[0]; // Use first saved person
      const personDetails = [
        { label: "Employee Name", value: p.name },
        { label: "Employee ID", value: p.id },
        { label: "Designation", value: p.role },
        { label: "Email", value: p.email },
        { label: "Phone", value: p.phone },
        { label: "Address", value: p.address },
      ];
      setData((prev) => ({ ...prev, employeeDetails: personDetails }));
    }
  }, []);


  const update = <K extends keyof PayslipData>(field: K, value: PayslipData[K]) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectTemplate = (t: "modern" | "grid" | "list") => {
    const params = new URLSearchParams(window.location.search);
    params.set("template", t);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState(null, "", newUrl);
    setData((prev) => ({ ...prev, templateId: t }));
    setShowSelector(false);
  };

  const handleBackToTemplates = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete("template");
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState(null, "", newUrl);
    setShowSelector(true);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      update("companyLogo", event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    update("companyLogo", "");
  };

  // Dynamic row managers for employee details
  const addDetail = () => {
    update("employeeDetails", [...data.employeeDetails, { label: "", value: "" }]);
  };

  const updateDetail = (index: number, key: keyof DetailItem, val: string) => {
    const updated = [...data.employeeDetails];
    updated[index] = { ...updated[index], [key]: val };
    update("employeeDetails", updated);
  };

  const removeDetail = (index: number) => {
    update("employeeDetails", data.employeeDetails.filter((_, idx) => idx !== index));
  };

  // Dynamic row managers for earnings
  const addEarning = () => {
    update("earnings", [...data.earnings, { label: "", amount: 0 }]);
  };

  const updateEarning = (index: number, key: keyof SalaryItem, val: any) => {
    const updated = [...data.earnings];
    updated[index] = { ...updated[index], [key]: key === "amount" ? Number(val) : val };
    update("earnings", updated);
  };

  const removeEarning = (index: number) => {
    update("earnings", data.earnings.filter((_, idx) => idx !== index));
  };

  // Dynamic row managers for deductions
  const addDeduction = () => {
    update("deductions", [...data.deductions, { label: "", amount: 0 }]);
  };

  const updateDeduction = (index: number, key: keyof SalaryItem, val: any) => {
    const updated = [...data.deductions];
    updated[index] = { ...updated[index], [key]: key === "amount" ? Number(val) : val };
    update("deductions", updated);
  };

  const removeDeduction = (index: number) => {
    update("deductions", data.deductions.filter((_, idx) => idx !== index));
  };

  // Calculated totals
  const totalEarnings = useMemo(() => {
    return data.earnings.reduce((sum, item) => sum + (item.amount || 0), 0);
  }, [data.earnings]);

  const totalDeductions = useMemo(() => {
    return data.deductions.reduce((sum, item) => sum + (item.amount || 0), 0);
  }, [data.deductions]);

  const netPay = useMemo(() => {
    return Math.max(0, totalEarnings - totalDeductions);
  }, [totalEarnings, totalDeductions]);

  const netPayWords = useMemo(() => {
    return numberToIndianWords(netPay);
  }, [netPay]);

  // Document calculations & HTML rendering
  const previewHtml = useMemo(() => {
    return renderPayslipHtml(data, totalEarnings, totalDeductions, netPay, netPayWords);
  }, [data, totalEarnings, totalDeductions, netPay, netPayWords]);

  const relatedDocs = useMemo(() => {
    return getRelatedDocs("payslip-generator", "payslips-shared");
  }, []);

  const handleDownload = async (format: "pdf" | "docx") => {
    setBusy(true);
    try {
      const empName = data.employeeDetails.find(d => d.label.toLowerCase() === "employee name")?.value || "Employee";
      const fileName = `Payslip_${empName.replace(/\s+/g, "_")}_${data.payPeriod.replace(/\s+/g, "_")}.${format}`;
      if (format === "pdf") {
        await downloadPdf(previewHtml, fileName);
      } else {
        const res = await fetch("/api/payslips/docx", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ values: data }),
        });
        if (!res.ok) throw new Error("Failed to generate DOCX");
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (e: any) {
      alert("Error generating document: " + e.message);
    } finally {
      setBusy(false);
    }
  };

  // If selector is active, render visual templates grid
  if (showSelector) {
    return (
      <div className="min-h-screen bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-extrabold text-zinc-950 tracking-tight sm:text-4xl">
              Select Payslip Template
            </h1>
            <p className="text-base text-zinc-600 max-w-2xl mx-auto">
              Choose one of our premium, compliance-ready layouts. You can fully customize company logo, employee details, earnings, and deductions in the next step.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Template Card 1: Modern Minimal (Orange) */}
            <div 
              onClick={() => handleSelectTemplate("modern")}
              className="group cursor-pointer bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md hover:border-orange-500 transition-all duration-300 flex flex-col h-full"
            >
              {/* High fidelity CSS Mockup for Modern Minimal */}
              <div className="bg-zinc-100 p-6 h-72 flex items-center justify-center border-b border-zinc-200 group-hover:bg-orange-50/20 transition-all">
                <div className="w-full bg-white rounded-xl shadow-md border border-zinc-200 p-5 space-y-3 text-[9px] text-zinc-600 leading-normal select-none">
                  {/* Mock Header */}
                  <div className="flex justify-between border-b border-orange-500 pb-2">
                    <div className="space-y-0.5">
                      <div className="font-extrabold text-zinc-900 text-[10px]">ZOONODLE INC.</div>
                      <div className="text-[7px] text-zinc-400">123 Corporate Way, New Delhi</div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-orange-500 text-[12px] tracking-tight">PAYSLIP</div>
                      <div className="text-[8px] text-zinc-800 font-bold">August 2021</div>
                    </div>
                  </div>
                  {/* Mock Details */}
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 bg-zinc-50 p-2 rounded-lg border border-zinc-100 text-[8px]">
                    <div><span className="font-bold text-zinc-400">EMPLOYEE:</span> <span className="font-bold text-zinc-700">Rishabh Dapkara</span></div>
                    <div><span className="font-bold text-zinc-400">DESIGNATION:</span> <span className="font-bold text-zinc-700">Software Engineer</span></div>
                    <div><span className="font-bold text-zinc-400">EMPLOYEE ID:</span> <span className="font-bold text-zinc-700">EMP21</span></div>
                    <div><span className="font-bold text-zinc-400">BANK ACCOUNT:</span> <span className="font-bold text-zinc-700">HDFC · 3201021</span></div>
                  </div>
                  {/* Mock Table */}
                  <table className="w-full border-collapse text-[8px] text-left">
                    <thead>
                      <tr className="bg-zinc-800 text-white font-bold">
                        <th className="p-1 rounded-l">Earnings</th>
                        <th className="p-1 text-right">Amount</th>
                        <th className="p-1">Deductions</th>
                        <th className="p-1 text-right rounded-r">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-zinc-100">
                        <td className="p-1">Basic Pay</td>
                        <td className="p-1 text-right">10,000</td>
                        <td className="p-1">Provident Fund</td>
                        <td className="p-1 text-right text-red-600">1,200</td>
                      </tr>
                      <tr className="font-bold bg-zinc-50">
                        <td className="p-1">Total</td>
                        <td className="p-1 text-right">10,000</td>
                        <td className="p-1">Total</td>
                        <td className="p-1 text-right">1,200</td>
                      </tr>
                    </tbody>
                  </table>
                  {/* Net Pay Highlight */}
                  <div className="flex justify-between items-center bg-orange-50 border border-orange-100 rounded p-1.5 text-[9px] font-bold">
                    <span className="text-orange-700">Net Payable:</span>
                    <span className="text-orange-800 text-[11px]">₹ 8,800.00</span>
                  </div>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-zinc-950 group-hover:text-orange-600 transition-all">
                    Modern Minimalist (Orange)
                  </h3>
                  <p className="text-xs text-zinc-500 mt-2">
                    A clean, contemporary salary slip featuring a sleek header, orange compliance highlights, and a structured layout ideal for modern startups.
                  </p>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectTemplate("modern");
                  }}
                  className="w-full text-center mt-5 py-2.5 px-4 text-xs font-bold text-zinc-900 bg-zinc-100 group-hover:bg-orange-500 group-hover:text-white rounded-lg transition-all"
                >
                  Use Template
                </button>
              </div>
            </div>

            {/* Template Card 2: Standard Grid */}
            <div 
              onClick={() => handleSelectTemplate("grid")}
              className="group cursor-pointer bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md hover:border-zinc-800 transition-all duration-300 flex flex-col h-full"
            >
              {/* High fidelity CSS Mockup for Standard Grid */}
              <div className="bg-zinc-100 p-6 h-72 flex items-center justify-center border-b border-zinc-200 group-hover:bg-zinc-50 transition-all">
                <div className="w-full bg-white rounded-xl shadow-md border border-zinc-300 p-5 space-y-3 text-[8px] text-zinc-850 font-serif leading-normal select-none">
                  {/* Mock Header */}
                  <div className="text-center space-y-0.5 border-b border-zinc-300 pb-1.5">
                    <div className="font-bold text-[11px] uppercase tracking-wide">ACME CORPORATION LIMITED</div>
                    <div className="text-[7px] text-zinc-500">Regd Office: 456 Corporate Towers, Mumbai</div>
                    <div className="text-[10px] font-bold underline mt-1">PAYSLIP FOR AUGUST 2021</div>
                  </div>
                  {/* Mock Details Table */}
                  <table className="w-full border-collapse border border-zinc-400 text-[7px] text-left">
                    <tbody>
                      <tr>
                        <td className="border border-zinc-400 p-1 font-bold">Employee Name:</td>
                        <td className="border border-zinc-400 p-1">Rishabh Dapkara</td>
                        <td className="border border-zinc-400 p-1 font-bold">Pay Period:</td>
                        <td className="border border-zinc-400 p-1">August 2021</td>
                      </tr>
                      <tr>
                        <td className="border border-zinc-400 p-1 font-bold">Employee ID:</td>
                        <td className="border border-zinc-400 p-1">EMP21</td>
                        <td className="border border-zinc-400 p-1 font-bold">Bank Name:</td>
                        <td className="border border-zinc-400 p-1">HDFC</td>
                      </tr>
                    </tbody>
                  </table>
                  {/* Mock Table */}
                  <table className="w-full border-collapse border border-zinc-400 text-[7px] text-left">
                    <thead>
                      <tr className="font-bold">
                        <th className="border border-zinc-400 p-1">Earnings</th>
                        <th className="border border-zinc-400 p-1 text-right">Amount</th>
                        <th className="border border-zinc-400 p-1">Deductions</th>
                        <th className="border border-zinc-400 p-1 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-zinc-400 p-1">Basic Pay</td>
                        <td className="border border-zinc-400 p-1 text-right">10000.00</td>
                        <td className="border border-zinc-400 p-1">Provident Fund</td>
                        <td className="border border-zinc-400 p-1 text-right">1200.00</td>
                      </tr>
                      <tr className="font-bold">
                        <td className="border border-zinc-400 p-1">Total</td>
                        <td className="border border-zinc-400 p-1 text-right">10000.00</td>
                        <td className="border border-zinc-400 p-1">Total</td>
                        <td className="border border-zinc-400 p-1 text-right">1200.00</td>
                      </tr>
                      <tr className="font-bold bg-zinc-100">
                        <td className="border border-zinc-400 p-1" colSpan={2}></td>
                        <td className="border border-zinc-400 p-1">Net Pay</td>
                        <td className="border border-zinc-400 p-1 text-right">₹ 8800.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-zinc-950 group-hover:text-zinc-900 transition-all">
                    Standard Grid (Word Style)
                  </h3>
                  <p className="text-xs text-zinc-500 mt-2">
                    A traditional corporate format using classic double-borders and Times New Roman font. Matches formal corporate legal documents.
                  </p>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectTemplate("grid");
                  }}
                  className="w-full text-center mt-5 py-2.5 px-4 text-xs font-bold text-zinc-900 bg-zinc-100 group-hover:bg-zinc-950 group-hover:text-white rounded-lg transition-all"
                >
                  Use Template
                </button>
              </div>
            </div>

            {/* Template Card 3: Spreadsheet List */}
            <div 
              onClick={() => handleSelectTemplate("list")}
              className="group cursor-pointer bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-600 transition-all duration-300 flex flex-col h-full"
            >
              {/* High fidelity CSS Mockup for Spreadsheet List */}
              <div className="bg-zinc-100 p-6 h-72 flex items-center justify-center border-b border-zinc-200 group-hover:bg-emerald-50/20 transition-all">
                <div className="w-full bg-white rounded-xl shadow-md border-2 border-emerald-500 p-5 space-y-3 text-[7px] text-zinc-700 font-mono leading-normal select-none">
                  {/* Mock Header */}
                  <div className="text-center font-bold text-emerald-700 text-[10px] border-b border-emerald-500 pb-1.5 uppercase">
                    PHINURA ADVISORS
                  </div>
                  {/* Mock Details */}
                  <table className="w-full text-left border-collapse border border-zinc-200">
                    <tbody>
                      <tr>
                        <td className="p-1 border border-zinc-200 bg-zinc-50 font-bold">NAME:</td>
                        <td className="p-1 border border-zinc-200">Rishabh Dapkara</td>
                        <td className="p-1 border border-zinc-200 bg-zinc-50 font-bold">PERIOD:</td>
                        <td className="p-1 border border-zinc-200">August 2021</td>
                      </tr>
                      <tr>
                        <td className="p-1 border border-zinc-200 bg-zinc-50 font-bold">ID:</td>
                        <td className="p-1 border border-zinc-200">EMP21</td>
                        <td className="p-1 border border-zinc-200 bg-zinc-50 font-bold">DAYS:</td>
                        <td className="p-1 border border-zinc-200">26</td>
                      </tr>
                    </tbody>
                  </table>
                  {/* Mock Table */}
                  <table className="w-full border-collapse border border-emerald-500">
                    <thead>
                      <tr className="bg-emerald-100 text-emerald-800 font-bold">
                        <th className="p-1 border border-emerald-500">Salary Components</th>
                        <th className="p-1 border border-emerald-500 text-right">Amount (INR)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-zinc-50 font-bold">
                        <td className="p-1 border border-emerald-500">[A] EARNINGS</td>
                        <td className="p-1 border border-emerald-500"></td>
                      </tr>
                      <tr>
                        <td className="p-1 border border-emerald-500">Basic Pay</td>
                        <td className="p-1 border border-emerald-500 text-right">10000.00</td>
                      </tr>
                      <tr className="bg-emerald-50/50 font-bold">
                        <td className="p-1 border border-emerald-500">Total Earnings (A)</td>
                        <td className="p-1 border border-emerald-500 text-right text-emerald-800">10000.00</td>
                      </tr>
                      <tr className="bg-zinc-50 font-bold">
                        <td className="p-1 border border-emerald-500">[B] DEDUCTIONS</td>
                        <td className="p-1 border border-emerald-500"></td>
                      </tr>
                      <tr>
                        <td className="p-1 border border-emerald-500">Provident Fund</td>
                        <td className="p-1 border border-emerald-500 text-right text-red-600">1200.00</td>
                      </tr>
                      <tr className="bg-red-50/50 font-bold">
                        <td className="p-1 border border-emerald-500">Total Deductions (B)</td>
                        <td className="p-1 border border-emerald-500 text-right text-red-850">1200.00</td>
                      </tr>
                      <tr className="bg-emerald-100 font-bold">
                        <td className="p-1 border border-emerald-500 text-emerald-900">NET PAYABLE (A - B)</td>
                        <td className="p-1 border border-emerald-500 text-right text-emerald-900 text-[9px]">₹ 8,800.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-zinc-950 group-hover:text-emerald-700 transition-all">
                    Spreadsheet List (Excel Style)
                  </h3>
                  <p className="text-xs text-zinc-500 mt-2">
                    A clean, vertical list styled like a Microsoft Excel sheet, featuring monospaced font, green accents, and stacked earnings/deductions sections.
                  </p>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectTemplate("list");
                  }}
                  className="w-full text-center mt-5 py-2.5 px-4 text-xs font-bold text-zinc-900 bg-zinc-100 group-hover:bg-emerald-605 group-hover:text-white rounded-lg transition-all"
                >
                  Use Template
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DocumentEditorLayout
      title="Salary Payslip Generator"
      description="Create, customize, and print professional monthly employee salary slips."
      companyId={companyId}
      aboutDescription="A Payslip is an official document issued by an employer to an employee detailing their monthly earnings (Basic Pay, HRA, Incentives) and compliance deductions (PF, Professional Tax, Loan recoveries). It acts as legal proof of salary disbursement and is required for income tax records and credit assessments."
      relatedDocs={relatedDocs}
      onProfileSelect={(p) => {
        setData((prev) => {
          const updatedDetails = prev.employeeDetails.map((item) => {
            if (item.label === "Employee Name") {
              return { ...item, value: p.directors[0]?.directorName || "" };
            }
            if (item.label === "Designation") {
              return { ...item, value: p.directors[0]?.designation || "Director" };
            }
            return item;
          });
          return {
            ...prev,
            companyName: p.companyName || "",
            companyAddress: p.registeredAddress || "",
            employeeDetails: updatedDetails,
          };
        });
      }}
      busy={busy}
      onDownload={handleDownload}
      previewHtml={previewHtml}
      iframeTitle="Payslip Preview"
      inputSection={
        <div className="space-y-4">
          {/* Back to Templates Link */}
          <div className="flex justify-between items-center bg-white border rounded-xl px-4 py-3 shadow-sm">
            <button
              type="button"
              onClick={handleBackToTemplates}
              className="text-xs font-bold text-zinc-600 hover:text-zinc-900 flex items-center gap-1.5 transition-all"
            >
              ← Back to Templates Directory
            </button>
            <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
              Active Template: <span className="text-zinc-950">{data.templateId}</span>
            </div>
          </div>

          {/* Template Selection Small Inline Toggler */}
          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-wider">Select Payslip Template</h2>
            <div className="grid grid-cols-3 gap-2">
              {(["modern", "grid", "list"] as const).map((tId) => (
                <button
                  key={tId}
                  onClick={() => handleSelectTemplate(tId)}
                  className={`py-2 px-3 text-xs font-bold border rounded-lg capitalize transition-all ${
                    data.templateId === tId
                      ? "bg-zinc-950 text-white border-zinc-950"
                      : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                  }`}
                >
                  {tId === "modern" ? "Modern" : tId === "grid" ? "Standard Grid" : "Spreadsheet"}
                </button>
              ))}
            </div>
          </div>

          {/* Company Details */}
          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-wider">Company Details</h2>
            <div className="space-y-1">
              <label className={labelClass}>Company Name</label>
              <input className={inputClass} value={data.companyName} onChange={(e) => update("companyName", e.target.value)} placeholder="e.g. Acme Corp" />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Company Address</label>
              <textarea className={inputClass} rows={2} value={data.companyAddress} onChange={(e) => update("companyAddress", e.target.value)} placeholder="e.g. 123 Main St, New Delhi" />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Company Logo (Optional)</label>
              {data.companyLogo ? (
                <div className="flex items-center gap-3">
                  <img src={data.companyLogo} alt="Logo preview" className="h-10 w-10 object-contain border rounded p-1" />
                  <button type="button" onClick={removeLogo} className="text-xs text-red-600 hover:underline">
                    Remove Logo
                  </button>
                </div>
              ) : (
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="text-xs text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200" />
              )}
            </div>
          </div>

          {/* Dynamic Employee Details Section */}
          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-wider">Employee & Salary Details</h2>
              <button type="button" onClick={addDetail} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                + Add Detail Field
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className={labelClass}>Pay Period</label>
                <input className={inputClass} placeholder="e.g. August 2021" value={data.payPeriod} onChange={(e) => update("payPeriod", e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Issue Date</label>
                <input type="date" className={inputClass} value={data.issueDate} onChange={(e) => update("issueDate", e.target.value)} />
              </div>
            </div>
            
            <hr className="border-zinc-200 my-2" />

            <div className="space-y-3">
              {data.employeeDetails.map((detail, idx) => (
                <div key={idx} className="flex gap-2 items-center bg-zinc-50 p-2 rounded-lg border border-zinc-100">
                  <input
                    className={inputClass}
                    style={{ flex: 1 }}
                    value={detail.label}
                    onChange={(e) => updateDetail(idx, "label", e.target.value)}
                    placeholder="Field Label (e.g. Employee ID)"
                  />
                  <input
                    className={inputClass}
                    style={{ flex: 2 }}
                    value={detail.value}
                    onChange={(e) => updateDetail(idx, "value", e.target.value)}
                    placeholder="Field Value"
                  />
                  <button
                    type="button"
                    onClick={() => removeDetail(idx)}
                    className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                    title="Delete Field"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Earnings */}
          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-wider">Earnings</h2>
              <button type="button" onClick={addEarning} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                + Add Earning
              </button>
            </div>
            <div className="space-y-2">
              {data.earnings.map((earning, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input className={inputClass} style={{ flex: 2 }} value={earning.label} onChange={(e) => updateEarning(idx, "label", e.target.value)} placeholder="Basic Salary" />
                  <input className={inputClass} style={{ flex: 1 }} type="number" value={earning.amount || ""} onChange={(e) => updateEarning(idx, "amount", e.target.value)} placeholder="Amount" />
                  <button type="button" onClick={() => removeEarning(idx)} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Delete row">
                    ❌
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Deductions */}
          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-wider">Deductions</h2>
              <button type="button" onClick={addDeduction} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                + Add Deduction
              </button>
            </div>
            <div className="space-y-2">
              {data.deductions.map((deduction, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input className={inputClass} style={{ flex: 2 }} value={deduction.label} onChange={(e) => updateDeduction(idx, "label", e.target.value)} placeholder="Provident Fund" />
                  <input className={inputClass} style={{ flex: 1 }} type="number" value={deduction.amount || ""} onChange={(e) => updateDeduction(idx, "amount", e.target.value)} placeholder="Amount" />
                  <button type="button" onClick={() => removeDeduction(idx)} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Delete row">
                    ❌
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    />
  );
}

// Helper function to escape HTML special characters
function escape(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(isoString: string): string {
  if (!isoString) return "";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function renderPayslipHtml(
  data: PayslipData,
  totalEarnings: number,
  totalDeductions: number,
  netPay: number,
  netPayWords: string
): string {
  const maxRows = Math.max(data.earnings.length, data.deductions.length);
  const rowsHtml: string[] = [];

  for (let i = 0; i < maxRows; i++) {
    const earn = data.earnings[i];
    const ded = data.deductions[i];

    rowsHtml.push(`
      <tr>
        <td>${earn ? escape(earn.label) : ""}</td>
        <td style="text-align: right;">${earn && earn.amount ? earn.amount.toFixed(2) : ""}</td>
        <td>${ded ? escape(ded.label) : ""}</td>
        <td style="text-align: right;">${ded && ded.amount ? ded.amount.toFixed(2) : ""}</td>
      </tr>
    `);
  }

  // Modern Template Layout (Style 1)
  if (data.templateId === "modern") {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Payslip</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      font-size: 10pt;
      line-height: 1.4;
      color: #1f2937;
      padding: 30px;
      background: #fff;
    }
    .payslip-container {
      max-width: 800px;
      margin: 0 auto;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 24px;
      background: #ffffff;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #f57c00;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .company-logo {
      max-height: 48px;
      max-width: 150px;
      object-fit: contain;
      margin-bottom: 8px;
    }
    .company-info {
      max-width: 60%;
    }
    .company-name {
      font-size: 16pt;
      font-weight: 800;
      color: #111827;
      margin-bottom: 4px;
    }
    .company-address {
      font-size: 8.5pt;
      color: #6b7280;
    }
    .title-area {
      text-align: right;
    }
    .payslip-title {
      font-size: 20pt;
      font-weight: 900;
      color: #f57c00;
      letter-spacing: -0.025em;
    }
    .pay-period {
      font-size: 10pt;
      font-weight: bold;
      color: #374151;
      margin-top: 4px;
    }
    .meta-date {
      font-size: 8pt;
      color: #9ca3af;
      margin-top: 2px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      background: #f9fafb;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 24px;
      border: 1px solid #f3f4f6;
    }
    .info-item {
      display: flex;
      flex-direction: column;
    }
    .info-label {
      font-size: 7.5pt;
      font-weight: 700;
      text-transform: uppercase;
      color: #9ca3af;
      letter-spacing: 0.05em;
    }
    .info-value {
      font-size: 9.5pt;
      font-weight: 600;
      color: #374151;
      margin-top: 2px;
    }
    .table-container {
      margin-bottom: 24px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9.5pt;
    }
    th {
      background: #1f2937;
      color: #ffffff;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 8pt;
      letter-spacing: 0.05em;
      padding: 10px 12px;
      border: 1px solid #1f2937;
    }
    td {
      padding: 10px 12px;
      border: 1px solid #e5e7eb;
    }
    .table-totals {
      font-weight: 700;
      background: #f9fafb;
    }
    .net-pay-section {
      background: #fff8f1;
      border: 1.5px solid #ffe8d6;
      border-radius: 8px;
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .net-pay-label {
      font-weight: bold;
      color: #f57c00;
      font-size: 11pt;
    }
    .net-pay-amount {
      font-size: 18pt;
      font-weight: 900;
      color: #d84315;
    }
    .words-section {
      font-size: 9pt;
      color: #4b5563;
      margin-bottom: 30px;
      border-left: 3px solid #f57c00;
      padding-left: 12px;
    }
    .signature-section {
      display: flex;
      justify-content: space-between;
      margin-top: 40px;
      padding-top: 24px;
    }
    .sig-block {
      text-align: center;
      width: 40%;
    }
    .sig-line {
      border-bottom: 1px solid #d1d5db;
      height: 36px;
      margin-bottom: 8px;
    }
    .sig-title {
      font-size: 8.5pt;
      font-weight: bold;
      color: #6b7280;
    }
    .footer-note {
      text-align: center;
      font-size: 8pt;
      color: #9ca3af;
      margin-top: 40px;
      border-top: 1px dashed #e5e7eb;
      padding-top: 12px;
    }
  </style>
</head>
<body>
  <div class="payslip-container">
    <div class="header">
      <div class="company-info">
        ${data.companyLogo ? `<img src="${data.companyLogo}" class="company-logo" alt="Logo" />` : ""}
        <div class="company-name">${escape(data.companyName)}</div>
        <div class="company-address">${escape(data.companyAddress)}</div>
      </div>
      <div class="title-area">
        <div class="payslip-title">PAYSLIP</div>
        <div class="pay-period">${escape(data.payPeriod)}</div>
        <div class="meta-date">Date of Issue: ${formatDate(data.issueDate)}</div>
      </div>
    </div>

    <div class="info-grid">
      ${data.employeeDetails.map((item) => `
        <div class="info-item">
          <span class="info-label">${escape(item.label)}</span>
          <span class="info-value">${escape(item.value) || "N/A"}</span>
        </div>
      `).join("")}
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th style="width: 35%;">Earnings</th>
            <th style="width: 15%; text-align: right;">Amount</th>
            <th style="width: 35%;">Deductions</th>
            <th style="width: 15%; text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml.join("")}
          <tr class="table-totals">
            <td>Total Earnings</td>
            <td style="text-align: right;">${totalEarnings.toFixed(2)}</td>
            <td>Total Deductions</td>
            <td style="text-align: right;">${totalDeductions.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="net-pay-section">
      <span class="net-pay-label">Net Salary Payable</span>
      <span class="net-pay-amount">₹ ${netPay.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
    </div>

    <div class="words-section">
      <strong>Amount in Words:</strong><br/>
      <span>${netPayWords}</span>
    </div>

    <div class="signature-section">
      <div class="sig-block">
        <div class="sig-line"></div>
        <div class="sig-title">Employer Signature</div>
      </div>
      <div class="sig-block">
        <div class="sig-line"></div>
        <div class="sig-title">Employee Signature</div>
      </div>
    </div>

    <div class="footer-note">
      This is a system generated payslip and does not require a physical signature.
    </div>
  </div>
</body>
</html>`;
  }

  // Standard Grid Template (Style 2) - Matches docx template
  if (data.templateId === "grid") {
    const detailsRows: string[] = [];
    for (let i = 0; i < data.employeeDetails.length; i += 2) {
      const f1 = data.employeeDetails[i];
      const f2 = data.employeeDetails[i + 1];
      detailsRows.push(`
        <tr>
          <td style="width: 25%;" class="label">${f1 ? escape(f1.label) + ":" : ""}</td>
          <td style="width: 25%;">${f1 ? escape(f1.value) : ""}</td>
          <td style="width: 25%;" class="label">${f2 ? escape(f2.label) + ":" : ""}</td>
          <td style="width: 25%;">${f2 ? escape(f2.value) : ""}</td>
        </tr>
      `);
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Payslip</title>
  <style>
    body {
      font-family: "Times New Roman", Times, serif;
      font-size: 11pt;
      line-height: 1.4;
      color: #000;
      padding: 20px;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
    }
    .comp-name {
      font-size: 14pt;
      font-weight: bold;
      text-align: center;
      margin-bottom: 2px;
    }
    .comp-addr {
      font-size: 10pt;
      text-align: center;
      margin-bottom: 12px;
    }
    .doc-title {
      font-size: 12pt;
      font-weight: bold;
      text-align: center;
      text-decoration: underline;
      margin-bottom: 16px;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
    }
    .details-table td {
      border: 1px solid #000;
      padding: 6px;
      font-size: 10.5pt;
    }
    .label {
      font-weight: bold;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
    }
    .data-table th, .data-table td {
      border: 1px solid #000;
      padding: 6px;
    }
    .data-table th {
      font-weight: bold;
      text-align: left;
    }
    .footer-block {
      margin-top: 24px;
      font-size: 10.5pt;
    }
    .footer-block p {
      margin-bottom: 4px;
    }
    .sig-row {
      display: flex;
      justify-content: space-between;
      margin-top: 50px;
    }
    .sig-line {
      width: 200px;
      border-top: 1px solid #000;
      text-align: center;
      padding-top: 4px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="comp-name">${escape(data.companyName)}</div>
    <div class="comp-addr">${escape(data.companyAddress)}</div>
    <div class="doc-title">PAYSLIP</div>

    <table class="details-table">
      ${detailsRows.join("")}
    </table>

    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 35%;">Earnings</th>
          <th style="width: 15%;">Amount</th>
          <th style="width: 35%;">Deductions</th>
          <th style="width: 15%;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml.join("")}
        <tr style="font-weight: bold;">
          <td>Total Earnings</td>
          <td>${totalEarnings.toFixed(2)}</td>
          <td>Total Deductions</td>
          <td>${totalDeductions.toFixed(2)}</td>
        </tr>
        <tr style="font-weight: bold; background: #eee;">
          <td colspan="2"></td>
          <td>Net Pay (Disbursed)</td>
          <td>₹ ${netPay.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>

    <div class="footer-block">
      <p><strong>Net Pay (in Words):</strong> ${netPayWords}</p>
      <p style="font-style: italic; color: #555; margin-top: 10px; font-size: 9pt;">This is a system generated payslip and does not require a physical signature.</p>
    </div>

    <div class="sig-row">
      <div class="sig-line">Employer Signature</div>
      <div class="sig-line">Employee Signature</div>
    </div>
  </div>
</body>
</html>`;
  }

  // Spreadsheet List Template (Style 3) - Stacked lists typical of Excel
  const earningsListHtml = data.earnings
    .map(
      (e) => `
    <tr>
      <td style="padding: 6px; border: 1px solid #d1d5db;">${escape(e.label)}</td>
      <td style="padding: 6px; border: 1px solid #d1d5db; text-align: right;">${e.amount.toFixed(2)}</td>
    </tr>
  `
    )
    .join("");

  const deductionsListHtml = data.deductions
    .map(
      (d) => `
    <tr>
      <td style="padding: 6px; border: 1px solid #d1d5db;">${escape(d.label)}</td>
      <td style="padding: 6px; border: 1px solid #d1d5db; text-align: right; color: #b91c1c;">${d.amount.toFixed(2)}</td>
    </tr>
  `
    )
    .join("");

  const listDetailsRows: string[] = [];
  for (let i = 0; i < data.employeeDetails.length; i += 2) {
    const f1 = data.employeeDetails[i];
    const f2 = data.employeeDetails[i + 1];
    listDetailsRows.push(`
      <tr>
        <td style="width: 25%; font-weight: bold; background: #f9fafb;">${f1 ? escape(f1.label) + ":" : ""}</td>
        <td style="width: 25%;">${f1 ? escape(f1.value) : ""}</td>
        <td style="width: 25%; font-weight: bold; background: #f9fafb;">${f2 ? escape(f2.label) + ":" : ""}</td>
        <td style="width: 25%;">${f2 ? escape(f2.value) : ""}</td>
      </tr>
    `);
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Payslip</title>
  <style>
    body {
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 10pt;
      color: #374151;
      padding: 30px;
      background: #ffffff;
    }
    .sheet {
      max-width: 800px;
      margin: 0 auto;
      border: 2px solid #10b981;
      border-radius: 4px;
      padding: 20px;
    }
    .sheet-title {
      font-size: 16pt;
      font-weight: bold;
      color: #047857;
      text-align: center;
      margin-bottom: 12px;
      border-bottom: 1.5px solid #10b981;
      padding-bottom: 8px;
    }
    .grid-info {
      width: 100%;
      margin-bottom: 20px;
      border-collapse: collapse;
    }
    .grid-info td {
      padding: 4px 8px;
      border: 1px solid #e5e7eb;
    }
    .tbl-title {
      font-weight: bold;
      background: #d1fae5;
      color: #065f46;
      padding: 6px 8px;
      border: 1px solid #10b981;
    }
    .bold-row {
      font-weight: bold;
      background: #f3f4f6;
    }
    .double-underline {
      border-bottom: 3px double #000 !important;
      font-weight: bold;
      font-size: 11pt;
    }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="sheet-title">${escape(data.companyName).toUpperCase() || "PAYSLIP"}</div>
    
    <table class="grid-info">
      ${listDetailsRows.join("")}
    </table>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
      <thead>
        <tr>
          <th class="tbl-title" style="width: 70%;">Salary Components</th>
          <th class="tbl-title" style="width: 30%; text-align: right;">Amount (INR)</th>
        </tr>
      </thead>
      <tbody>
        <tr class="bold-row">
          <td colspan="2" style="border: 1px solid #10b981; padding: 6px;">[A] EARNINGS</td>
        </tr>
        ${earningsListHtml}
        <tr class="bold-row" style="background: #ecfdf5;">
          <td style="border: 1px solid #10b981; padding: 6px;">Total Earnings (A)</td>
          <td style="border: 1px solid #10b981; padding: 6px; text-align: right;">${totalEarnings.toFixed(2)}</td>
        </tr>
        
        <tr class="bold-row">
          <td colspan="2" style="border: 1px solid #10b981; padding: 6px; margin-top: 10px;">[B] DEDUCTIONS</td>
        </tr>
        ${deductionsListHtml}
        <tr class="bold-row" style="background: #fef2f2;">
          <td style="border: 1px solid #10b981; padding: 6px; color: #b91c1c;">Total Deductions (B)</td>
          <td style="border: 1px solid #10b981; padding: 6px; text-align: right; color: #b91c1c;">${totalDeductions.toFixed(2)}</td>
        </tr>
        
        <tr class="double-underline">
          <td style="padding: 10px 8px; border: 1px solid #10b981; background: #d1fae5; color: #047857;">NET PAYABLE (A - B)</td>
          <td style="padding: 10px 8px; border: 1px solid #10b981; text-align: right; background: #d1fae5; color: #047857; font-size: 12pt;">₹ ${netPay.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
        </tr>
      </tbody>
    </table>

    <div style="font-size: 9pt; color: #4b5563; margin-top: 16px; border: 1px dashed #10b981; padding: 12px; border-radius: 4px;">
      <strong>Net Salary in Words:</strong> ${netPayWords}<br/>
      <span style="font-size: 8pt; color: #9ca3af; display: block; margin-top: 8px;">* This is a computer generated document and does not require an employer signature.</span>
    </div>
  </div>
</body>
</html>`;
}
