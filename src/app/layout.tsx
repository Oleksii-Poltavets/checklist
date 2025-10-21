import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export const metadata: Metadata = {
  title: "Checklist App",
  description: "Self discipline and productivity tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider 
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#10b981", // emerald-500 to match your theme
          colorBackground: "#1e293b", // slate-800
          colorInputBackground: "#334155", // slate-700
          colorInputText: "#f1f5f9", // slate-100
          colorText: "#f1f5f9", // slate-100
          colorTextSecondary: "#94a3b8", // slate-400
          colorNeutral: "#64748b", // slate-500
          colorDanger: "#ef4444", // red-500
          colorSuccess: "#10b981", // emerald-500
          colorWarning: "#f59e0b", // amber-500
          borderRadius: "0.5rem", // rounded-lg to match your buttons
        },
        elements: {
          card: "bg-slate-800 border border-slate-700 shadow-2xl",
          modalContent: "bg-slate-800",
          modalCloseButton: "text-slate-400 hover:text-slate-100",
          headerTitle: "text-slate-100",
          headerSubtitle: "text-slate-300",
          socialButtonsBlockButton: "bg-slate-700 border-slate-600 text-slate-100 hover:bg-slate-600",
          formButtonPrimary: "bg-emerald-600 hover:bg-emerald-700 text-white",
          footerActionLink: "text-emerald-400 hover:text-emerald-300",
          identityPreviewText: "text-slate-100",
          identityPreviewEditButtonIcon: "text-slate-400",
        }
      }}
    >
      <html lang="en" className="dark">
        <head>
          {/* PWA manifest + theme color */}
          <link rel="manifest" href="/manifest.webmanifest" />
          <meta name="theme-color" content="#0f172a" />

          {/* iOS support (uses apple-touch-icon and meta tags) */}
          <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Checklist" />

          {/* Windows tile (optional) */}
          <meta name="msapplication-TileColor" content="#0f172a" />
          <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
        </head>
        <body className="min-h-screen flex flex-col font-sans bg-slate-900 text-slate-100">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
