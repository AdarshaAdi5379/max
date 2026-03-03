"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";
import type { Inquiry } from "@/lib/supabase";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/inquiries")
      .then((res) => res.json())
      .then(setInquiries)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Inquiries</h1>
        <p className="text-sm text-muted-foreground">
          {inquiries.length} inquiry{inquiries.length !== 1 ? " requests" : " request"}
        </p>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : inquiries.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <p className="text-muted-foreground">No inquiries yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="rounded-lg border p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{inquiry.full_name}</h3>
                    <Badge variant="outline">{inquiry.product_name}</Badge>
                  </div>
                  {inquiry.message && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {inquiry.message}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    {new Date(inquiry.created_at).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`mailto:${inquiry.email}`}>
                      <Mail className="mr-1 h-3 w-3" />
                      Email
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`tel:${inquiry.phone}`}>
                      <Phone className="mr-1 h-3 w-3" />
                      Call
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
