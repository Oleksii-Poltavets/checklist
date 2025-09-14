"use client"

import React from "react";

export default function Footer({
    habbitsScore,
    habbitsPenalty,
    goalAPenalty,
    showSummary,
    onShowSummary,
}: {
    habbitsScore: string;
    habbitsPenalty: number;
    goalAPenalty: number;
    showSummary: boolean;
    onShowSummary: () => void;
}) {
    return (
        <footer className="w-full h-16 bg-gray-100 dark:bg-gray-900 shadow fixed bottom-0 left-0 z-20 md:static md:shadow-none">
            <div className="container mx-auto h-full flex items-center justify-between px-6">
                <div>
                    {!showSummary ? (
                        <button
                            onClick={onShowSummary}
                            className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all duration-300"
                        >
                            Week summary
                        </button>
                    ) : (
                        <div className="flex flex-col gap-1 transition-all duration-300">
                            <span className="text-gray-800 dark:text-gray-100 font-semibold">
                                Habbits score: <span className="text-[#FFFF00]">{habbitsScore}</span>
                            </span>
                            <span className="text-gray-800 dark:text-gray-100 font-semibold">
                                Penalty total:{" "}
                                <span className="text-red-500">
                                    {goalAPenalty + habbitsPenalty}
                                </span>
                            </span>
                        </div>
                    )}
                </div>
                <nav
                    className={`flex gap-4 transition-all duration-300 ${showSummary
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 translate-y-2 pointer-events-none"
                        }`}
                >
                    <button className="px-4 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-all duration-300">
                        Send the result
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-all duration-300">
                        Pay penalty
                    </button>
                </nav>
            </div>
        </footer>
    );
}