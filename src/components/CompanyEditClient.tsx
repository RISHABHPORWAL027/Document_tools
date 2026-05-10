"use client";

import CompanyFormPage from "./CompanyFormPage";

export default function CompanyEditClient({ id }: { id: string }) {
  return <CompanyFormPage companyId={id} />;
}
