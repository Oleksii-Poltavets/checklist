export interface BuildTelegramMessageParams {
    weekGoalText: string;
    dayGoalTexts: string[];
    goalaDayChecks: boolean[];
    habbitNames: string[];
    habbitChecks: { [key: number]: boolean[] };
}

export function buildTelegramMessage({
    weekGoalText,
    dayGoalTexts,
    goalaDayChecks,
    habbitNames,
    habbitChecks,
}: BuildTelegramMessageParams) {
    // Days of week
    const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

    // Ціль тижня
    let msg = `Ціль тижня: ${weekGoalText}\nЦіль а:\n`;

    // Day goals
    for (let i = 0; i < 7; i++) {
        const checked = goalaDayChecks[i] ? "+" : "-";
        msg += `${days[i]}: ${dayGoalTexts[i] || ""} ${checked}\n`;
    }

    msg += `\nЧек-лист:\n`;

    // Habits
    habbitNames.forEach((name, idx) => {
        if (!name) return;
        const checks = habbitChecks[idx] || [];
        const marks = checks.map(c => (c ? "+" : "-")).join(" ");
        msg += `${idx + 1})${name}: ${marks}\n`;
    });

    return msg;
}