import type { ReactNode } from "react";
import { Navbar } from "./Navbar";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return <><Navbar /><main className="page-shell">{children}</main></>;
}
