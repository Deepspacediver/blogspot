import { Link } from "@/components/ui/link";
import React from "react";

export default function Navbar() {
  return (
    <nav className="mx-auto">
      <ul className="flex items-center gap-1 sm:gap-2">
        <li>
          <Link href="/" variant="nav">
            Home
          </Link>
        </li>
        <li>
          <Link href="/" variant="nav">
            About
          </Link>
        </li>
      </ul>
    </nav>
  );
}
