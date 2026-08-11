
"use client";

export default function Sidebar({ active, setActive }) {

  const menu = [
    { id: "info", label: "Dataset Information", icon: "📄" },
    { id: "preview", label: "Dataset Preview", icon: "📑" },

    { id: "column", label: "Column Summary", icon: "📋" },
    { id: "missing", label: "Missing Values", icon: "❗" },
    { id: "duplicate", label: "Duplicate Analysis", icon: "📌" },
    { id: "invalid", label: "Invalid Values", icon: "⚠️" },

    { id: "numerical", label: "Numerical Statistics", icon: "📊" },
    { id: "categorical", label: "Categorical Statistics", icon: "📈" },

    { id: "correlation", label: "Correlation Analysis", icon: "🔥" },
    { id: "distribution", label: "Distribution Analysis", icon: "📉" },
    { id: "kurtosis", label: "Kurtosis Analysis", icon: "📐" },
    { id: "outlier", label: "Outlier Analysis", icon: "📦" },

    { id: "cleaning", label: "Data Cleaning", icon: "🧹" },

    { id: "ai", label: "AI Insights", icon: "🤖" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-white shadow-xl overflow-y-auto">

      <div className="text-center py-6 border-b">
        <h2 className="text-2xl font-bold text-blue-600">
          Dashboard
        </h2>
      </div>

      <div className="p-4 space-y-2">

        {menu.map((item) => (

          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition
            ${
              active === item.id
                ? "bg-blue-600 text-white"
                : "hover:bg-blue-100 text-gray-700"
            }`}
          >
            {item.icon} {item.label}
          </button>

        ))}

      </div>

    </aside>
  );
}

