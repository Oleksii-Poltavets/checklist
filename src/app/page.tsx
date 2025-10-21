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
import CustomModal from "@/components/modal/modal";
import { useUser } from "@clerk/nextjs";
import LoadingScreen from "@/components/ui/LoadingScreen";
import Spinner from "@/components/ui/Spinner";

export default function ChecklistPage() {
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
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useUser();

  const { getToken, userId, isLoaded } = useAuth();

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

  // useEffect(() => {
  //   const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  //     // Only show popup if user is logged in (has userId)
  //     if (userId) {
  //       e.preventDefault();
  //       e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
  //     }
  //   };
  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  // }, [userId]);

  useEffect(() => {
    async function loadProgress() {
      if (!isLoaded || !userId) return;
      
      setIsLoading(true);
      try {
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
      } catch (error) {
        console.error("Error loading progress:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProgress();
  }, [userId, isLoaded, getCurrentWeekRange]);

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

  //reset week and reset checkboxes modal state
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [newWeekModalOpen, setNewWeekModalOpen] = useState(false);

  // Show loading screen if auth is not loaded or content is loading
  if (!isLoaded || isLoading) {
    return <LoadingScreen message={!isLoaded ? "Authenticating..." : "Loading your progress..."} />;
  }

  return (
    <>
      <Header />
      <SignedOut>
        <MainWithoutAuth />
      </SignedOut>
      <SignedIn>
        <main className="flex-1 w-full flex flex-col items-center justify-start p-3 sm:p-4 lg:p-6 pb-0 bg-slate-900 text-slate-100">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 text-center">
            On duty: <span className="text-emerald-400">{personOnDuty}</span>
          </h1>
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-4 sm:mb-5 lg:mb-6 text-slate-300 text-center">
            Week: <span className="text-slate-100">{getCurrentWeekRange()}</span>
          </h2>
          <div className="w-full flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-center">
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
          <div className="grid grid-cols-2 sm:flex sm:justify-center gap-2 sm:gap-3 mt-6 mb-4 w-full max-w-2xl">
            <button
              onClick={async () => {
                if (isSaving) return;
                setIsSaving(true);
                try {
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
                } catch (error) {
                  console.error("Error saving progress:", error);
                } finally {
                  setIsSaving(false);
                }
              }}
              disabled={isSaving}
              className="px-3 py-2 sm:px-6 sm:py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-emerald-500 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-200 cursor-pointer transform hover:scale-105 active:scale-95 disabled:transform-none shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 text-sm sm:text-base whitespace-nowrap flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <Spinner size="sm" color="white" />
                  <span>Saving...</span>
                </>
              ) : (
                "Save Progress"
              )}
            </button>
            <button
              onClick={async () => {
                try {
                  const userName = user?.fullName || user?.username || user?.id || "Unknown User";
                  const todayIdx = new Date().getDay();
                  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];
                  const weekDayIdx = (todayIdx + 6) % 7;

                  let msg = `Звіт від: ${userName}\n`;
                  msg += `Ціль тижня: ${weekGoalText}\nЦіль а:\n`;

                  for (let i = 0; i < 7; i++) {
                    let mark = "";
                    if (i < weekDayIdx) mark = goalaDayChecks[i] ? "+" : "-";
                    if (i === weekDayIdx) mark = goalaDayChecks[i] ? "+" : "-";
                    if (i > weekDayIdx) mark = "";
                    msg += `${days[i]}: ${dayGoalTexts[i] || ""} ${mark}\n`;
                  }

                  msg += `\nЧек-лист:\n`;

                  habbitNames.forEach((name, idx) => {
                    if (!name) return;
                    const checks = habbitChecks[idx] || [];
                    const marks = checks.map((c, i) => {
                      if (i < weekDayIdx) return c ? "+" : "-";
                      if (i === weekDayIdx) return c ? "+" : "-";
                      return "";
                    }).join(" ");
                    msg += `${idx + 1})${name}: ${marks}\n`;
                  });

                  const response = await fetch("/api/sendTelegram", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: msg }),
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
              className="px-3 py-2 sm:px-6 sm:py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
              title="Send to Telegram"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.5 2.5L2 10.5c-.7.3-.7 1.3 0 1.6l4.7 1.5 2.1 6.3c.2.6.9.8 1.4.4l3.1-2.7 4.7 3.4c.6.4 1.4.1 1.6-.6l3.2-16.2c.2-.7-.5-1.3-1.2-1.1z" />
              </svg>
              <span className="hidden xs:inline sm:inline">Send</span>
            </button>
            <button
              onClick={() => setNewWeekModalOpen(true)}
              className="px-3 py-2 sm:px-6 sm:py-2.5 bg-slate-600 hover:bg-slate-700 active:bg-slate-800 text-white font-semibold rounded-lg transition-all duration-200 cursor-pointer transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl hover:shadow-slate-500/25 text-sm sm:text-base whitespace-nowrap"
            >
              New Week
            </button>
            <button
              onClick={() => setResetModalOpen(true)}
              className="px-3 py-2 sm:px-6 sm:py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold rounded-lg transition-all duration-200 cursor-pointer transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl hover:shadow-red-500/25 text-sm sm:text-base whitespace-nowrap"
            >
              Reset
            </button>
          </div>
          <CustomModal
            open={newWeekModalOpen}
            title="Start New Week?"
            description="This will clear all checkboxes for the week, but keep your habit names and goals. Continue?"
            confirmText="Yes, clear progress"
            cancelText="Cancel"
            onConfirm={async () => {
              setNewWeekModalOpen(false);
              // Reset only checkboxes
              const newChecks = Object.fromEntries(
                habbitIds.map(id => [id, Array(7).fill(false)])
              );
              setHabbitChecks(newChecks);
              setGoalaWeekChecked(false);
              setGoalaDayChecks(Array(7).fill(false));

              // Save to database
              const token = await getToken({ template: "supabase" });
              if (!token || !userId) return;
              await saveUserProgress({
                token,
                userId,
                weekRange: getCurrentWeekRange(),
                habbitIds,
                habbitChecks: newChecks,
                habbitNames, // keep names
                goalaWeekChecked: false,
                goalaDayChecks: Array(7).fill(false),
                weekGoalText, // keep goals
                dayGoalTexts, // keep goals
              });
            }}
            onCancel={() => setNewWeekModalOpen(false)}
          />
          <CustomModal
            open={resetModalOpen}
            title="Reset Progress?"
            description="Are you sure you want to clear all fields and reset your progress for this week?"
            confirmText="Yes, reset"
            cancelText="Cancel"
            onConfirm={async () => {
              setResetModalOpen(false);
              // Reset all local state
              setHabbitIds([0, 1, 2, 3]);
              setHabbitNames(["", "", "", ""]);
              setHabbitChecks({ 0: Array(7).fill(false), 1: Array(7).fill(false), 2: Array(7).fill(false), 3: Array(7).fill(false) });
              setGoalaWeekChecked(false);
              setGoalaDayChecks(Array(7).fill(false));
              setWeekGoalText("");
              setDayGoalTexts(Array(7).fill(""));

              // Reset in database
              const token = await getToken({ template: "supabase" });
              if (!token || !userId) return;
              await saveUserProgress({
                token,
                userId,
                weekRange: getCurrentWeekRange(),
                habbitIds: [0, 1, 2, 3],
                habbitChecks: { 0: Array(7).fill(false), 1: Array(7).fill(false), 2: Array(7).fill(false), 3: Array(7).fill(false) },
                habbitNames: ["", "", "", ""],
                goalaWeekChecked: false,
                goalaDayChecks: Array(7).fill(false),
                weekGoalText: "",
                dayGoalTexts: Array(7).fill(""),
              });
            }}
            onCancel={() => setResetModalOpen(false)}
          />
        </main>
      </SignedIn>
      <Footer
        habbitsScore={habbitsScore}
        habbitsPenalty={habbitsPenalty}
        goalAPenalty={goalaPenalty}
        showSummary={showSummary}
        onShowSummary={() => setShowSummary(true)}
        weekGoalText={weekGoalText}
        dayGoalTexts={dayGoalTexts}
        goalaDayChecks={goalaDayChecks}
        habbitNames={habbitNames}
        habbitChecks={habbitChecks}
      />
    </>
  );
}