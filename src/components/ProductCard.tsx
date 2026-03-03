"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/supabase";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md">
        <div className="relative aspect-square bg-muted">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <svg
                className="h-12 w-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
          )}
          {product.is_customizable && (
            <Badge className="absolute right-2 top-2" variant="secondary">
              Customizable
            </Badge>
          )}
        </div>
        <div className="p-4">
          <h3 className="truncate font-medium">{product.name}</h3>
          <p className="mt-1 text-lg font-semibold">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </Link>
  );
}
