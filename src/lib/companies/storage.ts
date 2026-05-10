import type { Company, Director } from "./types";
import { emptyDirector } from "./types";

const KEY = "compliance_companies_v1";

function normalizeDirector(d: Partial<Director> & { id?: string }): Director {
  const base = emptyDirector();
  return {
    ...base,
    ...d,
    id: typeof d.id === "string" && d.id ? d.id : base.id,
  };
}

function normalizeCompanyRow(raw: Record<string, unknown>): Company {
  const directors = Array.isArray(raw.directors)
    ? (raw.directors as Record<string, unknown>[]).map((d) =>
        normalizeDirector(d as Partial<Director>),
      )
    : [emptyDirector()];
  return {
    id: String(raw.id ?? ""),
    name: String(raw.name ?? ""),
    cin: String(raw.cin ?? ""),
    sector: String(raw.sector ?? ""),
    businessActivity: String(raw.businessActivity ?? ""),
    registeredAddress: String(raw.registeredAddress ?? ""),
    place: String(raw.place ?? ""),
    pincode: String(raw.pincode ?? ""),
    state: String(raw.state ?? ""),
    authorizedCapital: String(raw.authorizedCapital ?? ""),
    paidUpCapital: String(raw.paidUpCapital ?? ""),
    email: String(raw.email ?? ""),
    mobile: String(raw.mobile ?? ""),
    directors: directors.length ? directors : [emptyDirector()],
    createdAt: typeof raw.createdAt === "number" ? raw.createdAt : Date.now(),
    updatedAt: typeof raw.updatedAt === "number" ? raw.updatedAt : Date.now(),
  };
}

export function getCompanies(): Company[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.map((row) =>
      normalizeCompanyRow(
        typeof row === "object" && row !== null
          ? (row as Record<string, unknown>)
          : {},
      ),
    );
  } catch {
    return [];
  }
}

export function getCompany(id: string): Company | null {
  return getCompanies().find((c) => c.id === id) ?? null;
}

export function saveCompany(company: Company): void {
  const all = getCompanies();
  const idx = all.findIndex((c) => c.id === company.id);
  const updated = { ...company, updatedAt: Date.now() };
  if (idx >= 0) all[idx] = updated;
  else all.push(updated);
  localStorage.setItem(KEY, JSON.stringify(all));
  notifyCompanySubscribers();
}

export function deleteCompany(id: string): void {
  const all = getCompanies().filter((c) => c.id !== id);
  localStorage.setItem(KEY, JSON.stringify(all));
  notifyCompanySubscribers();
}

// ── reactive store for useSyncExternalStore ──────────────────────────────────
let _subscribers: (() => void)[] = [];
let _cache: Company[] | null = null;
const _EMPTY: Company[] = [];

export function subscribeToCompanies(cb: () => void) {
  _subscribers.push(cb);
  return () => {
    _subscribers = _subscribers.filter((s) => s !== cb);
  };
}

export function notifyCompanySubscribers() {
  _cache = null;
  _subscribers.forEach((s) => s());
}

export function getCompaniesSnapshot(): Company[] {
  if (_cache === null) _cache = getCompanies();
  return _cache;
}

export function getCompaniesServerSnapshot(): Company[] {
  return _EMPTY;
}
