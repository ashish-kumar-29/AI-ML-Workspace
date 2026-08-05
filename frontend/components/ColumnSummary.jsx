export default function ColumnSummary({ data }) {
  if (!data) return null;

  return (
    <div className="mt-10 bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Column Summary
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="border px-4 py-2">Column</th>
              <th className="border px-4 py-2">Data Type</th>
              <th className="border px-4 py-2">Unique</th>
              <th className="border px-4 py-2">Missing</th>
              <th className="border px-4 py-2">Missing %</th>
              <th className="border px-4 py-2">Memory</th>
            </tr>
          </thead>

          <tbody className="text-gray-800">
            {Object.entries(data).map(([column, info]) => (
              <tr key={column} className="text-center hover:bg-gray-50">
                <td className="border px-4 py-2 font-semibold text-gray-900">{column}</td>
                <td className="border px-4 py-2">{info.dtype}</td>
                <td className="border px-4 py-2">{info.unique_values}</td>
                <td className="border px-4 py-2">{info.missing_count}</td>
                <td className="border px-4 py-2">
                  {info.missing_percent}%
                </td>
                <td className="border px-4 py-2">
                  {(info.memory_usage / 1024).toFixed(2)} KB
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}