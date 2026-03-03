import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  is_customizable: boolean;
  material: string | null;
  dimensions: string | null;
  finish: string | null;
  created_at: string;
  updated_at: string;
};

export type Inquiry = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  product_id: string | null;
  product_name: string;
  message: string | null;
  created_at: string;
};
