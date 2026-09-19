import type { AccessRole, Department } from "./types";

export const departmentLabels: Record<Department, string> = {
  "career-services-operations": "Career Services Operations",
  "business-formalisation-compliance": "Business Formalisation & Compliance",
};

export const roleLabels: Record<AccessRole, string> = {
  administrator: "Administrator",
  editor: "Editor",
  viewer: "Viewer",
};
