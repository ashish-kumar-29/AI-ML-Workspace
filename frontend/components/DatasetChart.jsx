"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function DatasetChart({ eda }) {
  if (!eda?.basic_info) {
    return (
      <div className="flex justify-center items-center h-80 text-gray-500">
        Upload a dataset to visualize analytics.
      </div>
    );
  }

  const chartData = [
    {
      name: "Numeric",
      value: eda.basic_info.numeric_columns,
    },
    {
      name: "Categorical",
      value: eda.basic_info.categorical_columns,
    },
  ];

  const COLORS = [
    "#2563EB",
    "#9333EA",
  ];

  return (
    <div className="h-80">

      <ResponsiveContainer width="100%" height="100%">

        <PieChart>

          <Pie
            data={chartData}
            dataKey="value"
            outerRadius={110}
            label
          >
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend />

        </PieChart>

      </ResponsiveContainer>

    </div>
  );
}