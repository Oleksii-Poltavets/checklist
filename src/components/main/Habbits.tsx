"use client"

import React, { useEffect, useState } from "react";

interface HabbitsProps {
    habbitIds: number[];
    setHabbitIds: React.Dispatch<React.SetStateAction<number[]>>;
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
    checks,
    setChecks,
}: HabbitsProps) {

    const [modalOpen, setModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [editMode, setEditMode] = useState(false);

    // Update checks when habbitIds changes (add new habbit)
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
    }, [habbitIds, setChecks]);

    const handleCheck = (habbitId: number, dayIdx: number) => {
        setChecks(prev => ({
            ...prev,
            [habbitId]: prev[habbitId].map((val, idx) => idx === dayIdx ? !val : val)
        }));
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
        <section className="relative w-full max-w-xl mb-8 bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            {/* Edit icon in the top right corner */}
            <button
                type="button"
                onClick={() => setEditMode((v) => !v)}
                className={`absolute top-4 right-4 p-2 rounded-full shadow-sm transition border border-blue-200 ${editMode ? "ring-2 ring-blue-400" : ""} cursor-pointer`}
                aria-label="Edit habbits"
            >
                {/* Twitter-style pencil icon */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="white"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 3.487l3.651 3.65-11.5 11.5-4.35.7.7-4.35 11.499-11.5zM19.5 6.15l-1.65-1.65"
                    />
                </svg>
            </button>
            <h3 className="text-lg font-semibold mb-4">Habbits:</h3>
            {habbitIds.map((id, idx) => (
                <div
                    key={id}
                    className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 bg-gray-50 dark:bg-gray-900 rounded px-3 py-2 mb-3 border border-gray-200 dark:border-gray-700"
                >
                    <input
                        type="text"
                        placeholder={`Habbit ${idx + 1}`}
                        className="flex-1 px-2 py-1 rounded border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    />
                    <div className="flex gap-2 md:gap-1 w-full md:w-auto justify-between">
                        {days.map((day, dayIdx) => (
                            <label key={day.abbr} className="flex flex-col items-center">
                                <span className="text-[10px] text-gray-500 mb-1">{day.abbr}</span>
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 accent-blue-500"
                                    checked={checks[id]?.[dayIdx] || false}
                                    onChange={() => handleCheck(id, dayIdx)}
                                />
                            </label>
                        ))}
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                        score <span className="inline-block text-[#FFFF00]">{checks[id]?.filter(Boolean).length || 0}</span>/7
                    </span>
                    {editMode && (
                        <button
                            type="button"
                            onClick={() => handleDelete(id)}
                            className="ml-2 text-gray-400 hover:text-red-500 transition cursor-pointer"
                            aria-label="Delete habbit"
                        >
                            {/* Trash can icon */}
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M22 5a1 1 0 0 1-1 1H3a1 1 0 0 1 0-2h5V3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1h5a1 1 0 0 1 1 1zM4.934 21.071 4 8h16l-.934 13.071a1 1 0 0 1-1 .929H5.931a1 1 0 0 1-.997-.929zM15 18a1 1 0 0 0 2 0v-6a1 1 0 0 0-2 0zm-4 0a1 1 0 0 0 2 0v-6a1 1 0 0 0-2 0zm-4 0a1 1 0 0 0 2 0v-6a1 1 0 0 0-2 0z" />
                            </svg>
                        </button>
                    )}
                </div>
            ))}
            <div className="mt-6 flex items-center justify-center">
                <span className="mr-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-900 text-lg font-semibold text-gray-800 dark:text-gray-100 shadow flex items-center gap-2">
                    Total score:{" "}
                    <span className="text-[#FFFF00] font-bold">
                        {
                            (() => {
                                const totalChecked = Object.values(checks).reduce((acc, arr) => acc + arr.filter(Boolean).length, 0);
                                const totalBoxes = habbitIds.length * days.length;
                                return `${totalChecked}/${totalBoxes}`;
                            })()
                        }
                    </span>
                    <span className="text-blue-500 font-bold text-base ml-2">
                        {
                            (() => {
                                const totalChecked = Object.values(checks).reduce((acc, arr) => acc + arr.filter(Boolean).length, 0);
                                const totalBoxes = habbitIds.length * days.length;
                                return totalBoxes > 0 ? `(${Math.round((totalChecked / totalBoxes) * 100)}%)` : "(0%)";
                            })()
                        }
                    </span>
                </span>
                {/* <span className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-900 text-lg font-semibold text-gray-800 dark:text-gray-100 shadow">
                    Penalty:{" "}
                    <span className="text-red-500 font-bold">
                        {
                            (() => {
                                return habbitIds.reduce((total, id) => {
                                    const checked = checks[id]?.filter(Boolean).length || 0;
                                    const penalty = 7 - checked - 2;
                                    return total + (penalty < 0 ? 0 : penalty);
                                }, 0);
                            })()
                        }
                    </span>
                </span> */}
            </div>
            {editMode && (
                <button
                    type="button"
                    onClick={addHabbit}
                    className="flex items-center justify-center w-8 h-8 mt-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 text-2xl font-bold mx-auto transition cursor-pointer"
                    aria-label="Add habbit"
                >
                    +
                </button>
            )}

            {/* Modal */}
            {modalOpen && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 z-10">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 flex flex-col items-center max-w-xs w-full border border-gray-200 dark:border-gray-700">
                        <span className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Delete this habbit?</span>
                        <div className="flex gap-4">
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                            >
                                Yes, delete
                            </button>
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
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