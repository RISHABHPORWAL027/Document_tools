"use client";

import { useSyncExternalStore } from "react";
import {
  getCompaniesServerSnapshot,
  getCompaniesSnapshot,
  subscribeToCompanies,
} from "@/lib/companies/storage";
import type { CompanyProfile } from "@/lib/profiles/types";
import { formatRegisteredOfficeLine, type Company } from "@/lib/companies/types";

/** Map new Company → legacy CompanyProfile */
export function toCompanyProfile(c: Company): CompanyProfile {
  return {
    id: c.id,
    companyName: c.name,
    cin: c.cin,
    registeredAddress: formatRegisteredOfficeLine(c),
    place: c.place,
    email: c.email,
    mobileNumber: c.mobile,
    directors: c.directors.map((d) => ({
      directorName: d.name,
      din: d.din,
      fatherName: d.fatherName,
      pan: d.pan,
      designation: d.designation,
      dateOfBirth: d.dob,
      nationality: d.nationality,
      address: d.address,
      city: d.city,
      state: d.state,
      pincode: d.pincode,
      email: d.email,
      mobileNumber: d.mobile,
      occupation: d.occupation,
      priorDirectorshipDetails: d.priorDirectorshipDetails,
    })),
    professionalMemberships: [],
    createdAt: c.createdAt,
  };
}

export function useCompanyProfile(id?: string) {
  const companies = useSyncExternalStore(
    subscribeToCompanies,
    getCompaniesSnapshot,
    getCompaniesServerSnapshot
  );

  const found = id ? companies.find((c) => c.id === id) : null;
  const profile = found ? toCompanyProfile(found) : null;

  return {
    profile,
    loading: false, // LocalStorage is synchronous but we keep API for consistency
  };
}
