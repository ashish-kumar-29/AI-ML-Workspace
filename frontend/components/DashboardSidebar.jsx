"use client";

import Link from "next/link";

export default function DashboardSidebar() {
  return (
    <aside className="w-72 bg-white rounded-3xl shadow-xl p-8 h-[85vh] sticky top-24">

      <h2 className="text-3xl font-bold text-blue-600 mb-10">
        AI Workspace
      </h2>

      <nav className="space-y-4">

        <Link
          href="/"
          className="block px-5 py-4 rounded-xl hover:bg-blue-50 transition"
        >
          🏠 Home
        </Link>

        <Link
          href="/dashboard"
          className="block px-5 py-4 rounded-xl bg-blue-600 text-white font-semibold"
        >
          📊 Dashboard
        </Link>

        <button className="w-full text-left px-5 py-4 rounded-xl hover:bg-blue-50 transition">
          🤖 AI Models
        </button>

        <button className="w-full text-left px-5 py-4 rounded-xl hover:bg-blue-50 transition">
          📂 Upload History
        </button>

        <button className="w-full text-left px-5 py-4 rounded-xl hover:bg-blue-50 transition">
          ⚙ Settings
        </button>

      </nav>

    </aside>
  );
}
