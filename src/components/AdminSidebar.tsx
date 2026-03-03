"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Package, ShoppingBag, MessageSquare, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/products", label: "Products", icon: ShoppingBag },
  { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/admin");
  }

  return (
    <aside className="flex h-screen w-56 flex-col border-r bg-card">
      <div className="flex h-16 items-center gap-2 border-b px-4">
        <Package className="h-5 w-5" />
        <span className="font-bold">MAX Admin</span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
              pathname === item.href
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="border-t p-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-muted-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
