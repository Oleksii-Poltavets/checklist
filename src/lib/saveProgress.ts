import { v4 as uuidv4 } from "uuid";
import { createSupabaseClientWithToken } from "./supabaseClient";

export async function saveUserProgress({
    token,
    userId,
    weekRange,
    habbitIds,
    habbitChecks,
    goalaWeekChecked,
    goalaDayChecks,
}: {
    token: string;
    userId: string;
    weekRange: string;
    habbitIds: number[];
    habbitChecks: { [key: number]: boolean[] };
    goalaWeekChecked: boolean;
    goalaDayChecks: boolean[];
}) {
    const supabase = createSupabaseClientWithToken(token);

    const { error } = await supabase.rpc("save_user_progress", {
        goala_day_checks: JSON.stringify(goalaDayChecks),
        goala_week_checked: goalaWeekChecked,
        habbit_checks: JSON.stringify(habbitChecks),
        habbit_ids: JSON.stringify(habbitIds),
        user_id_arg: uuidv4(), // always a valid uuid
        clerk_user_id_arg: userId, // Clerk user ID string
        week_range_arg: weekRange
    });

    if (error) {
        console.error("Error saving progress:", error);
    } else {
        console.log("Progress saved successfully");
    }
}