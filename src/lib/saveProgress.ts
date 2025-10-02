import { v4 as uuidv4 } from "uuid";
import { createSupabaseClientWithToken } from "./supabaseClient";

export async function saveUserProgress({
    token,
    userId,
    weekRange,
    habbitIds,
    habbitChecks,
    habbitNames, // <-- add this
    goalaWeekChecked,
    goalaDayChecks,
    weekGoalText,
    dayGoalTexts,
}: {
    token: string;
    userId: string;
    weekRange: string;
    habbitIds: number[];
    habbitChecks: { [key: number]: boolean[] };
    habbitNames: string[]; // <-- add this
    goalaWeekChecked: boolean;
    goalaDayChecks: boolean[];
    weekGoalText: string;
    dayGoalTexts: string[];
}) {
    const supabase = createSupabaseClientWithToken(token);

    const safeGoalaDayChecks = Array.isArray(goalaDayChecks)
        ? [...goalaDayChecks, ...Array(7 - goalaDayChecks.length).fill(false)].slice(0, 7)
        : Array(7).fill(false);

    const safeDayGoalTexts = Array.isArray(dayGoalTexts)
        ? [...dayGoalTexts, ...Array(7 - dayGoalTexts.length).fill("")].slice(0, 7)
        : Array(7).fill("");

    const { error } = await supabase.rpc("save_user_progress_clerk", {
        clerk_user_id_arg: userId,
        week_range_arg: weekRange,
        goala_day_checks: safeGoalaDayChecks,
        goala_week_checked: goalaWeekChecked,
        habbit_checks: habbitChecks,
        habbit_ids: habbitIds,
        habbit_names: habbitNames,
        week_goal_text_arg: weekGoalText,
        day_goal_texts_arg: safeDayGoalTexts
    });

    if (error) {
        console.error("Error saving progress:", error);
    } else {
        console.log("Progress saved successfully");
    }
}