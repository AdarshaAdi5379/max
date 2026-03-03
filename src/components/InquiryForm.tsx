"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageSquare, CheckCircle, Loader2 } from "lucide-react";

interface InquiryFormProps {
  productId: string;
  productName: string;
}

export function InquiryForm({ productId, productName }: InquiryFormProps) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.get("full_name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          product_id: productId,
          product_name: productName,
          message: formData.get("message") || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit inquiry");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) {
          setSubmitted(false);
          setError("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="lg" className="w-full">
          <MessageSquare className="mr-2 h-4 w-4" />
          Contact to Order
        </Button>
      </DialogTrigger>
      <DialogContent>
        {submitted ? (
          <div className="flex flex-col items-center py-8 text-center">
            <CheckCircle className="mb-4 h-12 w-12 text-green-600" />
            <h3 className="text-lg font-semibold">Inquiry Sent!</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              We&apos;ll get back to you soon about{" "}
              <strong>{productName}</strong>.
            </p>
            <Button
              className="mt-6"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Inquire About This Product</DialogTitle>
              <DialogDescription>
                Fill in your details and we&apos;ll get back to you about{" "}
                <strong>{productName}</strong>.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  required
                  minLength={2}
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  minLength={10}
                  placeholder="Your phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message (optional)</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Any specific requirements or questions?"
                  rows={3}
                />
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Inquiry
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
