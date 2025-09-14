"use client"

import { useState } from "react";
import Footer from "./components/footer/Footer";
import GoalA from "./components/Main/GoalA";
import Habbits from "./components/Main/Habbits";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // State for summary
  const [showSummary, setShowSummary] = useState(false);

  // State for habbits and goalA (example, adapt to your logic)
  const [habbitIds, setHabbitIds] = useState([0, 1, 2, 3]);
  const [habbitChecks, setHabbitChecks] = useState<{ [key: number]: boolean[] }>(
    () => Object.fromEntries([0, 1, 2, 3].map(id => [id, Array(7).fill(false)]))
  );
  const [goalAWeekChecked, setGoalAWeekChecked] = useState(false);
  const [goalADayChecks, setGoalADayChecks] = useState(Array(7).fill(false));

  // Calculations
  const totalChecked = Object.values(habbitChecks).reduce((acc, arr) => acc + arr.filter(Boolean).length, 0);
  const totalBoxes = habbitIds.length * 7;
  const habbitsScore = `${totalChecked}/${totalBoxes} (${totalBoxes > 0 ? Math.round((totalChecked / totalBoxes) * 100) : 0}%)`;
  const habbitsPenalty = habbitIds.reduce((total, id) => {
    const checked = habbitChecks[id]?.filter(Boolean).length || 0;
    const penalty = 7 - checked - 2;
    return total + (penalty < 0 ? 0 : penalty);
  }, 0);
  const goalAWeekPenalty = goalAWeekChecked ? 0 : 1;
  const goalADayPenalty = Math.max(0, 7 - goalADayChecks.filter(Boolean).length - 2);
  const goalAPenalty = goalAWeekPenalty + goalADayPenalty;

  const personOnDuty = "John Doe";
  const weekStart = "2025-09-08";
  const weekEnd = "2025-09-14";
  return (
    <>
      <main className="flex-1 w-full flex flex-col items-center justify-start p-6 bg-white dark:bg-gray-950">
        <h1 className="text-3xl font-bold mb-2">
          On duty: <span className="text-blue-600">{personOnDuty}</span>
        </h1>
        <h2 className="text-xl font-semibold mb-6">
          Week: {weekStart} – {weekEnd}
        </h2>
        <div className="w-full flex flex-col lg:flex-row gap-8 items-start justify-center">
          <GoalA
            weekChecked={goalAWeekChecked}
            setWeekChecked={setGoalAWeekChecked}
            dayChecks={goalADayChecks}
            setDayChecks={setGoalADayChecks}
          />
          <Habbits
            habbitIds={habbitIds}
            setHabbitIds={setHabbitIds}
            checks={habbitChecks}
            setChecks={setHabbitChecks}
          />
        </div>
        {children}
      </main>
      <Footer
        habbitsScore={habbitsScore}
        habbitsPenalty={habbitsPenalty}
        goalAPenalty={goalAPenalty}
        showSummary={showSummary}
        onShowSummary={() => setShowSummary(true)}
      />
    </>
  );
}
