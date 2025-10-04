import React from "react";

interface CustomModalProps {
    open: boolean;
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmColor?: string; // e.g. "bg-blue-500"
}

export default function CustomModal({
    open,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    confirmColor = "bg-blue-500",
}: CustomModalProps) {
    if (!open) return null;
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 z-10">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 flex flex-col items-center max-w-xs w-full border border-gray-200 dark:border-gray-700">
                <span className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">{title}</span>
                {description && (
                    <span className="mb-4 text-gray-600 dark:text-gray-300 text-center">{description}</span>
                )}
                <div className="flex gap-4">
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 ${confirmColor} text-white rounded hover:brightness-90 transition`}
                    >
                        {confirmText}
                    </button>
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
}