import { createClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://sekfibygpnzvmoraxwsa.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_NbKSGw-u-fMgW0FN_Idg0w_QwHnrkbZ";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || DEFAULT_SUPABASE_URL;
const supabaseAnonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || DEFAULT_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export type DbOrder = {
  id: string;
  customer_name: string;
  phone: string;
  fulfillment_type: string;
  address: string;
  items: string; // JSON string
  subtotal: number;
  gst: number;
  delivery_fee: number;
  total: number;
  status: string;
  special_instructions?: string;
  created_at: string;
};

export type DbReservation = {
  id: string;
  customer_name: string;
  phone: string;
  guest_count: number;
  date: string;
  time_slot: string;
  seating_preference: string;
  special_requests?: string;
  status: string;
  created_at: string;
};
