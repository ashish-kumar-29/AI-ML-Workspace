import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DatasetProvider } from "@/context/DatasetContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AI ML Workspace",
  description: "AI-powered dataset analysis platform",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
  <DatasetProvider>
    {children}
  </DatasetProvider>
</body>
    </html>
  );
}