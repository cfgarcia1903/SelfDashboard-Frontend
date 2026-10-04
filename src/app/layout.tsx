import type { Metadata } from "next";
import "./globals.css";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export const metadata: Metadata = { title: { default: "SelfDashboard", template: "%s | SelfDashboard" }, description: "Patrimonio e inversiones personales en un solo lugar." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body><DashboardLayout>{children}</DashboardLayout></body></html>;
}
