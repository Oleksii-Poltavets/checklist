"use client"

import { SignedIn, SignedOut } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";

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
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date();
            const nextSunday = new Date();

            // Set to next Sunday at 00:00
            const dayOfWeek = now.getDay();
            const daysUntilSunday = (7 - dayOfWeek) % 7 || 7;
            nextSunday.setDate(now.getDate() + daysUntilSunday);
            nextSunday.setHours(0, 0, 0, 0);

            const diff = nextSunday.getTime() - now.getTime();
            const totalSeconds = Math.floor(diff / 1000);

            const days = Math.floor(totalSeconds / (3600 * 24));
            const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;

            const formatted =
                days > 0
                    ? `${days}d ${hours}h ${minutes}m ${seconds}s`
                    : `${hours}h ${minutes}m ${seconds}s`;

            setTimeLeft(formatted);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, []);
    return (
        <footer className="w-full h-16 bg-gray-100 dark:bg-gray-900 shadow fixed bottom-0 left-0 z-20 md:static md:shadow-none">
            <SignedIn>
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
            </SignedIn>
            <SignedOut>
                <div className="container mx-auto h-full flex items-center justify-center px-6">
                    <div className="text-xl md:text-2xl font-semibold text-blue-600 dark:text-blue-400">
                        ⏳ Next week starts in: <span className="ml-2">{timeLeft}</span>
                    </div>
                </div>
            </SignedOut>
        </footer>
    );
}