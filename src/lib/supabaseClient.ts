import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export function createSupabaseClientWithToken(token: string) {
    return createClient(supabaseUrl, supabaseAnonKey, {
        global: {
            fetch: (url, options = {}) => {
                options.headers = {
                    ...options.headers,
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    apikey: supabaseAnonKey,
                };
                return fetch(url, options);
            },
        },
    });
}