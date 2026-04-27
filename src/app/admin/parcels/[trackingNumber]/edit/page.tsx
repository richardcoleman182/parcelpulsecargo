import { redirect } from "next/navigation";
import { isAdminRequest } from "@/lib/auth";
import { EditCargoForm } from "./EditCargoForm";

export default async function EditCargoPage({ params }: { params: Promise<{ trackingNumber: string }> }) {
  if (!(await isAdminRequest())) {
    redirect("/lex/auth");
  }

  const { trackingNumber } = await params;
  return <EditCargoForm trackingNumber={trackingNumber} />;
}
