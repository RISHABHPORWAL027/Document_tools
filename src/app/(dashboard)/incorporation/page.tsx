import type { Metadata } from "next";
import dynamic from "next/dynamic";

const ModulePageClient = dynamic(() => import("@/components/ModulePageClient"), {
  loading: () => <div className="flex h-screen items-center justify-center"><div className="text-zinc-500 animate-pulse">Loading Document Editor...</div></div>
});
import { getFlow, moduleGroupedDocsForFlow } from "@/lib/site/registry";

const flow = getFlow("incorporation");

export const metadata: Metadata = {
  title: flow.title,
  description: "Access templates and document generators for Company and LLP incorporation, including DIR-2, LLP Form 9, subscription sheets, and NOCs.",
};

export default function IncorporationPage() {
  return (
    <ModulePageClient
      flowId="incorporation"
      title={flow.title}
      subtitle={flow.subtitle}
      icon={flow.icon}
      accentColor={flow.accentColor}
      requiredDocs={flow.requiredDocs}
      docGroups={moduleGroupedDocsForFlow("incorporation")}
    />
  );
}
