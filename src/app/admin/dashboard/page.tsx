import { redirect } from "next/navigation";
import { isAdminRequest } from "@/lib/auth";
import { AdminDashboard } from "./AdminDashboard";

export default async function AdminDashboardPage() {
  if (!(await isAdminRequest())) {
    redirect("/lex/auth");
  }

  return <AdminDashboard />;
}
