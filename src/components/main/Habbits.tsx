"use client"

import React, { useEffect, useState } from "react";

interface HabbitsProps {
    habbitIds: number[];
    setHabbitIds: React.Dispatch<React.SetStateAction<number[]>>;
    habbitNames: string[];
    setHabbitNames: React.Dispatch<React.SetStateAction<string[]>>;
    checks: { [key: number]: boolean[] };
    setChecks: React.Dispatch<React.SetStateAction<{ [key: number]: boolean[] }>>;
}

const days = [
    { abbr: "Mon" },
    { abbr: "Tue" },
    { abbr: "Wed" },
    { abbr: "Thu" },
    { abbr: "Fri" },
    { abbr: "Sat" },
    { abbr: "Sun" },
];

export default function Habbits({
    habbitIds,
    setHabbitIds,
    habbitNames,
    setHabbitNames,
    checks,
    setChecks,
}: HabbitsProps) {

    const [modalOpen, setModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [editMode, setEditMode] = useState(false);

    // Update checks and names when habbitIds changes (add/remove habbit)
    useEffect(() => {
        setChecks(prev => {
            const next = { ...prev };
            habbitIds.forEach(id => {
                if (!next[id]) next[id] = Array(7).fill(false);
            });
            Object.keys(next).forEach(id => {
                if (!habbitIds.includes(Number(id))) delete next[Number(id)];
            });
            return next;
        });

        setHabbitNames(prev => {
            if (habbitIds.length > prev.length) {
                // Add empty names for new habbits
                return [...prev, ...Array(habbitIds.length - prev.length).fill("")];
            } else if (habbitIds.length < prev.length) {
                // Remove names for deleted habbits
                return prev.slice(0, habbitIds.length);
            }
            return prev;
        });
    }, [habbitIds, setChecks, setHabbitNames]);

    const handleCheck = (habbitId: number, dayIdx: number) => {
        setChecks(prev => ({
            ...prev,
            [habbitId]: prev[habbitId].map((val, idx) => idx === dayIdx ? !val : val)
        }));
    };

    const handleNameChange = (idx: number, value: string) => {
        setHabbitNames(prev => prev.map((v, i) => i === idx ? value : v));
    };

    const addHabbit = () => {
        setHabbitIds(prev => [...prev, prev.length ? prev[prev.length - 1] + 1 : 0]);
    };

    const removeHabbit = (id: number) => {
        setHabbitIds(prev => prev.filter(hid => hid !== id));
    };

    const handleDelete = (id: number) => {
        setDeleteId(id);
        setModalOpen(true);
    };

    const confirmDelete = () => {
        if (deleteId !== null) {
            removeHabbit(deleteId);
        }
        setModalOpen(false);
        setDeleteId(null);
    };

    const cancelDelete = () => {
        setModalOpen(false);
        setDeleteId(null);
    };

    return (
        <section className="relative w-full max-w-xl mb-8 bg-slate-800 border border-slate-700 rounded-xl shadow-lg p-4 sm:p-6">
            {/* Edit icon in the top right corner */}
            <button
                type="button"
                onClick={() => setEditMode((v) => !v)}
                className={`absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full shadow-sm transition border border-slate-600 hover:border-emerald-500 bg-slate-700 hover:bg-slate-600 ${editMode ? "ring-2 ring-emerald-400 border-emerald-400" : ""} cursor-pointer`}
                aria-label="Edit habbits"
            >
                {/* Twitter-style pencil icon */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 3.487l3.651 3.65-11.5 11.5-4.35.7.7-4.35 11.499-11.5zM19.5 6.15l-1.65-1.65"
                    />
                </svg>
            </button>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-slate-100 pr-12">Habbits:</h3>
            {habbitIds.map((id, idx) => (
                <div
                    key={id}
                    className="flex flex-col gap-2 sm:gap-3 bg-slate-900 border border-slate-600 rounded-lg p-3 sm:p-4 mb-3"
                >
                    {/* Habit name input */}
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder={`Habbit ${idx + 1}`}
                            value={habbitNames[idx] || ""}
                            onChange={e => handleNameChange(idx, e.target.value)}
                            className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md border border-slate-600 bg-slate-800 text-slate-100 placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            disabled={!editMode}
                        />
                        {editMode && (
                            <button
                                type="button"
                                onClick={() => handleDelete(id)}
                                className="p-1.5 text-slate-400 hover:text-red-400 transition cursor-pointer"
                                aria-label="Delete habbit"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}
                    </div>
                    
                    {/* Days checkboxes and score */}
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex gap-1.5 sm:gap-2 flex-1 justify-between max-w-[280px]">
                            {days.map((day, dayIdx) => (
                                <label key={day.abbr} className="flex flex-col items-center cursor-pointer">
                                    <span className="text-[10px] sm:text-xs text-slate-400 mb-1 font-medium">{day.abbr}</span>
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 sm:w-5 sm:h-5 accent-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                                        checked={checks[id]?.[dayIdx] || false}
                                        onChange={() => handleCheck(id, dayIdx)}
                                    />
                                </label>
                            ))}
                        </div>
                        <div className="flex items-center text-xs sm:text-sm font-medium text-slate-300 ml-2">
                            <span className="text-emerald-400 font-bold text-sm sm:text-base">
                                {checks[id]?.filter(Boolean).length || 0}
                            </span>
                            <span className="text-slate-400 mx-1">/</span>
                            <span className="text-slate-400">7</span>
                        </div>
                    </div>
                </div>
            ))}
            <div className="mt-4 sm:mt-6 flex items-center justify-center">
                <div className="px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-slate-900 border border-slate-600 shadow-lg">
                    <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
                        <span className="text-sm sm:text-base font-medium text-slate-300">Total score:</span>
                        <div className="flex items-center gap-2">
                            <span className="text-emerald-400 font-bold text-lg sm:text-xl">
                                {
                                    (() => {
                                        const totalChecked = Object.values(checks).reduce((acc, arr) => acc + arr.filter(Boolean).length, 0);
                                        const totalBoxes = habbitIds.length * days.length;
                                        return `${totalChecked}/${totalBoxes}`;
                                    })()
                                }
                            </span>
                            <span className="text-emerald-500 font-bold text-sm sm:text-base">
                                {
                                    (() => {
                                        const totalChecked = Object.values(checks).reduce((acc, arr) => acc + arr.filter(Boolean).length, 0);
                                        const totalBoxes = habbitIds.length * days.length;
                                        return totalBoxes > 0 ? `(${Math.round((totalChecked / totalBoxes) * 100)}%)` : "(0%)";
                                    })()
                                }
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {editMode && (
                <button
                    type="button"
                    onClick={addHabbit}
                    className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mt-3 sm:mt-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xl sm:text-2xl font-bold mx-auto transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                    aria-label="Add habbit"
                >
                    +
                </button>
            )}

            {/* Modal */}
            {modalOpen && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 z-10 p-4">
                    <div className="bg-slate-800 border border-slate-600 rounded-xl shadow-2xl p-4 sm:p-6 flex flex-col items-center max-w-sm w-full">
                        <span className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-slate-100 text-center">Delete this habbit?</span>
                        <div className="flex gap-3 sm:gap-4 w-full">
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium text-sm sm:text-base"
                            >
                                Yes, delete
                            </button>
                            <button
                                onClick={cancelDelete}
                                className="flex-1 px-3 sm:px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 border border-slate-600 rounded-lg transition-colors font-medium text-sm sm:text-base"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}