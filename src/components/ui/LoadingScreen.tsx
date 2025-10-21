import Spinner from "./Spinner";

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingScreen({ 
  message = "Loading...", 
  fullScreen = true 
}: LoadingScreenProps) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex items-center justify-center z-50">
        <div className="text-center">
          <Spinner size="lg" color="emerald" className="mb-4" />
          <p className="text-slate-300 text-lg font-medium">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <Spinner size="md" color="emerald" className="mb-2" />
        <p className="text-slate-400 text-sm">{message}</p>
      </div>
    </div>
  );
}