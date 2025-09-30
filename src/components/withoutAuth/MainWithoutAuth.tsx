import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SignInButton, SignUpButton } from '@clerk/nextjs';

export default function MainWithoutAuth() {

    return (
        <main className="flex-1 w-full flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-950 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Turn your goals into habits. One week at a time.
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6">
                Track your progress, stay accountable, and build momentum.
            </p>

            <div className="flex gap-4 mb-8 items-center">
                <SignInButton mode='modal'>
                    <button className="px-6 py-3 bg-white dark:bg-gray-900 text-blue-600 border border-blue-600 rounded-lg shadow hover:bg-blue-50 dark:hover:bg-gray-800 transition cursor-pointer">
                        Login
                    </button>
                </SignInButton>
                <span className="text-gray-500 dark:text-gray-400 font-medium">or</span>
                <SignUpButton mode='modal'>
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition cursor-pointer">
                        Create your free account
                    </button>

                </SignUpButton>
            </div>
        </main>
    );
}