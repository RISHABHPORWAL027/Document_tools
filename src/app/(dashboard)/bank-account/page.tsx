import type { Metadata } from "next";
import ModulePageClient from "@/components/ModulePageClient";
import { getFlow, moduleGroupedDocsForFlow } from "@/lib/site/registry";

const flow = getFlow("bank_account");

export const metadata: Metadata = { title: flow.title };

export default function BankAccountPage() {
  return (
    <ModulePageClient
      flowId="bank_account"
      title={flow.title}
      subtitle={flow.subtitle}
      icon={flow.icon}
      accentColor={flow.accentColor}
      requiredDocs={flow.requiredDocs}
      docGroups={moduleGroupedDocsForFlow("bank_account")}
    />
  );
}
