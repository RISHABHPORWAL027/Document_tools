import type { Metadata } from "next";
import ModulePageClient from "@/components/ModulePageClient";
import { getFlow, moduleGroupedDocsForFlow } from "@/lib/site/registry";

const flow = getFlow("gst");

export const metadata: Metadata = { title: flow.title };

export default function GstPage() {
  return (
    <ModulePageClient
      flowId="gst"
      title={flow.title}
      subtitle={flow.subtitle}
      icon={flow.icon}
      accentColor={flow.accentColor}
      requiredDocs={flow.requiredDocs}
      docGroups={moduleGroupedDocsForFlow("gst")}
    />
  );
}
