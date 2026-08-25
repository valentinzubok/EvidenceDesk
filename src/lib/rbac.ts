export type Role = "admin" | "moderator" | "viewer";

const ROLE_KEY = "evidence-desk:role";

export function getRole(): Role {
  if (typeof window === "undefined") return "viewer";
  const raw = localStorage.getItem(ROLE_KEY);
  if (raw === "admin" || raw === "moderator" || raw === "viewer") return raw;
  return "viewer";
}

export function setRole(role: Role): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ROLE_KEY, role);
}

/** Client-side RBAC gate for write operations (demo until on-chain roles ship). */
export function canWrite(role: Role = getRole()): boolean {
  return role === "admin" || role === "moderator";
}

export function canModerate(role: Role = getRole()): boolean {
  return role === "admin";
}

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  moderator: "Moderator",
  viewer: "Viewer",
};
