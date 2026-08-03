export default function calculateHealthScore(dataset, eda) {

  let score = 100;

  if (!eda || !eda.basic_info) {
    return 0;
  }

  // Missing values
  if (eda.missing_values) {

    const totalMissing = Object.values(eda.missing_values)
      .reduce((sum, value) => sum + value, 0);

    if (totalMissing > 0)
      score -= 15;

    if (totalMissing > dataset.rows * 0.2)
      score -= 20;

  }

  // Duplicate rows
  if (eda.basic_info.duplicate_rows > 0) {
    score -= 10;
  }

  // Too many categorical columns
  if (eda.basic_info.categorical_columns > eda.basic_info.numeric_columns) {
    score -= 5;
  }

  if (score < 0)
    score = 0;

  return score;
}