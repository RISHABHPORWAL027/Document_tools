import type { ToolCategory, ToolDefinition, ToolCategoryId } from "./types";

export const CATEGORIES: ToolCategory[] = [];

export const TOOLS: Record<string, ToolDefinition> = {};

export function getToolsByCategory(categoryId: ToolCategoryId): ToolDefinition[] {
  return [];
}

export function getTool(toolId: string): ToolDefinition | null {
  return TOOLS[toolId] ?? null;
}

export function getPopularTools(limit = 6): ToolDefinition[] {
  return [];
}

