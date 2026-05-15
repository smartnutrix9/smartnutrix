// src/lib/supabase.ts
// Supabase client for database operations

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || "";

// Public client (for reading published blog posts, categories)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client (for creating/editing/deleting posts - server-side only)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);