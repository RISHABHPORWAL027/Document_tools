"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCompanyProfile } from "@/lib/profiles/use-profiles";
import { useDocumentPrefill } from "@/lib/profiles/useDocumentPrefill";
import DocumentEditorLayout from "@/components/layouts/DocumentEditorLayout";
import { downloadPdf } from "@/lib/render/pdf-client";
import { getRelatedDocs } from "@/lib/site/registry";

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
}

interface InvoiceData {
  companyLogo: string;
  companyName: string;
  companyAddress: string;
  invoiceNumber: string;
  senderDetails: string;
  billTo: string;
  shipTo: string;
  date: string;
  paymentTerms: string;
  dueDate: string;
  poNumber: string;
  items: InvoiceItem[];
  notes: string;
  terms: string;
  taxPercent: number;
  discount: number;
  shipping: number;
  amountPaid: number;
  currency: string;
}

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none";
const labelClass = "text-xs font-semibold uppercase text-zinc-500 block mb-1";

function initialData(): InvoiceData {
  return {
    companyLogo: "/Assets/logo.webp",
    companyName: "ComplianceDraft",
    companyAddress: "456 Corporate Towers, Mumbai, Maharashtra, India",
    invoiceNumber: "1",
    senderDetails: "Rishabh dapkara",
    billTo: "Shivam gupta",
    shipTo: "",
    date: new Date().toISOString().split("T")[0],
    paymentTerms: "",
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000 * 24).toISOString().split("T")[0], // default 24 days out
    poNumber: "",
    items: [
      { description: "Frontend Task", quantity: 1, rate: 0 }
    ],
    notes: "NA",
    terms: "",
    taxPercent: 0,
    discount: 0,
    shipping: 0,
    amountPaid: 1000,
    currency: "₹",
  };
}

