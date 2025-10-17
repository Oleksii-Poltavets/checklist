'use client'
import React, { useEffect } from "react";

interface GoalAProps {
    weekChecked: boolean;
    setWeekChecked: React.Dispatch<React.SetStateAction<boolean>>;
    dayChecks: boolean[];
    setDayChecks: React.Dispatch<React.SetStateAction<boolean[]>>;
    weekGoalText: string;
    setWeekGoalText: React.Dispatch<React.SetStateAction<string>>;
    dayGoalTexts: string[];
    setDayGoalTexts: React.Dispatch<React.SetStateAction<string[]>>;
}

const days = [
    { abbr: "Mon", full: "Monday" },
    { abbr: "Tue", full: "Tuesday" },
    { abbr: "Wed", full: "Wednesday" },
    { abbr: "Thu", full: "Thursday" },
    { abbr: "Fri", full: "Friday" },
    { abbr: "Sat", full: "Saturday" },
    { abbr: "Sun", full: "Sunday" },
];

export default function GoalA({
    weekChecked,
    setWeekChecked,
    dayChecks,
    setDayChecks,
    weekGoalText,
    setWeekGoalText,
    dayGoalTexts,
    setDayGoalTexts,
}: GoalAProps) {

    useEffect(() => {
        // Debug: log props whenever they change
        console.log("GoalA props:", {
            weekChecked,
            dayChecks,
            weekGoalText,
            dayGoalTexts
        });
    }, [weekChecked, dayChecks, weekGoalText, dayGoalTexts]);

    const handleCheck = (idx: number) => {
        setDayChecks(prev => prev.map((val, i) => i === idx ? !val : val));
    };

    const weekPenalty = weekChecked ? 0 : 1;
    const dayPenalty = Math.max(0, 7 - dayChecks.filter(Boolean).length - 2);
    const totalPenalty = weekPenalty + dayPenalty;

    return (
        <section className="w-full max-w-xl mb-4 sm:mb-6 lg:mb-8 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow p-2 sm:p-3 lg:p-6">
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-1.5 sm:mb-2 lg:mb-4">Goal of the week:</h3>
            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 bg-gray-50 dark:bg-gray-900 rounded px-1.5 sm:px-2 lg:px-3 py-1 sm:py-1.5 lg:py-2 mb-3 sm:mb-4 lg:mb-6">
                <input
                    type="text"
                    placeholder="Goal for the week"
                    value={weekGoalText}
                    onChange={e => setWeekGoalText(e.target.value)}
                    className="flex-1 px-1 sm:px-1.5 lg:px-2 py-0.5 sm:py-1 rounded border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-xs sm:text-sm lg:text-base"
                />
                <label className="flex items-center gap-1 sm:gap-1 lg:gap-2">
                    <input
                        type="checkbox"
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 accent-blue-500"
                        checked={weekChecked}
                        onChange={e => setWeekChecked(e.target.checked)}
                    />
                </label>
            </div>

            <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-1.5 sm:mb-2 lg:mb-4">Goal A of the day:</h3>
            <div className="flex flex-col gap-1 sm:gap-1.5 lg:gap-2">
                {days.map((day, idx) => (
                    <div
                        key={day.abbr}
                        className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 bg-gray-50 dark:bg-gray-900 rounded px-1.5 sm:px-2 lg:px-3 py-1 sm:py-1.5 lg:py-2"
                    >
                        <span className="w-6 sm:w-8 lg:w-10 font-medium text-gray-700 dark:text-gray-200 text-xs sm:text-sm lg:text-base">{day.abbr}:</span>
                        <input
                            type="text"
                            placeholder={`Goal for ${day.full}`}
                            value={dayGoalTexts[idx]}
                            onChange={e => setDayGoalTexts(prev => prev.map((v, i) => i === idx ? e.target.value : v))}
                            className="flex-1 px-1 sm:px-1.5 lg:px-2 py-0.5 sm:py-1 rounded dark:border-gray-900 text-gray-900 dark:text-gray-100 text-xs sm:text-sm lg:text-base"
                        />
                        <input
                            type="checkbox"
                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 accent-blue-500"
                            checked={dayChecks[idx]}
                            onChange={e => setDayChecks(prev => prev.map((v, i) => i === idx ? e.target.checked : v))}
                        />
                    </div>
                ))}
            </div>

            <div className="mt-3 sm:mt-4 lg:mt-6 flex items-center justify-center">
                <span className="px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-lg bg-gray-100 dark:bg-gray-900 text-sm sm:text-base lg:text-lg font-semibold text-gray-800 dark:text-gray-100 shadow">
                    <span className="hidden sm:inline">Total </span>penalty:{" "}
                    <span className="text-red-500 font-bold">
                        {totalPenalty}
                    </span>
                </span>
            </div>
        </section>
    );
}