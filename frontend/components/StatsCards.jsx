export default function StatsCards({ data }) {
  return (
    <div className="max-w-6xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition">
        <p className="text-gray-500">📄 Rows</p>
        <h2 className="text-3xl font-bold text-blue-600 mt-2">
          {data.rows}
        </h2>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition">
        <p className="text-gray-500">📑 Columns</p>
        <h2 className="text-3xl font-bold text-green-600 mt-2">
          {data.columns}
        </h2>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition">
        <p className="text-gray-500">📂 Dataset</p>
        <h2 className="text-lg font-bold text-purple-600 mt-2 truncate">
          {data.filename}
        </h2>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition">
        <p className="text-gray-500">✅ Status</p>
        <h2 className="text-2xl font-bold text-green-500 mt-2">
          Uploaded
        </h2>
      </div>

    </div>
  );
}