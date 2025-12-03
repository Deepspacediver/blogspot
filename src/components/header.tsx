import { ReactNode } from "react";
import Navbar from "./navbar";
import Image from "next/image";
import UserButtonsWrapper from "@/features/auth-state/user-buttons.wrapper";

type HeaderProps = {
  children?: ReactNode;
};

export default function Header({ children }: HeaderProps) {
  return (
    <header className="h-[75px] bg-white shadow-header flex items-center gap-2 p-1">
      <Image src="/logo.svg" alt="Blogspot" width={50} height={50} />
      <Navbar />
      <UserButtonsWrapper />
    </header>
  );
}
