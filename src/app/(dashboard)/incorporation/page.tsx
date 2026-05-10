import type { Metadata } from "next";
import ModulePageClient from "@/components/ModulePageClient";
import { getFlow, moduleGroupedDocsForFlow } from "@/lib/site/registry";

const flow = getFlow("incorporation");

export const metadata: Metadata = { title: flow.title };

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
