export default function StatsCards({ data }) {
  const cards = [
    {
      title: "Dataset",
      value: data.filename,
      icon: "📂",
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Rows",
      value: data.rows.toLocaleString(),
      icon: "📄",
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Columns",
      value: data.columns,
      icon: "📊",
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "Status",
      value: "Ready",
      icon: "✅",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 p-6"
        >
          <div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${card.color} flex items-center justify-center text-3xl`}
          >
            {card.icon}
          </div>

          <p className="text-gray-500 mt-6 text-sm font-medium">
            {card.title}
          </p>

          <h2 className="text-2xl font-bold mt-2 text-gray-800 break-words">
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}