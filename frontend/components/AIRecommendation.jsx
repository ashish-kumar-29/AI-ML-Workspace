export default function AIRecommendation({ dataset, eda }) {
  if (!dataset || !eda) return null;

  const info = eda.basic_info;

  const recommendations = [];

  // Dataset Size
  if (info.rows > 1000) {
    recommendations.push("Large dataset detected. Machine Learning models can perform well.");
  } else {
    recommendations.push("Small dataset detected. Consider collecting more data for better accuracy.");
  }

  // Missing Values
  recommendations.push("Check and handle missing values before model training.");

  // Numeric Columns
  if (info.numeric_columns > 0) {
    recommendations.push("Normalize or standardize numerical features.");
  }

  // Categorical Columns
  if (info.categorical_columns > 0) {
    recommendations.push("Encode categorical features using One-Hot or Label Encoding.");
  }

  // Algorithm Suggestion
  recommendations.push("Try Linear Regression, Random Forest or XGBoost for prediction tasks.");

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-10 mt-10">

      <div className="flex items-center gap-4 mb-8">

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center text-3xl">
          🤖
        </div>

        <div>
          <h2 className="text-4xl font-bold text-gray-800">
            AI Recommendation
          </h2>

          <p className="text-gray-500">
            Smart suggestions based on your dataset
          </p>
        </div>

      </div>

      <div className="space-y-5">

        {recommendations.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-4 bg-blue-50 border border-blue-100 rounded-xl p-5 hover:bg-blue-100 transition"
          >
            <span className="text-2xl">✅</span>

            <p className="text-gray-700 leading-7">
              {item}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}