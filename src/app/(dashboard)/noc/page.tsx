import type { Metadata } from "next";
import NocPage from "@/components/NocPage";

export const metadata: Metadata = {
  title: "NOC — No Objection Certificate",
};

export default function NocRoute() {
  return <NocPage />;
}
