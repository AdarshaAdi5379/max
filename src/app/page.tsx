import { Header } from "@/components/Header";
import { ProductGrid } from "@/components/ProductGrid";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Our Products</h1>
          <p className="mt-2 text-muted-foreground">
            Precision 3D printed products, built to order.
          </p>
        </div>
        <ProductGrid />
      </main>
    </div>
  );
}
