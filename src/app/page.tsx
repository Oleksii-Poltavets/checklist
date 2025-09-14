import Footer from "./components/footer/Footer";
import GoalA from "./components/Main/GoalA";
import Habbits from "./components/Main/Habbits";

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
          <GoalA />
          <Habbits />
        </div>
        {children}
      </main>
      <Footer
        habbitsScore="12/28 (43%)"
        habbitsPenalty={5}
        goalAPenalty={3}
      />
    </>
  );
}
