import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fit Mom 20 — A Simple 20-Minute Daily Plan for Busy Moms",
  description:
    "No gym. No equipment. No guilt. Personalized 20-minute daily home fitness and simple weekly meal ideas designed specifically for busy moms.",
  openGraph: {
    title: "Fit Mom 20 — Feel Fit Again in 20 Minutes a Day",
    description: "No gym. No equipment. No guilt. Simple home workouts made for busy moms.",
    url: "https://fit-mom-28-aj.vercel.app",
    siteName: "Fit Mom 20",
    images: [
      {
        url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Fit Mom 20 - Daily Home Workout for Busy Moms",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fit Mom 20 — Feel Fit Again in 20 Minutes a Day",
    description: "Personalized 20-minute daily workouts for busy moms.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;1,500;1,600&family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-cream text-plum antialiased selection:bg-blush-200 selection:text-plum">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
