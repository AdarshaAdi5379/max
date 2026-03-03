"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { InquiryForm } from "@/components/InquiryForm";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import type { Product } from "@/lib/supabase";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setProduct)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-2">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-10 w-1/3" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto flex max-w-6xl flex-col items-center justify-center px-4 py-24 text-center">
          <h2 className="text-2xl font-bold">Product Not Found</h2>
          <p className="mt-2 text-muted-foreground">
            This product doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center text-sm font-medium hover:underline"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to products
          </Link>
        </main>
      </div>
    );
  }

  const specs = [
    { label: "Material", value: product.material },
    { label: "Dimensions", value: product.dimensions },
    { label: "Finish", value: product.finish },
  ].filter((s) => s.value);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Link
          href="/"
          className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to products
        </Link>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <svg
                  className="h-24 w-24"
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
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="flex items-start gap-3">
              <h1 className="text-2xl font-bold sm:text-3xl">{product.name}</h1>
              {product.is_customizable && (
                <Badge variant="secondary" className="mt-1">
                  Customizable
                </Badge>
              )}
            </div>

            <p className="mt-3 text-3xl font-bold">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </p>

            <p className="mt-4 leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            {specs.length > 0 && (
              <div className="mt-6 space-y-3 border-t pt-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Specifications
                </h3>
                <dl className="space-y-2">
                  {specs.map((spec) => (
                    <div key={spec.label} className="flex justify-between text-sm">
                      <dt className="text-muted-foreground">{spec.label}</dt>
                      <dd className="font-medium">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <div className="mt-auto space-y-3 pt-8">
              <InquiryForm productId={product.id} productName={product.name} />
              <WhatsAppButton productName={product.name} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
