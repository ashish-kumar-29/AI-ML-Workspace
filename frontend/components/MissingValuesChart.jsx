"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function MissingValuesChart({ eda }) {
  if (!eda?.missing_values) {
    return (
      <div className="flex items-center justify-center h-80 text-gray-500">
        Upload a dataset to view missing values.
      </div>
    );
  }

  const chartData = Object.entries(eda.missing_values).map(
    ([column, value]) => ({
      column,
      missing: value,
    })
  );

  return (
    <div className="h-80">

      <ResponsiveContainer width="100%" height="100%">

        <BarChart data={chartData}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="column" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="missing"
            fill="#2563EB"
            radius={[6, 6, 0, 0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}