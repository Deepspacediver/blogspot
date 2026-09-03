import { getAppSessionData } from "@/lib/auth-dal";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const { user } = await getAppSessionData();
  if (user) {
    redirect("/");
  }

  return (
    <div className="flex min-h-[calc(100vh-160px)] items-center justify-center p-4 sm:p-6 py-12">
      {children}
    </div>
  );
}
