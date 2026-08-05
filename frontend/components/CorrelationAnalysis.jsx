export default function CorrelationAnalysis({ data }) {
  if (!data) return null;

  const columns = Object.keys(data);

  const getColor = (value) => {
    if (value === null) return "bg-gray-200";

    if (value >= 0.7) return "bg-green-500 text-white";

    if (value >= 0.3) return "bg-green-300";

    if (value <= -0.7) return "bg-red-500 text-white";

    if (value <= -0.3) return "bg-red-300";

    return "bg-yellow-100";
  };

  return (
    <div className="mt-10 bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Correlation Analysis
      </h2>
    
      <div className="overflow-x-auto">
        <table className="min-w-max border-collapse">
          <thead>
            <tr>
              <th className="border px-3 py-2 bg-blue-600 text-white">
                Column
              </th>

              {columns.map((col) => (
                <th
                  key={col}
                  className="border px-3 py-2 bg-blue-600 text-white"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {columns.map((row) => (
              <tr key={row}>
                <td className="border px-3 py-2 font-semibold bg-gray-100">
                  {row}
                </td>

                {columns.map((col) => (
                  <td
                    key={col}
                    className={`border px-3 py-2 text-center ${getColor(
                      data[row][col]
                    )}`}
                  >
                    {data[row][col] === null
                      ? "-"
                      : data[row][col].toFixed(2)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
</div>
        {/* Correlation Legend */}
<div className="mt-8 p-6 bg-gray-50 rounded-xl border">
  <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
    Correlation Legend
  </h3>

  <div className="grid grid-cols-2 gap-6">

    <div className="flex items-center gap-4">
      <div className="w-8 h-8 rounded bg-green-500"></div>
      <div>
        <p className="font-semibold text-gray-800">
          Strong Positive
        </p>
        <p className="text-sm text-gray-600">
          (≥ 0.70)
        </p>
      </div>
    </div>

    <div className="flex items-center gap-4">
      <div className="w-8 h-8 rounded bg-green-300"></div>
      <div>
        <p className="font-semibold text-gray-800">
          Weak Positive
        </p>
        <p className="text-sm text-gray-600">
          (0.30 – 0.69)
        </p>
      </div>
    </div>

    <div className="flex items-center gap-4">
      <div className="w-8 h-8 rounded bg-yellow-200 border"></div>
      <div>
        <p className="font-semibold text-gray-800">
          Weak / No Correlation
        </p>
        <p className="text-sm text-gray-600">
          (-0.29 – 0.29)
        </p>
      </div>
    </div>

    <div className="flex items-center gap-4">
      <div className="w-8 h-8 rounded bg-red-500"></div>
      <div>
        <p className="font-semibold text-gray-800">
          Strong Negative
        </p>
        <p className="text-sm text-gray-600">
          (≤ -0.70)
        </p>
      </div>
    </div>

    <div className="flex items-center gap-4 col-span-2">
      <div className="w-8 h-8 rounded bg-gray-300"></div>
      <div>
        <p className="font-semibold text-gray-800">
          Missing / Undefined
        </p>
      </div>
    </div>

  </div>
</div>

 {/* How to Interpret Correlation */}
<div className="mt-5 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
  <h4 className="font-semibold text-blue-700 mb-2">
    How to Interpret Correlation
  </h4>

  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
    <li><strong>+1.00</strong> → Perfect positive relationship.</li>
    <li><strong>0.70 to 0.99</strong> → Strong positive correlation.</li>
    <li><strong>0.30 to 0.69</strong> → Moderate positive correlation.</li>
    <li><strong>-0.29 to 0.29</strong> → Weak or no correlation.</li>
    <li><strong>-0.30 to -0.69</strong> → Moderate negative correlation.</li>
    <li><strong>-0.70 to -1.00</strong> → Strong negative correlation.</li>
  </ul>
</div>

      </div>
    // </div>
  );
}