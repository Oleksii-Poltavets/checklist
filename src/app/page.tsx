"use client";

import { saveUserProgress } from "@/lib/saveProgress";

import { useState, useCallback } from "react";
import Footer from "../components/footer/Footer";
import GoalA from "../components/main/GoalA";
import Habbits from "../components/main/Habbits";
import Header from "../components/header/Header";
import MainWithoutAuth from "../components/withoutAuth/MainWithoutAuth";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";

export default function ChecklistPage({ children }: { children: React.ReactNode }) {
  const [showSummary, setShowSummary] = useState(false);
  const [habbitIds, setHabbitIds] = useState([0, 1, 2, 3]);
  const [habbitChecks, setHabbitChecks] = useState<{ [key: number]: boolean[] }>(
    () => Object.fromEntries([0, 1, 2, 3].map(id => [id, Array(7).fill(false)]))
  );
  const [goalaWeekChecked, setGoalaWeekChecked] = useState(false);
  const [goalaDayChecks, setGoalaDayChecks] = useState(Array(7).fill(false));

  const { getToken, userId } = useAuth();

  const getCurrentWeekRange = useCallback((): string => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const formatDate = (date: Date) =>
      date.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });

    return `${formatDate(monday)} - ${formatDate(sunday)}`;
  }, []);

  const habbitsScore = (() => {
    const totalChecked = Object.values(habbitChecks).reduce((acc, arr) => acc + arr.filter(Boolean).length, 0);
    const totalBoxes = habbitIds.length * 7;
    return `${totalChecked}/${totalBoxes} (${totalBoxes > 0 ? Math.round((totalChecked / totalBoxes) * 100) : 0}%)`;
  })();

  const habbitsPenalty = habbitIds.reduce((total, id) => {
    const checked = habbitChecks[id]?.filter(Boolean).length || 0;
    const penalty = 7 - checked - 2;
    return total + (penalty < 0 ? 0 : penalty);
  }, 0);

  const goalaWeekPenalty = goalaWeekChecked ? 0 : 1;
  const goalaDayPenalty = Math.max(0, 7 - goalaDayChecks.filter(Boolean).length - 2);
  const goalaPenalty = goalaWeekPenalty + goalaDayPenalty;

  const personOnDuty = "John Doe";

  return (
    <>
      <Header />
      <SignedOut>
        <MainWithoutAuth />
      </SignedOut>
      <SignedIn>
        <main className="flex-1 w-full flex flex-col items-center justify-start p-6 pb-0 bg-white dark:bg-gray-950">
          <h1 className="text-3xl font-bold mb-2">
            On duty: <span className="text-blue-600">{personOnDuty}</span>
          </h1>
          <h2 className="text-xl font-semibold mb-6">
            Week: <span>{getCurrentWeekRange()}</span>
          </h2>
          <div className="w-full flex flex-col lg:flex-row gap-8 items-start justify-center">
            <GoalA
              weekChecked={goalaWeekChecked}
              setWeekChecked={setGoalaWeekChecked}
              dayChecks={goalaDayChecks}
              setDayChecks={setGoalaDayChecks}
            />
            <Habbits
              habbitIds={habbitIds}
              setHabbitIds={setHabbitIds}
              checks={habbitChecks}
              setChecks={setHabbitChecks}
            />
          </div>
          {children}
          <button
            onClick={async () => {
              const token = await getToken({ template: "supabase" });
              console.log(token);
              if (!token || !userId) return;

              await saveUserProgress({
                token,
                userId,
                weekRange: getCurrentWeekRange(),
                habbitIds,
                habbitChecks,
                goalaWeekChecked,
                goalaDayChecks,
              });
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save Progress
          </button>
        </main>
      </SignedIn>
      <Footer
        habbitsScore={habbitsScore}
        habbitsPenalty={habbitsPenalty}
        goalAPenalty={goalaPenalty}
        showSummary={showSummary}
        onShowSummary={() => setShowSummary(true)}
      />
    </>
  );
}