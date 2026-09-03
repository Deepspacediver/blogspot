import { ReactNode } from "react";
import Navbar from "./navbar";
import Image from "next/image";
import Link from "next/link";
import UserButtonsWrapper from "@/features/auth-state/user-buttons.wrapper";

type HeaderProps = {
  children?: ReactNode;
};

export default function Header({}: HeaderProps) {
  return (
    <header className="h-[75px] bg-card/80 backdrop-blur-md shadow-header flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-50">
      <Link href="/" className="shrink-0 flex items-center hover:opacity-90 transition-opacity">
        <Image src="/logo.svg" alt="Blogspot" width={48} height={48} priority />
      </Link>
      <Navbar />
      <div className="shrink-0 flex items-center">
        <UserButtonsWrapper />
      </div>
    </header>
  );
}
