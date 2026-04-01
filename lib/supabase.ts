import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getSupabaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    requireEnv("NEXT_PUBLIC_SUPABASE_URL")
  );
}

function getSupabaseAnonKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  );
}

export type PaymentStatus = "processing" | "succeeded" | "payment_failed";
export type ApprovalStatus = "inconversation" | "approved" | "nothanks";
export type PaperworkStatus = "not_sent" | "sent" | "completed";

export interface DonorRow {
  id: string;
  email: string;
  full_legal_name: string;
  stripe_customer_id: string | null;
  auth_user_id: string | null;
  last_magic_link_sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvestmentRow {
  id: string;
  donor_id: string;
  stripe_payment_intent_id: string;
  investor_reference: string | null;
  amount: number;
  payment_status: PaymentStatus;
  approval_status: ApprovalStatus;
  paperwork_status: PaperworkStatus;
  pending_email_sent_at: string | null;
  failed_email_sent_at: string | null;
  received_email_sent_at: string | null;
  approved_email_sent_at: string | null;
  created_at: string;
  updated_at: string;
}

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        );
      },
    },
  });
}

export function createSupabaseAdminClient() {
  return createClient(getSupabaseUrl(), requireEnv("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
