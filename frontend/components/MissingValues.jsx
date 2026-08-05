export default function MissingValues({ data }) {
  if (!data) return null;

  return (
    <div className="mt-10 bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">
        Missing Value Analysis
      </h2>

      <div className="space-y-5">
        {Object.entries(data).map(([column, info]) => (
          <div key={column}>
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-800">
                {column}
              </span>

              <span className="font-medium text-gray-700">
                {info.missing_count} ({info.missing_percent}%)
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full ${
                  info.missing_percent === 0
                    ? "bg-green-500"
                    : info.missing_percent < 20
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{
                  width: `${info.missing_percent}%`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}