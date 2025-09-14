'use client'
import React from "react";

interface GoalAProps {
    weekChecked: boolean;
    setWeekChecked: React.Dispatch<React.SetStateAction<boolean>>;
    dayChecks: boolean[];
    setDayChecks: React.Dispatch<React.SetStateAction<boolean[]>>;
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
}: GoalAProps) {

    const handleCheck = (idx: number) => {
        setDayChecks(prev => prev.map((val, i) => i === idx ? !val : val));
    };

    const weekPenalty = weekChecked ? 0 : 1;
    const dayPenalty = Math.max(0, 7 - dayChecks.filter(Boolean).length - 2);
    const totalPenalty = weekPenalty + dayPenalty;

    return (
        <section className="w-full max-w-xl mb-8 bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Goal of the week:</h3>
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 rounded px-3 py-2 mb-6">
                <input
                    type="text"
                    placeholder="Goal for the week"
                    className="flex-1 px-2 py-1 rounded border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                />
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        className="w-5 h-5 accent-blue-500"
                        checked={weekChecked}
                        onChange={() => setWeekChecked(v => !v)}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-200">Done</span>
                </label>
            </div>

            <h3 className="text-lg font-semibold mb-4">Goal A of the day:</h3>
            <div className="flex flex-col gap-2">
                {days.map((day, idx) => (
                    <div
                        key={day.abbr}
                        className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 rounded px-3 py-2"
                    >
                        <span className="w-10 font-medium text-gray-700 dark:text-gray-200">{day.abbr}:</span>
                        <input
                            type="text"
                            placeholder={`Goal for ${day.full}`}
                            className="flex-1 px-2 py-1 rounded dark:border-gray-900 text-gray-900 dark:text-gray-100"
                        />
                        <input
                            type="checkbox"
                            className="w-5 h-5 accent-blue-500"
                            checked={dayChecks[idx]}
                            onChange={() => handleCheck(idx)}
                        />
                    </div>
                ))}
            </div>

            <div className="mt-6 flex items-center justify-center">
                <span className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-900 text-lg font-semibold text-gray-800 dark:text-gray-100 shadow">
                    Total penalty:{" "}
                    <span className="text-red-500 font-bold">
                        {totalPenalty}
                    </span>
                </span>
            </div>
        </section>
    );
}