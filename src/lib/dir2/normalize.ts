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
  directorshipsText: string;
  professionalMembership: {
    instituteName: string;
    membershipNumber: string;
    certificateOfPracticeNumber: string;
  }[];
  membershipText: string;
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
    companyName: cleanDir2Text(source.companyName),
    directorName: cleanDir2Text(source.directorName),
    din: cleanDir2Text(source.din),
    fatherName: cleanDir2Text(source.fatherName),
    address: cleanDir2Text(source.address),
    email: cleanDir2Text(source.email),
    mobileNumber: cleanDir2Text(source.mobileNumber),
    pan: cleanDir2Text(source.pan),
    occupation: cleanDir2Text(source.occupation),
    dateOfBirth: cleanDir2Text(source.dateOfBirth),
    nationality: cleanDir2Text(source.nationality),
    existingDirectorships: cleanDir2Text(source.existingDirectorships),
    directorCompanies: arr(source.directorCompanies).map((x) => ({
      companyName: cleanDir2Text(x.companyName),
      designation: cleanDir2Text(x.designation),
    })),
    directorshipsText: cleanDir2Text(source.directorshipsText),
    professionalMembership: arr(source.professionalMembership).map((x) => ({
      instituteName: cleanDir2Text(x.instituteName),
      membershipNumber: cleanDir2Text(x.membershipNumber),
      certificateOfPracticeNumber: cleanDir2Text(x.certificateOfPracticeNumber),
    })),
    membershipText: cleanDir2Text(source.membershipText),
    place: cleanDir2Text(source.place),
    date: cleanDir2Text(source.date),
    identityProofName: cleanDir2Text(source.identityProofName),
    addressProofName: cleanDir2Text(source.addressProofName),
    identityProofDetails: cleanDir2Text(source.identityProofDetails),
    addressProofDetails: cleanDir2Text(source.addressProofDetails),
    priorDirectorshipDetails: cleanDir2Text(source.priorDirectorshipDetails),
  };
}

export function cleanDir2Text(v: unknown) {
  if (typeof v !== "string") return "";
  return v
    .split(/\r?\n/)
    .map((line) => (isBlankPlaceholder(line) ? "" : line.trim()))
    .filter(Boolean)
    .join("\n");
}

function isBlankPlaceholder(value: string) {
  const normalized = value.trim().replace(/\s+/g, "").toLowerCase();
  return (
    normalized === "na" ||
    normalized === "n/a" ||
    normalized === "n.a." ||
    /^_+$/.test(normalized)
  );
}

function arr(v: unknown): Record<string, unknown>[] {
  if (!Array.isArray(v)) return [];
  return v.filter(isRecord);
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
