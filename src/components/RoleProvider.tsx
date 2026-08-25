"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { canWrite, getRole, setRole, type Role } from "@/lib/rbac";

type RoleContextValue = {
  role: Role;
  setUserRole: (role: Role) => void;
  canWrite: boolean;
};

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("viewer");

  useEffect(() => {
    setRoleState(getRole());
  }, []);

  const setUserRole = useCallback((next: Role) => {
    setRole(next);
    setRoleState(next);
  }, []);

  const value = useMemo(
    () => ({ role, setUserRole, canWrite: canWrite(role) }),
    [role, setUserRole],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
