export default function DatasetHealth({ dataset, eda }) {
  if (!dataset || !eda) return null;

  const info = eda.basic_info;

  let score = 100;

  if (info.rows < 500)
    score -= 15;

  if (info.numeric_columns === 0)
    score -= 20;

  if (info.categorical_columns > info.numeric_columns)
    score -= 10;

  let status = "Excellent";
  let color = "text-green-600";

  if (score < 85) {
    status = "Good";
    color = "text-yellow-600";
  }

  if (score < 65) {
    status = "Needs Improvement";
    color = "text-red-600";
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-10 mt-10">

      <div className="text-center">

        <h2 className="text-4xl font-bold">
          🩺 Dataset Health Score
        </h2>

        <div className={`text-7xl font-extrabold mt-8 ${color}`}>
          {score}
        </div>

        <p className={`text-2xl font-semibold mt-4 ${color}`}>
          {status}
        </p>

      </div>

      <div className="grid md:grid-cols-2 gap-5 mt-10">

        <div className="bg-green-50 rounded-xl p-5">
          ✅ Enough rows for ML
        </div>

        <div className="bg-blue-50 rounded-xl p-5">
          📊 {info.numeric_columns} Numeric Features
        </div>

        <div className="bg-purple-50 rounded-xl p-5">
          🔠 {info.categorical_columns} Categories
        </div>

        <div className="bg-orange-50 rounded-xl p-5">
          💾 {info.memory_usage_mb} MB Memory
        </div>

      </div>

    </div>
  );
}