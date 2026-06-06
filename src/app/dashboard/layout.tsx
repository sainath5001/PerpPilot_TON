import { ProtectedDashboardLayout } from "@/components/layout/ProtectedDashboardLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedDashboardLayout>{children}</ProtectedDashboardLayout>;
}
