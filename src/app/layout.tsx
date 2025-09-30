import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/header/Header";
import { ClerkProvider } from "@clerk/nextjs";

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
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen flex flex-col font-sans">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
