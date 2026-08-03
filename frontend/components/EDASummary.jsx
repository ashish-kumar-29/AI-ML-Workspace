export default function EDASummary({ data }) {
  if (!data || !data.basic_info) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading Dataset Intelligence...
      </div>
    );
  }

  const info = data.basic_info;

  const cards = [
    {
      title: "Rows",
      value: info.rows.toLocaleString(),
      icon: "📄",
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Columns",
      value: info.columns,
      icon: "📊",
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "Memory",
      value: `${info.memory_usage_mb} MB`,
      icon: "💾",
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Numeric",
      value: info.numeric_columns,
      icon: "🔢",
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Categorical",
      value: info.categorical_columns,
      icon: "🔠",
      color: "from-cyan-500 to-blue-500",
    },
    {
      title: "Datetime",
      value: info.datetime_columns,
      icon: "📅",
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "Boolean",
      value: info.boolean_columns,
      icon: "✔️",
      color: "from-teal-500 to-green-600",
    },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-10">

      <div className="text-center mb-10">

        <span className="bg-blue-100 text-blue-700 px-5 py-2 rounded-full text-sm font-medium">
          AI Generated Insights
        </span>

        <h2 className="text-4xl font-bold mt-5 text-gray-800">
          📈 Dataset Intelligence
        </h2>

        <p className="text-gray-500 mt-3">
          Automatic analysis of your uploaded dataset
        </p>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {cards.map((card) => (

          <div
            key={card.title}
            className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 p-6"
          >

            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${card.color} flex items-center justify-center text-3xl`}
            >
              {card.icon}
            </div>

            <p className="text-gray-500 mt-6 text-sm font-medium">
              {card.title}
            </p>

            <h3 className="text-3xl font-bold text-gray-800 mt-2">
              {card.value}
            </h3>

          </div>

        ))}

      </div>

    </div>
  );
}