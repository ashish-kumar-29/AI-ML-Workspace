export default function PreviewTable({ data }) {
  if (!data.preview.length) return null;

  const headers = Object.keys(data.preview[0]).filter(
    (header) => header !== "Unnamed: 0"
  );

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8">

      {/* Header */}
      <div className="mb-8">

        <span className="bg-green-100 text-green-700 px-5 py-2 rounded-full text-sm font-medium">
          Data Preview
        </span>

        <h2 className="text-4xl font-bold mt-5 text-gray-800">
          📑 Dataset Preview
        </h2>

        <p className="text-gray-500 mt-3">
          First five rows from the uploaded dataset
        </p>

      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200">

        <table className="min-w-full">

          <thead className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white sticky top-0">

            <tr>

              <th className="px-6 py-4 text-center font-semibold">
                #
              </th>

              {headers.map((header) => (
                <th
                  key={header}
                  className="px-6 py-4 whitespace-nowrap text-left font-semibold"
                >
                  {header}
                </th>
              ))}

            </tr>

          </thead>

          <tbody>

            {data.preview.map((row, index) => (

              <tr
                key={index}
                className={`transition duration-200 hover:bg-blue-50 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >

                <td className="px-6 py-4 text-center font-semibold text-gray-600">
                  {index + 1}
                </td>

                {headers.map((header) => (

                  <td
                    key={header}
                    className="px-6 py-4 whitespace-nowrap text-gray-700 border-t"
                  >
                    {String(row[header])}
                  </td>

                ))}

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}