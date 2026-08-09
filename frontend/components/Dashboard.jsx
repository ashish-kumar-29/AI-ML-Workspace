"use client";

import EDASummary from "./EDASummary";
import MissingValues from "./MissingValues";
import DuplicateAnalysis from "./DuplicateAnalysis";
import NumericalStatistics from "./NumericalStatistics";

export default function Dashboard({ data }) {
  if (!data) {
    return (
      <div className="mt-10 text-center text-gray-500">
        Upload a CSV file to see dataset analysis.
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-8">

      {/* Dataset overview */}
      <EDASummary data={data} />

      {/* Missing values */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <MissingValues data={data.missing_analysis} />
      </div>

      {/* Duplicate analysis */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <DuplicateAnalysis data={data.duplicate_analysis} />
      </div>

      {/* Numerical statistics */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <NumericalStatistics data={data.numerical_statistics} />
      </div>

    </div>
  );
}