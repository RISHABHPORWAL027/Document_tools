export type DirectorProfile = {
  directorName: string;
  din: string;
  fatherName: string;
  pan: string;
  designation: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  email: string;
  mobileNumber: string;
  occupation: string;
  /** DIR-2 item 11 — narrative from company profile */
  priorDirectorshipDetails: string;
};

export type MembershipProfile = {
  instituteName: string;
  membershipNumber: string;
  certificateOfPracticeNumber: string;
};

export type CompanyProfile = {
  id: string;
  companyName: string;
  cin: string;
  registeredAddress: string;
  /** City / place of registered office (from Company.place) */
  place: string;
  email: string;
  mobileNumber: string;
  directors: DirectorProfile[];
  professionalMemberships: MembershipProfile[];
  createdAt: number;
};
