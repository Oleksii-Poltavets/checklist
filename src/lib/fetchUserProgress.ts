import { createSupabaseClientWithToken } from "./supabaseClient";

export async function fetchUserProgress(token: string, userId: string, weekRange: string) {
    const supabase = createSupabaseClientWithToken(token);

    const { data, error } = await supabase
        .from("user_progress_clerk")
        .select("*")
        .eq("clerk_user_id", userId)
        .eq("week_range", weekRange);

    if (error) {
        console.error("Error fetching progress:", error);
        return null;
    }

    // If data is an array, use the first row
    const row = Array.isArray(data) ? data[0] : data;

    if (row) {
        return {
            ...row,
            goala_day_checks: Array.isArray(row.goala_day_checks)
                ? row.goala_day_checks
                : Array(7).fill(false),
            habbit_checks: typeof row.habbit_checks === "object" && row.habbit_checks !== null
                ? row.habbit_checks
                : {},
            habbit_ids: Array.isArray(row.habbit_ids)
                ? row.habbit_ids
                : [0, 1, 2, 3],
            habbit_names: Array.isArray(row.habbit_names)
                ? row.habbit_names
                : ["", "", "", ""], // <-- default
            day_goal_texts: Array.isArray(row.day_goal_texts)
                ? row.day_goal_texts
                : Array(7).fill(""),
        };
    }

    return null;
}