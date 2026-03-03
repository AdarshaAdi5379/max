"use client";

import Link from "next/link";
import { Package } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Package className="h-6 w-6" />
          <span className="text-xl font-bold tracking-tight">MAX</span>
        </Link>
        <p className="hidden text-sm text-muted-foreground sm:block">
          3D Printed Products
        </p>
      </div>
    </header>
  );
}
