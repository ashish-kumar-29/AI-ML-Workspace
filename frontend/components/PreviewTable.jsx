export default function PreviewTable({ data }) {
  if (!data.preview.length) return null;

  const headers = Object.keys(data.preview[0]).filter(
    (header) => header !== "Unnamed: 0"
  );

  return (
    <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">

      <h2 className="text-3xl font-bold text-blue-600 mb-6">
        Dataset Preview
      </h2>

      <div className="overflow-x-auto">

        <table className="min-w-full border">

          <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <tr>
              <th className="px-6 py-4 border whitespace-nowrap text-center font-semibold">
                S.No.
              </th>

              {headers.map((header) => (
                <th
                  key={header}
                  className="px-6 py-4 border whitespace-nowrap text-center font-semibold"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="text-gray-800">

            {data.preview.map((row, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-50 transition`}
              >

                <td className="border px-5 py-3 text-center text-sm text-gray-800">
                  {index + 1}
                </td>

                {headers.map((header) => (
                  <td
                    key={header}
                    className="border px-5 py-3 whitespace-nowrap text-sm text-gray-800"
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