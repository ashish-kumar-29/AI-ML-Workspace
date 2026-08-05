export default function InvalidValues({ data }) {
  if (!data) return null;

  return (
    <div className="mt-10 bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Invalid Value Analysis
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="border px-4 py-2">Column</th>
              <th className="border px-4 py-2">Invalid Values</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {Object.entries(data).map(([column, value]) => (
              <tr
                key={column}
                className="text-center hover:bg-gray-50"
              >
                <td className="border px-4 py-2 font-semibold">
                  {column}
                </td>

                <td
                  className={`border px-4 py-2 font-bold ${
                    value.invalid_count === 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {value.invalid_count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}