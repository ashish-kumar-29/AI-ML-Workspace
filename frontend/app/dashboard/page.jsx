"use client";

import Navbar from "@/components/Navbar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useDataset } from "@/context/DatasetContext";

import DatasetChart from "@/components/DatasetChart";
import MissingValuesChart from "@/components/MissingValuesChart";
import AIChat from "@/components/AIChat";

import calculateHealthScore from "@/lib/healthScore";
import generateRecommendations from "@/lib/recommendationEngine";

export default function Dashboard() {
  const { dataset, eda } = useDataset();

  const healthScore =
    dataset && eda
      ? calculateHealthScore(dataset, eda)
      : "--";

  const recommendations =
    dataset && eda
      ? generateRecommendations(dataset, eda)
      : [];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 pt-28 pb-10 px-6">

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}

          <DashboardSidebar />

          {/* Main Content */}

          <div className="flex-1">

            {/* Heading */}

            <div className="mb-10">

              <h1 className="text-5xl font-extrabold text-gray-800">
                AI ML Dashboard
              </h1>

              <p className="text-gray-500 mt-3 text-lg">
                Analyze, visualize and understand your datasets with AI.
              </p>

            </div>

            {/* Overview Cards */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

              <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition">

                <p className="text-gray-500">
                  Rows
                </p>

                <h2 className="text-5xl font-bold mt-4 text-blue-600">
                  {dataset?.rows ?? "--"}
                </h2>

              </div>

              <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition">

                <p className="text-gray-500">
                  Columns
                </p>

                <h2 className="text-5xl font-bold mt-4 text-purple-600">
                  {dataset?.columns ?? "--"}
                </h2>

              </div>

              <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition">

                <p className="text-gray-500">
                  Memory
                </p>

                <h2 className="text-4xl font-bold mt-4 text-orange-600">

                  {eda?.basic_info?.memory_usage_mb
                    ? `${eda.basic_info.memory_usage_mb} MB`
                    : "--"}

                </h2>

              </div>

              <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition">

                <p className="text-gray-500">
                  Health Score
                </p>

                <h2 className="text-5xl font-bold mt-4 text-green-600">
                  {healthScore}
                </h2>

              </div>

            </div>

            {/* Analytics */}

            <div className="grid lg:grid-cols-2 gap-8 mt-10">

              {/* Dataset Health */}

              <div className="bg-white rounded-3xl shadow-xl p-8">

                <h2 className="text-2xl font-bold mb-6">
                  🩺 Dataset Health
                </h2>

                <div className="flex justify-center items-center h-64">

                  <div className="text-center">

                    <div className="text-7xl font-extrabold text-green-600">

                      {dataset
                        ? `${healthScore}%`
                        : "--"}

                    </div>

                    <p className="text-gray-500 mt-3">

                      {!dataset
                        ? "Waiting for Dataset"
                        : healthScore >= 90
                        ? "Excellent Dataset Quality"
                        : healthScore >= 75
                        ? "Good Dataset Quality"
                        : healthScore >= 60
                        ? "Average Dataset Quality"
                        : "Poor Dataset Quality"}

                    </p>

                  </div>

                </div>

              </div>

              {/* AI Recommendation */}

              <div className="bg-white rounded-3xl shadow-xl p-8">

                <h2 className="text-2xl font-bold mb-6">
                  🤖 AI Recommendation
                </h2>

                <div className="space-y-4">

                  {dataset ? (

                    recommendations.map((item, index) => (

                      <div
                        key={index}
                        className={`rounded-xl p-4 border-l-4 ${
                          item.type === "success"
                            ? "bg-green-50 border-green-500"
                            : item.type === "warning"
                            ? "bg-yellow-50 border-yellow-500"
                            : "bg-blue-50 border-blue-500"
                        }`}
                      >
                        {item.text}
                      </div>

                    ))

                  ) : (

                    <div className="bg-blue-50 rounded-xl p-5">

                      Upload a dataset to receive AI recommendations.

                    </div>

                  )}

                </div>

              </div>

            </div>
                        {/* Charts */}

            <div className="mt-10 grid lg:grid-cols-2 gap-8">

              {/* Pie Chart */}

              <div className="bg-white rounded-3xl shadow-xl p-8">

                <h2 className="text-2xl font-bold mb-6">
                  📊 Column Types
                </h2>

                <DatasetChart eda={eda} />

              </div>

              {/* Missing Values */}

              <div className="bg-white rounded-3xl shadow-xl p-8">

                <h2 className="text-2xl font-bold mb-6">
                  📈 Missing Values
                </h2>

                <MissingValuesChart eda={eda} />

              </div>

            </div>

            {/* AI Chat */}

            <section className="mt-10">

              <AIChat
                dataset={dataset}
                eda={eda}
                healthScore={healthScore}
              />

            </section>

          </div>

        </div>

      </main>

    </>
  );
}