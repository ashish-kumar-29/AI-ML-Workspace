export default function DatasetDetails({ data }) {
  return (
    <div className="mt-8 w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">
        Dataset Information
      </h2>

      {/* Dataset Details */}
      <div className="grid grid-cols-3 gap-8 text-center">
        <div className="bg-blue-50 rounded-xl p-5 shadow">
          <p className="text-gray-500 text-sm">Filename</p>

          <h3
            className="text-lg font-semibold text-gray-800 mt-2 truncate"
            title={data.filename}
          >
            {data.filename}
          </h3>
        </div>

        <div className="bg-green-50 rounded-xl p-5 shadow">
          <p className="text-gray-500 text-sm">Rows</p>

          <h3 className="text-3xl font-bold text-green-600">
            {data.rows}
          </h3>
        </div>

        <div className="bg-purple-50 rounded-xl p-5 shadow">
          <p className="text-gray-500 text-sm">Columns</p>

          <h3 className="text-3xl font-bold text-purple-600">
            {data.columns}
          </h3>
        </div>
      </div>

      {/* Column Names */}
      <div className="mt-10">
        <h3 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Column Names
        </h3>

        <div className="flex flex-wrap justify-center gap-3">
          {data.column_names
            .filter((column) => column.trim() !== "Unnamed: 0")
            .map((column) => (
              <span
                key={column}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2 rounded-full font-medium shadow hover:scale-105 transition"
              >
                {column}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}