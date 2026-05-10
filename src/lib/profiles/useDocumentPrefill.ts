import { useEffect, useRef } from "react";
import type { CompanyProfile } from "@/lib/profiles/types";

export function useDocumentPrefill<T extends Record<string, any>>(
  profile: CompanyProfile | null | undefined,
  setData: React.Dispatch<React.SetStateAction<T>>,
  mapping: Partial<{ [K in keyof T]: (p: CompanyProfile) => any }>
) {
  const mapRef = useRef(mapping);
  mapRef.current = mapping;

  useEffect(() => {
    if (!profile) return;
    setData((prev) => {
      const next = { ...prev };
      let hasChanges = false;
      for (const key in mapRef.current) {
        const mapper = mapRef.current[key];
        if (mapper) {
          const value = mapper(profile);
          if (value !== undefined && value !== next[key]) {
            next[key] = value;
            hasChanges = true;
          }
        }
      }
      return hasChanges ? next : prev;
    });
  }, [profile, setData]);
}
