"use client";

import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center p-4 shadow-md bg-white">
      <Link href="/">
        <Image
          src="/assets/logo.png"  // ✅ must exist in /public/assets/logo.png
          alt="Domana Logo"
          width={160}
          height={50}
          priority
        />
      </Link>
    </header>
  );
}
