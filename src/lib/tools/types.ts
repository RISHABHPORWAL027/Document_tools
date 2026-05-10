import { z } from "zod";

export type ToolCategoryId =
  | "company-secretary"
  | "chartered-accountant"
  | "legal"
  | "compliance-support";

export type FieldType =
  | "text"
  | "textarea"
  | "date"
  | "number"
  | "select"
  | "repeatable";

export type BaseField = {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
  placeholder?: string;
  type: Exclude<FieldType, "repeatable">;
  options?: { label: string; value: string }[];
};

export type RepeatableField = {
  type: "repeatable";
  name: string;
  label: string;
  description?: string;
  minItems?: number;
  maxItems?: number;
  itemLabel?: string;
  fields: BaseField[];
};

export type ToolField = BaseField | RepeatableField;

export type ToolDefinition = {
  id: string;
  categoryId: ToolCategoryId;
  title: string;
  summary: string;
  keywords?: string[];
  popularity?: number;
  fields: ToolField[];
  template: {
    format: "html";
    source: string;
  };
};

export type ToolCategory = {
  id: ToolCategoryId;
  name: string;
  summary: string;
};

export function buildZodSchema(fields: ToolField[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const f of fields) {
    if (f.type === "repeatable") {
      const itemShape: Record<string, z.ZodTypeAny> = {};
      for (const sf of f.fields) {
        let base: z.ZodTypeAny;
        switch (sf.type) {
          case "number":
            base = z.coerce.number();
            break;
          default:
            base = z.string();
            break;
        }
        if (sf.required) {
          base = base.refine(
            (v) => (typeof v === "number" ? true : String(v).trim().length > 0),
            { message: `${sf.label} is required` },
          );
        } else {
          base = base.optional();
        }
        itemShape[sf.name] = base;
      }

      let arr = z.array(z.object(itemShape));
      if (typeof f.minItems === "number") arr = arr.min(f.minItems);
      if (typeof f.maxItems === "number") arr = arr.max(f.maxItems);
      shape[f.name] = arr;
      continue;
    }

    let base: z.ZodTypeAny;
    switch (f.type) {
      case "number":
        base = z.coerce.number();
        break;
      default:
        base = z.string();
        break;
    }
    if (f.required) {
      base = base.refine(
        (v) => (typeof v === "number" ? true : String(v).trim().length > 0),
        { message: `${f.label} is required` },
      );
    } else {
      base = base.optional();
    }
    shape[f.name] = base;
  }

  return z.object(shape);
}

