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
        goala_day_checks: goalaDayChecks,
        goala_week_checked: goalaWeekChecked,
        habbit_checks: habbitChecks,
        habbit_ids: habbitIds,
        user_id: userId,
        week_range: weekRange
    });

    if (error) {
        console.error("Error saving progress:", error);
    } else {
        console.log("Progress saved successfully");
    }
}