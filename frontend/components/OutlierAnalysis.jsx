export default function OutlierAnalysis({ data }) {
  if (!data) return null;

  return (
    <div className="mt-10 bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">
        Outlier Analysis
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {Object.entries(data).map(([column, info]) => (
          <div
  key={column}
  className="w-full bg-white rounded-2xl shadow-lg border border-gray-200
           hover:shadow-xl transition-all duration-300
           p-8 min-h-[300px] flex flex-col"
>

  {/* Header */}
  <h3 className="text-xl font-bold text-blue-600 text-center break-words leading-7">
    {column}
  </h3>

  <div className="mt-6 flex flex-col gap-5 flex-1">

    {/* Outliers */}
    <div className="flex justify-between items-center">
      <span className="text-gray-700 font-medium">
        Outliers
      </span>

      <span
        className={`px-4 py-1 rounded-full text-white font-bold ${
          info.outliers_count === 0
            ? "bg-green-500"
            : "bg-red-500"
        }`}
      >
        {info.outliers_count}
      </span>
    </div>

    <hr />

    {/* Lower */}
    <div className="grid grid-cols-2 items-center gap-3">
    <span className="text-gray-700 font-medium whitespace-nowrap">
        Lower Bound
    </span>

    <span className="text-right font-bold text-gray-900 break-all">
        {info.lower_bound}
    </span>
</div>

    <hr />

    {/* Upper */}
    <div className="grid grid-cols-2 items-center gap-3">
    <span className="text-gray-700 font-medium whitespace-nowrap">
        Upper Bound
    </span>

    <span className="text-right font-bold text-gray-900 break-all">
        {info.upper_bound}
    </span>
</div>

  </div>

</div>
        ))}
      </div>
    </div>
  );
}