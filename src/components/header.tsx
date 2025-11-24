import { ReactNode } from "react";
import Navbar from "./navbar";

type HeaderProps = {
  children?: ReactNode;
};

export default function Header({ children }: HeaderProps) {
  return (
    <header className="h-[75px] bg-white shadow-header flex items-center">
      <Navbar />
    </header>
  );
}
