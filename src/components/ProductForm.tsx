"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/ImageUpload";
import { Loader2 } from "lucide-react";
import type { Product } from "@/lib/supabase";

interface ProductFormProps {
  product?: Product;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(product?.image_url ?? null);
  const [isCustomizable, setIsCustomizable] = useState(product?.is_customizable ?? false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const body = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: parseFloat(formData.get("price") as string),
      image_url: imageUrl,
      is_customizable: isCustomizable,
      material: formData.get("material") || null,
      dimensions: formData.get("dimensions") || null,
      finish: formData.get("finish") || null,
    };

    try {
      const url = product
        ? `/api/admin/products/${product.id}`
        : "/api/admin/products";
      const method = product ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save product");
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>Product Image</Label>
        <ImageUpload value={imageUrl} onChange={setImageUrl} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            name="name"
            required
            defaultValue={product?.name}
            placeholder="e.g. Custom Phone Stand"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price (₹)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={product?.price}
            placeholder="499.00"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          defaultValue={product?.description}
          placeholder="Describe your product..."
          rows={4}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="material">Material</Label>
          <Input
            id="material"
            name="material"
            defaultValue={product?.material ?? ""}
            placeholder="PLA, ABS, PETG..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dimensions">Dimensions</Label>
          <Input
            id="dimensions"
            name="dimensions"
            defaultValue={product?.dimensions ?? ""}
            placeholder="10x5x3 cm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="finish">Finish</Label>
          <Input
            id="finish"
            name="finish"
            defaultValue={product?.finish ?? ""}
            placeholder="Matte, Glossy..."
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="is_customizable"
          checked={isCustomizable}
          onCheckedChange={setIsCustomizable}
        />
        <Label htmlFor="is_customizable">Customizable product</Label>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {product ? "Update Product" : "Add Product"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
