"use client";

import { saveUserProgress } from "@/lib/saveProgress";
import { useState, useCallback, useEffect } from "react";
import Footer from "../components/footer/Footer";
import GoalA from "../components/main/GoalA";
import Habbits from "../components/main/Habbits";
import Header from "../components/header/Header";
import MainWithoutAuth from "../components/withoutAuth/MainWithoutAuth";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { fetchUserProgress } from "@/lib/fetchUserProgress";

export default function ChecklistPage({ children }: { children: React.ReactNode }) {
  const [showSummary, setShowSummary] = useState(false);
  const [habbitIds, setHabbitIds] = useState<number[]>([0, 1, 2, 3]);
  const [habbitNames, setHabbitNames] = useState<string[]>(["", "", "", ""]);
  const [habbitChecks, setHabbitChecks] = useState<{ [key: number]: boolean[] }>(
    () => Object.fromEntries([0, 1, 2, 3].map(id => [id, Array(7).fill(false)]))
  );
  const [goalaWeekChecked, setGoalaWeekChecked] = useState(false);
  const [goalaDayChecks, setGoalaDayChecks] = useState(Array(7).fill(false));
  const [weekGoalText, setWeekGoalText] = useState("");
  const [dayGoalTexts, setDayGoalTexts] = useState(Array(7).fill(""));

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

  useEffect(() => {
    async function loadProgress() {
      const token = await getToken({ template: "supabase" });
      if (!token || !userId) return;
      let progress = await fetchUserProgress(token, userId, getCurrentWeekRange());

      if (Array.isArray(progress)) progress = progress[0];

      if (progress) {
        // Dynamic habbit count
        const ids = Array.isArray(progress.habbit_ids) ? progress.habbit_ids : [0, 1, 2, 3];
        setHabbitIds(ids);

        setHabbitNames(
          Array.isArray(progress.habbit_names)
            ? [...progress.habbit_names, ...Array(ids.length - progress.habbit_names.length).fill("")]
              .slice(0, ids.length)
            : Array(ids.length).fill("")
        );

        setHabbitChecks(() => {
          const checks: { [key: number]: boolean[] } = {};
          ids.forEach((id: number, idx: number) => {
            const arr = progress.habbit_checks && Array.isArray(progress.habbit_checks[id])
              ? [...progress.habbit_checks[id], ...Array(7 - progress.habbit_checks[id].length).fill(false)].slice(0, 7)
              : Array(7).fill(false);
            checks[id] = arr;
          });
          return checks;
        });

        setGoalaWeekChecked(progress.goala_week_checked ?? false);
        setGoalaDayChecks(
          Array.isArray(progress.goala_day_checks)
            ? [...progress.goala_day_checks, ...Array(7 - progress.goala_day_checks.length).fill(false)].slice(0, 7)
            : Array(7).fill(false)
        );
        setWeekGoalText(progress.week_goal_text ?? "");
        setDayGoalTexts(
          Array.isArray(progress.day_goal_texts)
            ? [...progress.day_goal_texts, ...Array(7 - progress.day_goal_texts.length).fill("")].slice(0, 7)
            : Array(7).fill("")
        );
      }
    }
    loadProgress();
  }, [userId, getCurrentWeekRange()]);

  // Score and penalty calculations
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
              weekGoalText={weekGoalText}
              setWeekGoalText={setWeekGoalText}
              dayGoalTexts={dayGoalTexts}
              setDayGoalTexts={setDayGoalTexts}
            />
            <Habbits
              habbitIds={habbitIds}
              setHabbitIds={setHabbitIds}
              habbitNames={habbitNames}
              setHabbitNames={setHabbitNames}
              checks={habbitChecks}
              setChecks={setHabbitChecks}
            />
          </div>
          {children}
          <button
            onClick={async () => {
              const token = await getToken({ template: "supabase" });
              if (!token || !userId) return;
              await saveUserProgress({
                token,
                userId,
                weekRange: getCurrentWeekRange(),
                habbitIds,
                habbitChecks,
                habbitNames,
                goalaWeekChecked,
                goalaDayChecks,
                weekGoalText,
                dayGoalTexts,
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