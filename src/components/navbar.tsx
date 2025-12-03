import Link from "next/link";
import React from "react";

export default function Navbar() {
  return (
    <nav className="mx-auto">
      <ul className="flex gap-3">
        <Link href={"/"}>Home</Link>
        <Link href={"/"}>All posts</Link>
        <Link href={"/"}>About</Link>
      </ul>
    </nav>
  );
}
