export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Chandigarh", "Puducherry", "Jammu & Kashmir", "Ladakh",
];

export const STATE_CODES: Record<string, string> = {
  "Andhra Pradesh": "AP", "Arunachal Pradesh": "AR", "Assam": "AS",
  "Bihar": "BR", "Chhattisgarh": "CG", "Goa": "GA", "Gujarat": "GJ",
  "Haryana": "HR", "Himachal Pradesh": "HP", "Jharkhand": "JH",
  "Karnataka": "KA", "Kerala": "KL", "Madhya Pradesh": "MP",
  "Maharashtra": "MH", "Manipur": "MN", "Meghalaya": "ML",
  "Mizoram": "MZ", "Nagaland": "NL", "Odisha": "OD", "Punjab": "PB",
  "Rajasthan": "RJ", "Sikkim": "SK", "Tamil Nadu": "TN", "Telangana": "TS",
  "Tripura": "TR", "Uttar Pradesh": "UP", "Uttarakhand": "UK",
  "West Bengal": "WB", "Delhi": "DL", "Chandigarh": "CH",
  "Puducherry": "PY", "Jammu & Kashmir": "JK", "Ladakh": "LA",
};

export const SECTORS = [
  "Software", "Technology", "Manufacturing", "Construction", "Agriculture",
  "Logistics", "Retail", "Healthcare", "Finance", "Education", "Real Estate",
  "Hospitality", "Media", "Consulting", "Legal", "Other",
];

export const DESIGNATIONS = [
  "Director", "Managing Director", "CEO", "Whole Time Director",
  "Company Secretary", "CFO", "Manager", "Authorized Signatory",
];

export type Director = {
  id: string;
  name: string;
  din: string;
  pan: string;
  aadhaar: string;
  fatherName: string;
  dob: string;
  occupation: string;
  nationality: string;
  email: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  /**
   * Free-text answer for DIR-2 item 11 — existing directorships / designated posts.
   */
  priorDirectorshipDetails: string;
  designation: string;
};

export type Company = {
  id: string;
  name: string;
  cin: string;
  sector: string;
  businessActivity: string;
  /** Building / street / locality (without city PIN state — use fields below) */
  registeredAddress: string;
  /** City / town for registered office */
  place: string;
  /** Postal PIN code (6 digits) */
  pincode: string;
  state: string;
  authorizedCapital: string;
  paidUpCapital: string;
  email: string;
  mobile: string;
  directors: Director[];
  createdAt: number;
  updatedAt: number;
};

export function emptyDirector(): Director {
  return {
    id: `dir-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: "", din: "", pan: "", aadhaar: "", fatherName: "",
    dob: "", occupation: "", nationality: "Indian", email: "",
    mobile: "", address: "", city: "", state: "", pincode: "",
    priorDirectorshipDetails: "",
    designation: "Director",
  };
}

export function emptyCompany(): Company {
  return {
    id: `co-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: "", cin: "", sector: "", businessActivity: "",
    registeredAddress: "", place: "", pincode: "", state: "",
    authorizedCapital: "",
    paidUpCapital: "", email: "", mobile: "",
    directors: [emptyDirector()],
    createdAt: Date.now(), updatedAt: Date.now(),
  };
}

/** Merge address parts for documents / autofill (single line). */
export function formatRegisteredOfficeLine(c: Pick<Company, "registeredAddress" | "place" | "pincode" | "state">): string {
  const parts = [
    c.registeredAddress?.trim(),
    c.place?.trim(),
    c.pincode?.trim(),
    c.state?.trim(),
  ].filter(Boolean);
  return parts.join(", ");
}
