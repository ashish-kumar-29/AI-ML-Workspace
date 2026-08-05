export default function NumericalStatistics({ data }) {
  if (!data) return null;

  return (
    <div className="mt-10 bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Numerical Statistics
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="border px-4 py-2">Column</th>
              <th className="border px-4 py-2">Mean</th>
              <th className="border px-4 py-2">Median</th>
              <th className="border px-4 py-2">Std Dev</th>
              <th className="border px-4 py-2">Min</th>
              <th className="border px-4 py-2">Max</th>
              <th className="border px-4 py-2">Variance</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {Object.entries(data).map(([column, stats]) => (
              <tr key={column} className="text-center hover:bg-gray-50">
                <td className="border px-4 py-2 font-semibold">{column}</td>
                <td className="border px-4 py-2">{stats.mean}</td>
                <td className="border px-4 py-2">{stats.median}</td>
                <td className="border px-4 py-2">
                  {stats.standard_deviation}
                </td>
                <td className="border px-4 py-2">{stats.minimum}</td>
                <td className="border px-4 py-2">{stats.maximum}</td>
                <td className="border px-4 py-2">{stats.variance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}