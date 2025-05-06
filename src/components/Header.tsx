"use client";
import { UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="flex justify-end p-4">
      <UserButton />
    </header>
  );
}
