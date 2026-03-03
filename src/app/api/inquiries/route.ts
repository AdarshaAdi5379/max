import { supabase } from "@/lib/supabase";
import { sendInquiryNotification } from "@/lib/email";
import { NextResponse } from "next/server";
import { z } from "zod/v4";

const inquirySchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  product_id: z.string().uuid().nullable(),
  product_name: z.string().min(1),
  message: z.string().nullable().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = inquirySchema.parse(body);

    const { data, error } = await supabase
      .from("inquiries")
      .insert({
        full_name: parsed.full_name,
        email: parsed.email,
        phone: parsed.phone,
        product_id: parsed.product_id,
        product_name: parsed.product_name,
        message: parsed.message ?? null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send email notification (don't block response)
    sendInquiryNotification({
      full_name: parsed.full_name,
      email: parsed.email,
      phone: parsed.phone,
      product_name: parsed.product_name,
      message: parsed.message ?? null,
    }).catch(console.error);

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: err.issues },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
