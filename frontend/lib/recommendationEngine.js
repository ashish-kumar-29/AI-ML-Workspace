export default function generateRecommendations(dataset, eda) {
  if (!dataset || !eda) return [];

  const recommendations = [];

  // Missing Values
  if (eda.missing_values) {
    const totalMissing = Object.values(eda.missing_values)
      .reduce((sum, value) => sum + value, 0);

    if (totalMissing > 0) {
      recommendations.push({
        type: "warning",
        text: "Remove or impute missing values before training your model.",
      });
    }
  }

  // Categorical Columns
  if (
    eda.basic_info.categorical_columns > 0
  ) {
    recommendations.push({
      type: "info",
      text: "Apply One-Hot Encoding for categorical features.",
    });
  }

  // Numeric Columns
  if (
    eda.basic_info.numeric_columns > 0
  ) {
    recommendations.push({
      type: "success",
      text: "Normalize numerical columns for better model performance.",
    });
  }

  // Dataset Size
  if (dataset.rows > 5000) {
    recommendations.push({
      type: "success",
      text: "Random Forest or XGBoost are suitable for large datasets.",
    });
  } else {
    recommendations.push({
      type: "info",
      text: "Decision Tree or Logistic Regression are good starting models.",
    });
  }

  return recommendations;
}