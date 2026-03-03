"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductForm } from "@/components/ProductForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import type { Product } from "@/lib/supabase";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function fetchProducts() {
    setLoading(true);
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleDelete() {
    if (!deletingId) return;
    await fetch(`/api/admin/products/${deletingId}`, { method: "DELETE" });
    setDeletingId(null);
    fetchProducts();
  }

  if (showForm || editingProduct) {
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold">
          {editingProduct ? "Edit Product" : "Add Product"}
        </h1>
        <ProductForm
          product={editingProduct}
          onSuccess={() => {
            setShowForm(false);
            setEditingProduct(undefined);
            fetchProducts();
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(undefined);
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <p className="text-muted-foreground">No products yet</p>
          <Button className="mt-4" onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add your first product
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Product</th>
                <th className="px-4 py-3 text-left font-medium">Price</th>
                <th className="px-4 py-3 text-left font-medium">Type</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded border bg-muted">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    {product.is_customizable ? (
                      <Badge variant="secondary">Customizable</Badge>
                    ) : (
                      <Badge variant="outline">Fixed</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingProduct(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingId(product.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
