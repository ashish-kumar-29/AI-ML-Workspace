export default function DuplicateAnalysis({ data }) {
  if (!data) return null;

  return (
    <div className="mt-10 bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Duplicate Analysis
      </h2>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-red-50 rounded-xl shadow p-6 text-center">
          <h3 className="text-gray-500">Duplicate Rows</h3>
          <p className="text-4xl font-bold text-red-600">
            {data.duplicate_count}
          </p>
        </div>

        <div className="bg-orange-50 rounded-xl shadow p-6 text-center">
          <h3 className="text-gray-500">Duplicate Percentage</h3>
          <p className="text-4xl font-bold text-orange-600">
            {data.duplicate_percent}%
          </p>
        </div>
      </div>
    </div>
  );
}