export default function InvoiceGeneratorPage() {
  const searchParams = useSearchParams();
  const companyId = searchParams.get("company");
  const { profile } = useCompanyProfile(companyId || undefined);
  const [data, setData] = useState<InvoiceData>(initialData);
  const [busy, setBusy] = useState(false);

  useDocumentPrefill(profile, setData, {
    companyName: (p) => p.companyName || "ComplianceDraft",
    companyAddress: (p) => p.registeredAddress || "",
    senderDetails: (p) => p.companyName || "Rishabh dapkara",
  });

  const update = <K extends keyof InvoiceData>(field: K, value: InvoiceData[K]) => {
    setData((prev) => ({ ...prev, [field]: value }));
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

  // Items managers
  const addItem = () => {
    update("items", [...data.items, { description: "", quantity: 1, rate: 0 }]);
  };

  const updateItem = (index: number, key: keyof InvoiceItem, val: any) => {
    const updated = [...data.items];
    updated[index] = { 
      ...updated[index], 
      [key]: key === "description" ? val : Number(val) 
    };
    update("items", updated);
  };

  const removeItem = (index: number) => {
    update("items", data.items.filter((_, idx) => idx !== index));
  };

  // Calculations
  const subtotal = useMemo(() => {
    return data.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  }, [data.items]);

  const taxAmount = useMemo(() => {
    return subtotal * (data.taxPercent / 100);
  }, [subtotal, data.taxPercent]);

  const total = useMemo(() => {
    return Math.max(0, subtotal + taxAmount + data.shipping - data.discount);
  }, [subtotal, taxAmount, data.shipping, data.discount]);

  const balanceDue = useMemo(() => {
    return total - data.amountPaid;
  }, [total, data.amountPaid]);

  const previewHtml = useMemo(() => {
    return renderInvoiceHtml(data, subtotal, taxAmount, total, balanceDue);
  }, [data, subtotal, taxAmount, total, balanceDue]);

  const relatedDocs = useMemo(() => {
    return getRelatedDocs("invoice-generator", "invoice-shared");
  }, []);

  const handleDownload = async (format: "pdf" | "docx") => {
    setBusy(true);
    try {
      const fileName = `Invoice_${data.invoiceNumber || "1"}_${(data.billTo || "Client").replace(/\s+/g, "_")}.${format}`;
      if (format === "pdf") {
        await downloadPdf(previewHtml, fileName);
      } else {
        const res = await fetch("/api/invoice/docx", {
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
      alert("Error generating invoice: " + e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <DocumentEditorLayout
      title="Professional Invoice Generator"
      description="Create, customize, and print clean client invoices instantly."
      companyId={companyId}
      aboutDescription="An Invoice is an official commercial document issued by a seller to a buyer, relating to a sale transaction and indicating the products, quantities, and agreed prices for products or services the seller had provided. It establishes a payment obligation on the part of the purchaser."
      relatedDocs={relatedDocs}
      onProfileSelect={(p) => {
        setData((prev) => ({
          ...prev,
          companyName: p.companyName || "",
          companyAddress: p.registeredAddress || "",
          senderDetails: `${p.companyName || ""}\n${p.registeredAddress || ""}`,
        }));
      }}
      busy={busy}
      onDownload={handleDownload}
      previewHtml={previewHtml}
      iframeTitle="Invoice Preview"
      inputSection={
        <div className="space-y-4">
          {/* Header & Logo */}
          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-wider">Invoice Configuration</h2>
            
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className={labelClass}>Invoice Number</label>
                <input className={inputClass} value={data.invoiceNumber} onChange={(e) => update("invoiceNumber", e.target.value)} placeholder="e.g. 1" />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Currency</label>
                <select className={inputClass} value={data.currency} onChange={(e) => update("currency", e.target.value)}>
                  <option value="₹">₹ (INR)</option>
                  <option value="$">$ (USD)</option>
                  <option value="€">€ (EUR)</option>
                  <option value="£">£ (GBP)</option>
                </select>
              </div>
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

          {/* Billing addresses */}
          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-wider">Addresses & Details</h2>
            <div className="space-y-1">
              <label className={labelClass}>From (Sender Details)</label>
              <textarea className={inputClass} rows={2} value={data.senderDetails} onChange={(e) => update("senderDetails", e.target.value)} placeholder="e.g. Rishabh dapkara" />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className={labelClass}>Bill To (Client)</label>
                <textarea className={inputClass} rows={2} value={data.billTo} onChange={(e) => update("billTo", e.target.value)} placeholder="e.g. Shivam gupta" />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Ship To (Optional)</label>
                <textarea className={inputClass} rows={2} value={data.shipTo} onChange={(e) => update("shipTo", e.target.value)} placeholder="e.g. Shipping address" />
              </div>
            </div>
          </div>

          {/* Dates & Terms */}
          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-wider">Dates & Terms</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className={labelClass}>Date</label>
                <input type="date" className={inputClass} value={data.date} onChange={(e) => update("date", e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Payment Terms</label>
                <input className={inputClass} value={data.paymentTerms} onChange={(e) => update("paymentTerms", e.target.value)} placeholder="e.g. Net 30" />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className={labelClass}>Due Date</label>
                <input type="date" className={inputClass} value={data.dueDate} onChange={(e) => update("dueDate", e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>PO Number</label>
                <input className={inputClass} value={data.poNumber} onChange={(e) => update("poNumber", e.target.value)} placeholder="e.g. PO-89021" />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-wider">Line Items</h2>
              <button type="button" onClick={addItem} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                + Add Line Item
              </button>
            </div>
            <div className="space-y-3">
              {data.items.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center bg-zinc-50 p-2 rounded-lg border border-zinc-100">
                  <input className={inputClass} style={{ flex: 3 }} value={item.description} onChange={(e) => updateItem(idx, "description", e.target.value)} placeholder="Item description" />
                  <input className={inputClass} style={{ flex: 1 }} type="number" value={item.quantity || ""} onChange={(e) => updateItem(idx, "quantity", e.target.value)} placeholder="Qty" />
                  <input className={inputClass} style={{ flex: 1.5 }} type="number" value={item.rate || ""} onChange={(e) => updateItem(idx, "rate", e.target.value)} placeholder="Rate" />
                  <button type="button" onClick={() => removeItem(idx)} className="p-1.5 text-zinc-400 hover:text-red-600 rounded transition-all" title="Remove Item">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Financial summary modifiers */}
          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-wider">Totals & Modifications</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className={labelClass}>Tax Percent (%)</label>
                <input type="number" className={inputClass} value={data.taxPercent || ""} onChange={(e) => update("taxPercent", Number(e.target.value))} placeholder="0" />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Discount Amount</label>
                <input type="number" className={inputClass} value={data.discount || ""} onChange={(e) => update("discount", Number(e.target.value))} placeholder="0" />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className={labelClass}>Shipping Cost</label>
                <input type="number" className={inputClass} value={data.shipping || ""} onChange={(e) => update("shipping", Number(e.target.value))} placeholder="0" />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Amount Paid</label>
                <input type="number" className={inputClass} value={data.amountPaid || ""} onChange={(e) => update("amountPaid", Number(e.target.value))} placeholder="0" />
              </div>
            </div>
          </div>

          {/* Notes and terms */}
          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-zinc-950 uppercase tracking-wider">Notes & Terms</h2>
            <div className="space-y-1">
              <label className={labelClass}>Notes</label>
              <textarea className={inputClass} rows={2} value={data.notes} onChange={(e) => update("notes", e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Terms & Conditions</label>
              <textarea className={inputClass} rows={2} value={data.terms} onChange={(e) => update("terms", e.target.value)} placeholder="e.g. Late fees, payment methods, delivery schedule" />
            </div>
          </div>
        </div>
      }
    />
  );
}

// Helper to escape HTML characters
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
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function renderInvoiceHtml(
  data: InvoiceData,
  subtotal: number,
  taxAmount: number,
  total: number,
  balanceDue: number
): string {
  const itemsHtml = data.items
    .map(
      (item) => `
    <tr class="item-row">
      <td class="desc">${escape(item.description)}</td>
      <td class="qty">${item.quantity}</td>
      <td class="rate">${data.currency} ${item.rate.toFixed(2)}</td>
      <td class="amount">${data.currency} ${(item.quantity * item.rate).toFixed(2)}</td>
    </tr>
  `
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice</title>
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
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
    }
    .logo-container {
      max-width: 40%;
    }
    .logo-img {
      max-height: 60px;
      max-width: 160px;
      object-fit: contain;
    }
    .title-container {
      text-align: right;
    }
    .title {
      font-size: 24pt;
      font-weight: 800;
      color: #111827;
      letter-spacing: -0.025em;
    }
    .invoice-number-box {
      display: inline-flex;
      align-items: center;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      padding: 4px 10px;
      margin-top: 6px;
      font-size: 10pt;
      font-weight: 600;
    }
    .invoice-number-label {
      color: #6b7280;
      margin-right: 4px;
    }
    .billing-section {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
    }
    .bill-col-left {
      width: 55%;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .bill-col-right {
      width: 40%;
    }
    .address-block {
      background: #fafafa;
      border: 1px solid #f3f4f6;
      border-radius: 8px;
      padding: 12px;
    }
    .address-label {
      font-size: 7.5pt;
      font-weight: 700;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 4px;
    }
    .address-value {
      font-size: 9pt;
      color: #374151;
      white-space: pre-line;
    }
    .meta-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9pt;
    }
    .meta-table td {
      padding: 6px 0;
      border-bottom: 1px solid #f3f4f6;
    }
    .meta-label {
      font-weight: 600;
      color: #6b7280;
    }
    .meta-val {
      text-align: right;
      font-weight: 600;
      color: #111827;
    }
    .table-container {
      margin-bottom: 30px;
    }
    table.items-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9.5pt;
    }
    table.items-table th {
      background: #1f2937;
      color: #ffffff;
      font-weight: 700;
      padding: 8px 12px;
      text-transform: uppercase;
      font-size: 8pt;
      letter-spacing: 0.05em;
    }
    table.items-table td {
      padding: 10px 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    .item-row td.desc {
      font-weight: 500;
      color: #111827;
      width: 50%;
    }
    .item-row td.qty {
      text-align: center;
      width: 12%;
    }
    .item-row td.rate {
      text-align: right;
      width: 18%;
    }
    .item-row td.amount {
      text-align: right;
      font-weight: 600;
      color: #111827;
      width: 20%;
    }
    .summary-section {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
    }
    .notes-col {
      width: 50%;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .notes-block {
      border-left: 3px solid #1f2937;
      padding-left: 12px;
    }
    .notes-title {
      font-size: 8pt;
      font-weight: 700;
      text-transform: uppercase;
      color: #9ca3af;
      margin-bottom: 4px;
    }
    .notes-content {
      font-size: 9pt;
      color: #4b5563;
      white-space: pre-wrap;
    }
    .calculations-col {
      width: 45%;
    }
    .calc-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9.5pt;
    }
    .calc-table td {
      padding: 6px 0;
      border-bottom: 1px solid #f3f4f6;
    }
    .calc-label {
      color: #4b5563;
    }
    .calc-val {
      text-align: right;
      font-weight: 600;
      color: #111827;
    }
    .total-row td {
      border-top: 2px solid #1f2937;
      border-bottom: 2px solid #1f2937;
      padding: 10px 0;
    }
    .total-label {
      font-weight: 800;
      font-size: 11pt;
      color: #111827;
    }
    .total-val {
      text-align: right;
      font-weight: 800;
      font-size: 12pt;
      color: #111827;
    }
    .balance-row td {
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 6px;
      padding: 8px 10px;
    }
    .balance-label {
      font-weight: 800;
      color: #b91c1c;
    }
    .balance-val {
      text-align: right;
      font-weight: 900;
      font-size: 13pt;
      color: #b91c1c;
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="header">
      <div class="logo-container">
        ${data.companyLogo ? `<img src="${data.companyLogo}" class="logo-img" alt="Logo" />` : ""}
      </div>
      <div class="title-container">
        <div class="title">INVOICE</div>
        <div class="invoice-number-box">
          <span class="invoice-number-label">#</span>
          <span>${escape(data.invoiceNumber)}</span>
        </div>
      </div>
    </div>

    <div class="billing-section">
      <div class="bill-col-left">
        <div class="address-block">
          <div class="address-label">From</div>
          <div class="address-value">${escape(data.senderDetails)}</div>
        </div>
        <div style="display: flex; gap: 12px;">
          <div class="address-block" style="flex: 1;">
            <div class="address-label">Bill To</div>
            <div class="address-value">${escape(data.billTo)}</div>
          </div>
          ${data.shipTo ? `
            <div class="address-block" style="flex: 1;">
              <div class="address-label">Ship To</div>
              <div class="address-value">${escape(data.shipTo)}</div>
            </div>
          ` : ""}
        </div>
      </div>
      <div class="bill-col-right">
        <table class="meta-table">
          <tbody>
            <tr>
              <td class="meta-label">Date</td>
              <td class="meta-val">${formatDate(data.date)}</td>
            </tr>
            ${data.paymentTerms ? `
              <tr>
                <td class="meta-label">Payment Terms</td>
                <td class="meta-val">${escape(data.paymentTerms)}</td>
              </tr>
            ` : ""}
            <tr>
              <td class="meta-label">Due Date</td>
              <td class="meta-val">${formatDate(data.dueDate)}</td>
            </tr>
            ${data.poNumber ? `
              <tr>
                <td class="meta-label">PO Number</td>
                <td class="meta-val">${escape(data.poNumber)}</td>
              </tr>
            ` : ""}
          </tbody>
        </table>
      </div>
    </div>

    <div class="table-container">
      <table class="items-table">
        <thead>
          <tr>
            <th>Item</th>
            <th style="text-align: center;">Quantity</th>
            <th style="text-align: right;">Rate</th>
            <th style="text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
    </div>

    <div class="summary-section">
      <div class="notes-col">
        ${data.notes ? `
          <div class="notes-block">
            <div class="notes-title">Notes</div>
            <div class="notes-content">${escape(data.notes)}</div>
          </div>
        ` : ""}
        ${data.terms ? `
          <div class="notes-block">
            <div class="notes-title">Terms & Conditions</div>
            <div class="notes-content">${escape(data.terms)}</div>
          </div>
        ` : ""}
      </div>
      <div class="calculations-col">
        <table class="calc-table">
          <tbody>
            <tr>
              <td class="calc-label">Subtotal</td>
              <td class="calc-val">${data.currency} ${subtotal.toFixed(2)}</td>
            </tr>
            ${data.taxPercent > 0 ? `
              <tr>
                <td class="calc-label">Tax (${data.taxPercent}%)</td>
                <td class="calc-val">${data.currency} ${taxAmount.toFixed(2)}</td>
              </tr>
            ` : ""}
            ${data.discount > 0 ? `
              <tr>
                <td class="calc-label">Discount</td>
                <td class="calc-val">- ${data.currency} ${data.discount.toFixed(2)}</td>
              </tr>
            ` : ""}
            ${data.shipping > 0 ? `
              <tr>
                <td class="calc-label">Shipping</td>
                <td class="calc-val">${data.currency} ${data.shipping.toFixed(2)}</td>
              </tr>
            ` : ""}
            <tr class="total-row">
              <td class="total-label">Total</td>
              <td class="total-val">${data.currency} ${total.toFixed(2)}</td>
            </tr>
            <tr>
              <td class="calc-label">Amount Paid</td>
              <td class="calc-val">${data.currency} ${data.amountPaid.toFixed(2)}</td>
            </tr>
            
          </tbody>
        </table>
      </div>
    </div>
  </div>
</body>
</html>`;
}
