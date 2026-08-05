export default function CategoricalStatistics({ data }) {
  if (!data) return null;

  return (
    <div className="mt-10 bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Categorical Statistics
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="border px-4 py-2">Column</th>
              <th className="border px-4 py-2">Unique</th>
              <th className="border px-4 py-2">Top Category</th>
              <th className="border px-4 py-2">Frequency</th>
              <th className="border px-4 py-2">Average Length</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {Object.entries(data).map(([column, stats]) => (
              <tr key={column} className="text-center hover:bg-gray-50">
                <td className="border px-4 py-2 font-semibold">
                  {column}
                </td>

                <td className="border px-4 py-2">
                  {stats.unique_values}
                </td>

                <td className="border px-4 py-2">
                  {stats.top_category ?? "-"}
                </td>

                <td className="border px-4 py-2">
                  {stats.top_frequency}
                </td>

                <td className="border px-4 py-2">
                  {stats.average_length}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}