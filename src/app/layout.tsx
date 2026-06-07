import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppProvider } from "@/contexts/AppContext";

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
  title: "Kairos — Personal Scheduler & Flow State Companion",
  description: "Seize the opportune moment — a personal scheduler that re-plans your day, blocks distractions, and nudges you to finish what's important.",
  keywords: [
    "Kairos scheduler",
    "personal productivity",
    "time management",
    "focus assistant",
    "task management",
    "flow state Pomodoro",
    "private schedule"
  ],
  authors: [{ name: "Kairos Team" }],
  creator: "Kairos Workspace",
  publisher: "Kairos Workspace",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://kairos-workspace.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Kairos — Personal Scheduler & Flow State Companion",
    description: "Seize the opportune moment — a personal scheduler that re-plans your day, blocks distractions, and nudges you to finish what's important.",
    url: "https://kairos-workspace.com",
    siteName: "Kairos",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kairos - Seize the Moment",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kairos — Personal Scheduler & Flow State Companion",
    description: "Seize the opportune moment — a personal scheduler that re-plans your day, blocks distractions, and nudges you to finish what's important.",
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
          <AppProvider>
            {children}
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
