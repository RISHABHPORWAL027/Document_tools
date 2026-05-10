import type { CompanyProfile } from "./types";

const STORAGE_KEY = "compliance_tool_profiles";

export function getProfiles(): CompanyProfile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CompanyProfile[];
  } catch {
    return [];
  }
}

export function saveProfile(profile: CompanyProfile): void {
  const profiles = getProfiles();
  const existing = profiles.findIndex((p) => p.id === profile.id);
  if (existing >= 0) {
    profiles[existing] = profile;
  } else {
    profiles.push(profile);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}

export function deleteProfile(id: string): void {
  const profiles = getProfiles().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
