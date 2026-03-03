import { supabase } from "@/lib/supabase";
import { isAuthenticated } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Use JPEG, PNG, or WebP." },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Max 5MB." },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file, { contentType: file.type });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
