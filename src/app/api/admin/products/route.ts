import { supabase } from "@/lib/supabase";
import { isAuthenticated } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from("products")
      .insert({
        name: body.name,
        description: body.description,
        price: body.price,
        image_url: body.image_url,
        is_customizable: body.is_customizable ?? false,
        material: body.material,
        dimensions: body.dimensions,
        finish: body.finish,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
