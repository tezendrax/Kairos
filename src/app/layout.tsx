import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Jarvis Scheduler — AI Personal Scheduler & Focus Assistant",
  description: "Be your most productive self — an AI-powered scheduler that re-plans your day, blocks distractions, and nudges you to finish what's important.",
  keywords: [
    "AI scheduler",
    "personal productivity",
    "time management",
    "focus assistant",
    "task management",
    "calendar sync",
    "student productivity",
    "work productivity",
    "smart scheduling",
    "distraction blocking"
  ],
  authors: [{ name: "Jarvis Scheduler Team" }],
  creator: "Jarvis Scheduler",
  publisher: "Jarvis Scheduler",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://jarvis-scheduler.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Jarvis Scheduler — AI Personal Scheduler & Focus Assistant",
    description: "Be your most productive self — an AI-powered scheduler that re-plans your day, blocks distractions, and nudges you to finish what's important.",
    url: "https://jarvis-scheduler.com",
    siteName: "Jarvis Scheduler",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Jarvis Scheduler - AI Personal Scheduler",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jarvis Scheduler — AI Personal Scheduler & Focus Assistant",
    description: "Be your most productive self — an AI-powered scheduler that re-plans your day, blocks distractions, and nudges you to finish what's important.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
