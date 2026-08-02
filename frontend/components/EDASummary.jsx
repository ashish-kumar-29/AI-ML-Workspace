export default function EDASummary({ data }) {
  const info = data.basic_info;

  const cards = [
    { title: "Rows", value: info.rows },
    { title: "Columns", value: info.columns },
    { title: "Memory", value: `${info.memory_usage_mb} MB` },
    { title: "Numeric", value: info.numeric_columns },
    { title: "Categorical", value: info.categorical_columns },
    { title: "Datetime", value: info.datetime_columns },
    { title: "Boolean", value: info.boolean_columns },
  ];

  return (
    <div className="mt-10 bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-4xl font-bold text-blue-600 mb-8 text-center">
        Dataset Intelligence
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-md p-6 text-center border"
          >
            <h3 className="text-gray-500">{card.title}</h3>

            <p className="text-3xl font-bold text-blue-600 mt-3">
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}