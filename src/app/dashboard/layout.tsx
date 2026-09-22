import DashboardSidebar from "../../components/dashboard/dashboardSideBar";
import DashboardGuard from "../../components/auth/dashboardGuard";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardGuard>
      <div className="min-h-screen bg-zinc-50">
        <DashboardSidebar />

        <main className="min-w-0 md:ml-64">
          {children}
        </main>
      </div>
    </DashboardGuard>
  );
}