import { getAppSessionData } from "@/lib/auth-dal";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const { user } = await getAppSessionData();
  if (user) {
    redirect("/");
  }

  return children;
}
