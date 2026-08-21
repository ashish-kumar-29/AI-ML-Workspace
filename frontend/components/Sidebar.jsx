"use client";

import { useRouter } from "next/navigation";

export default function Sidebar({ active, setActive }) {
  const router = useRouter();

  const menu = [
    {
      id: "info",
      label: "Dataset Information",
      icon: "📄",
    },
    {
      id: "preview",
      label: "Dataset Preview",
      icon: "📋",
    },

    {
      id: "column",
      label: "Column Summary",
      icon: "📑",
    },
    {
      id: "missing",
      label: "Missing Values",
      icon: "⚠️",
    },

    {
      id: "numerical",
      label: "Numerical Statistics",
      icon: "📊",
    },
    {
      id: "categorical",
      label: "Categorical Statistics",
      icon: "📈",
    },

    {
      id: "duplicate",
      label: "Duplicate Analysis",
      icon: "🔄",
    },
    {
      id: "invalid",
      label: "Invalid Values",
      icon: "⚠️",
    },

    {
      id: "correlation",
      label: "Correlation Analysis",
      icon: "🔗",
    },
    {
      id: "distribution",
      label: "Distribution Analysis",
      icon: "📉",
    },
    {
      id: "kurtosis",
      label: "Kurtosis Analysis",
      icon: "📐",
    },
    {
      id: "outlier",
      label: "Outlier Analysis",
      icon: "🎯",
    },

    {
      id: "cleaning",
      label: "Data Cleaning",
      icon: "🧹",
    },
    {
      id: "ai",
      label: "AI Insights",
      icon: "🤖",
    },

    // ======================================================
    // NEW — DECISION GRAPH
    // ======================================================

    {
      id: "decision-graph",
      label: "Decision Graph",
      icon: "🧠",
      route: "/decision-graph",
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-slate-950 text-white shadow-2xl z-50 overflow-y-auto">
      {/* Header */}
      <div className="px-6 py-7 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-blue-400">
          DataMind AI
        </h1>

        <p className="text-sm text-slate-400 mt-1">
          Intelligent Data Analysis
        </p>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <p className="text-xs uppercase tracking-wider text-slate-500 px-3 mb-3">
          Analysis
        </p>

        <div className="space-y-1">
          {menu.map((item) => {
            const isDecisionGraph =
              item.id === "decision-graph";

            const isActive =
              active === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  // ------------------------------------------
                  // Decision Graph is a separate Next.js route
                  // ------------------------------------------

                  if (isDecisionGraph) {
                    router.push("/decision-graph");
                    return;
                  }

                  // ------------------------------------------
                  // Existing workspace navigation
                  // ------------------------------------------

                  setActive(item.id);
                }}
                className={`
                  w-full flex items-center gap-3
                  px-4 py-3 rounded-xl
                  text-left
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }
                `}
              >
                <span className="text-xl w-7 text-center">
                  {item.icon}
                </span>

                <span className="font-medium text-sm">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}