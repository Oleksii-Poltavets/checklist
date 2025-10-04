import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SignInButton, SignUpButton } from '@clerk/nextjs';

export default function MainWithoutAuth() {

    return (
        <main className="flex-1 w-full flex flex-col items-center justify-center p-6 bg-slate-900 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4">
                Turn your goals into habits. One week at a time.
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-6">
                Track your progress, stay accountable, and build momentum.
            </p>

            <div className="flex gap-4 mb-8 items-center">
                <SignInButton mode='modal'>
                    <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500 rounded-lg shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-200 cursor-pointer transform hover:scale-105">
                        Login
                    </button>
                </SignInButton>
                <span className="text-slate-400 font-medium">or</span>
                <SignUpButton mode='modal'>
                    <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-200 cursor-pointer transform hover:scale-105">
                        Create your free account
                    </button>

                </SignUpButton>
            </div>
        </main>
    );
}