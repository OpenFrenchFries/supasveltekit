import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://<your-supabase-url>.supabase.co";
export const supabaseKey = "<your-supabase-key>";

export const supabase = createClient(supabaseUrl, supabaseKey);