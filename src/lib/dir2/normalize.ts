export type Dir2ServerData = {
  companyName: string;
  directorName: string;
  din: string;
  fatherName: string;
  address: string;
  email: string;
  mobileNumber: string;
  pan: string;
  occupation: string;
  dateOfBirth: string;
  nationality: string;
  existingDirectorships: string;
  directorCompanies: { companyName: string; designation: string }[];
  professionalMembership: {
    instituteName: string;
    membershipNumber: string;
    certificateOfPracticeNumber: string;
  }[];
  place: string;
  date: string;
  identityProofName: string;
  addressProofName: string;
  identityProofDetails: string;
  addressProofDetails: string;
  priorDirectorshipDetails: string;
};

export function normalizeDir2Values(raw: unknown): Dir2ServerData {
  const source = isRecord(raw) ? raw : {};

  return {
    companyName: str(source.companyName),
    directorName: str(source.directorName),
    din: str(source.din),
    fatherName: str(source.fatherName),
    address: str(source.address),
    email: str(source.email),
    mobileNumber: str(source.mobileNumber),
    pan: str(source.pan),
    occupation: str(source.occupation),
    dateOfBirth: str(source.dateOfBirth),
    nationality: str(source.nationality),
    existingDirectorships: str(source.existingDirectorships),
    directorCompanies: arr(source.directorCompanies).map((x) => ({
      companyName: str(x.companyName),
      designation: str(x.designation),
    })),
    professionalMembership: arr(source.professionalMembership).map((x) => ({
      instituteName: str(x.instituteName),
      membershipNumber: str(x.membershipNumber),
      certificateOfPracticeNumber: str(x.certificateOfPracticeNumber),
    })),
    place: str(source.place),
    date: str(source.date),
    identityProofName: str(source.identityProofName),
    addressProofName: str(source.addressProofName),
    identityProofDetails: str(source.identityProofDetails),
    addressProofDetails: str(source.addressProofDetails),
    priorDirectorshipDetails: str(source.priorDirectorshipDetails).trim(),
  };
}

function str(v: unknown) {
  return typeof v === "string" ? v : "";
}

function arr(v: unknown): Record<string, unknown>[] {
  if (!Array.isArray(v)) return [];
  return v.filter(isRecord);
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

