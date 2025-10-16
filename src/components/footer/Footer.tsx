"use client"

import { buildTelegramMessage } from "@/lib/buildTelegramMessage";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function Footer({
    habbitsScore,
    habbitsPenalty,
    goalAPenalty,
    showSummary,
    onShowSummary,
    weekGoalText,
    dayGoalTexts,
    goalaDayChecks,
    habbitNames,
    habbitChecks,
}: {
    habbitsScore: string;
    habbitsPenalty: number;
    goalAPenalty: number;
    showSummary: boolean;
    onShowSummary: () => void;
    weekGoalText: string;
    dayGoalTexts: string[];
    goalaDayChecks: boolean[];
    habbitNames: string[];
    habbitChecks: { [key: number]: boolean[] };
}) {
    const [timeLeft, setTimeLeft] = useState('');
    const { user } = useUser();

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date();
            const nextMonday = new Date();

            // Set to next Monday at 00:00
            const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
            const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek) % 7;
            nextMonday.setDate(now.getDate() + daysUntilMonday);
            nextMonday.setHours(0, 0, 0, 0);

            const diff = nextMonday.getTime() - now.getTime();
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
        <footer className="w-full h-16 bg-slate-800 border-t border-slate-700 shadow-lg fixed bottom-0 left-0 z-20 md:static md:shadow-none">
            <SignedIn>
                <div className="container mx-auto h-full flex items-center justify-between px-6">
                    <div>
                        {!showSummary ? (
                            <button
                                onClick={onShowSummary}
                                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25"
                            >
                                Week summary
                            </button>
                        ) : (
                            <div className="flex flex-col gap-1 transition-all duration-300">
                                <span className="text-slate-100 font-semibold">
                                    Habbits score: <span className="text-emerald-400">{habbitsScore}</span>
                                </span>
                                <span className="text-slate-100 font-semibold">
                                    Penalty total:{" "}
                                    <span className="text-red-400">
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
                        <button
                            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25"
                            onClick={async () => {
                                try {
                                    const userName = user?.fullName || user?.username || user?.id || "Unknown User";
                                    const message =
                                        `Звіт від: ${userName}\n` +
                                        buildTelegramMessage({
                                            weekGoalText,
                                            dayGoalTexts,
                                            goalaDayChecks,
                                            habbitNames,
                                            habbitChecks,
                                        });
                                    const response = await fetch("/api/sendTelegram", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ message }),
                                    });

                                    if (response.ok) {
                                        alert("✅ Message sent to Telegram successfully!");
                                    } else {
                                        alert("❌ Failed to send message to Telegram");
                                    }
                                } catch (error) {
                                    console.error("Error sending to Telegram:", error);
                                    alert("❌ Error sending message to Telegram");
                                }
                            }}
                        >
                            Send the result
                        </button>
                        <button className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-red-500/25">
                            Pay penalty
                        </button>
                    </nav>

                </div>
            </SignedIn>
            <SignedOut>
                <div className="container mx-auto h-full flex items-center justify-center px-6">
                    <div className="text-xl md:text-2xl font-semibold text-emerald-400">
                        ⏳ Next week starts in: <span className="ml-2 text-slate-100">{timeLeft}</span>
                    </div>
                </div>
            </SignedOut>
        </footer>
    );
}