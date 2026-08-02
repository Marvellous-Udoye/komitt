export const config = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  n8nBaseUrl: process.env.NEXT_PUBLIC_N8N_BASE_URL ?? "",
};

export function isConfigured() {
  return Boolean(config.supabaseUrl && config.supabaseAnonKey && config.n8nBaseUrl);
}
