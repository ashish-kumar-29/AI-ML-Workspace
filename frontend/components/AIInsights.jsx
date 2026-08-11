"use client";

import { useState } from "react";

export default function AIInsights({
  data,
  loading,
  error,
  onGenerate,
}) {
  const [showPrompt, setShowPrompt] = useState(false);

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="mt-8 bg-white rounded-2xl shadow-xl p-12 text-center border">

        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-6"></div>

        <h2 className="text-2xl font-bold text-gray-800">
          Analyzing Dataset with AI...
        </h2>

        <p className="text-gray-500 mt-2">
          Gemini is generating recommendations based on the
          detected data-quality issues.
        </p>

        <p className="text-xs text-gray-400 mt-4">
          Please wait. Do not refresh the page.
        </p>

      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 text-center border-l-4 border-red-500">

        <div className="text-5xl mb-4">
          ⚠️
        </div>

        <h2 className="text-2xl font-bold text-red-600">
          AI Analysis Failed
        </h2>

        <p className="text-gray-600 mt-3">
          {error}
        </p>

        {onGenerate && (
          <button
            onClick={onGenerate}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        )}

      </div>
    );
  }

  // ============================================================
  // NO AI RESULT YET
  // ============================================================

  if (!data) {
    return (
      <div className="mt-8 bg-white rounded-2xl shadow-xl p-10 text-center border">

        <div className="text-6xl mb-5">
          🤖
        </div>

        <h2 className="text-3xl font-bold text-gray-800">
          AI Dataset Insights
        </h2>

        <p className="text-gray-500 mt-3 max-w-xl mx-auto">
          Your dataset has already been analyzed using automated
          EDA techniques. Generate AI recommendations to understand
          the detected problems and possible solutions.
        </p>

        <button
          onClick={onGenerate}
          disabled={!onGenerate}
          className="mt-7 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ✨ Generate AI Recommendations
        </button>

        <p className="text-xs text-gray-400 mt-4">
          Gemini will be called only when you click this button.
        </p>

      </div>
    );
  }

  // ============================================================
  // DATA
  // ============================================================

  const {
    summary,
    score,
    prompt,
    recommendations,
  } = data;

  // ============================================================
  // SCORE COLOR
  // ============================================================

  const getScoreColor = (s) => {

    if (s >= 80) {
      return "text-emerald-600";
    }

    if (s >= 60) {
      return "text-amber-600";
    }

    return "text-rose-600";
  };

  // ============================================================
  // SEVERITY BADGE
  // ============================================================

  const getSeverityBadge = (severity) => {

    switch (severity?.toLowerCase()) {

      case "critical":

        return (
          <span className="bg-rose-100 text-rose-700 font-semibold px-3 py-1 rounded-full text-xs uppercase border border-rose-300">
            Critical
          </span>
        );

      case "high":

        return (
          <span className="bg-orange-100 text-orange-700 font-semibold px-3 py-1 rounded-full text-xs uppercase border border-orange-300">
            High
          </span>
        );

      case "medium":

        return (
          <span className="bg-amber-100 text-amber-700 font-semibold px-3 py-1 rounded-full text-xs uppercase border border-amber-300">
            Medium
          </span>
        );

      case "low":

      default:

        return (
          <span className="bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-full text-xs uppercase border border-blue-300">
            Low
          </span>
        );
    }
  };

  // ============================================================
  // NORMALIZE GEMINI RESPONSE
  // ============================================================

  const recList = Array.isArray(recommendations)
    ? recommendations
    : recommendations?.recommendations || [];

  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <div className="mt-8 space-y-8 w-full max-w-5xl">

      {/* ========================================================
          HEADER + HEALTH SCORE
      ======================================================== */}

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">

        <div>

          <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            AI-Powered Analysis
          </span>

          <h2 className="text-3xl font-bold mt-3">
            Dataset Health Insights
          </h2>

          <p className="text-blue-100 mt-2">
            Automated data-quality analysis with AI-powered recommendations.
          </p>

        </div>

        <div className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 bg-white text-center shadow-lg min-w-[160px]">

          <p className="text-xs uppercase font-bold text-gray-500 tracking-wider">
            Health Score
          </p>

          <div
            className={`text-5xl font-black mt-1 ${getScoreColor(score)}`}
          >
            {score !== undefined ? score : "N/A"}
          </div>

          <p className="text-xs text-gray-400 mt-1">
            out of 100
          </p>

        </div>

      </div>

      {/* ========================================================
          DATASET SUMMARY
      ======================================================== */}

      {summary?.metadata && (

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

          <div className="bg-white rounded-xl shadow p-4 text-center border">

            <p className="text-xs text-gray-500 uppercase font-medium">
              Rows
            </p>

            <p className="text-2xl font-bold text-gray-800 mt-1">
              {summary.metadata.rows}
            </p>

          </div>

          <div className="bg-white rounded-xl shadow p-4 text-center border">

            <p className="text-xs text-gray-500 uppercase font-medium">
              Columns
            </p>

            <p className="text-2xl font-bold text-gray-800 mt-1">
              {summary.metadata.columns}
            </p>

          </div>

          <div className="bg-white rounded-xl shadow p-4 text-center border">

            <p className="text-xs text-gray-500 uppercase font-medium">
              Numeric
            </p>

            <p className="text-2xl font-bold text-blue-600 mt-1">
              {summary.metadata.numeric_columns}
            </p>

          </div>

          <div className="bg-white rounded-xl shadow p-4 text-center border">

            <p className="text-xs text-gray-500 uppercase font-medium">
              Categorical
            </p>

            <p className="text-2xl font-bold text-purple-600 mt-1">
              {summary.metadata.categorical_columns}
            </p>

          </div>

          <div className="bg-white rounded-xl shadow p-4 text-center border">

            <p className="text-xs text-gray-500 uppercase font-medium">
              Issues
            </p>

            <p className="text-2xl font-bold text-rose-600 mt-1">
              {summary.issues?.length || 0}
            </p>

          </div>

        </div>

      )}

      {/* ========================================================
          DETECTED ISSUES
      ======================================================== */}

      <div className="bg-white rounded-2xl shadow-xl p-8 border">

        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span>🔍</span>
          Detected Data Issues
        </h3>

        {summary?.issues && summary.issues.length > 0 ? (

          <div className="overflow-x-auto">

            <table className="w-full text-left border-collapse">

              <thead>

                <tr className="border-b bg-gray-50 text-gray-600 text-sm">

                  <th className="py-3 px-4 font-semibold">
                    Column
                  </th>

                  <th className="py-3 px-4 font-semibold">
                    Problem
                  </th>

                  <th className="py-3 px-4 font-semibold">
                    Count
                  </th>

                  <th className="py-3 px-4 font-semibold">
                    Severity
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y text-gray-700 text-sm">

                {summary.issues.map((issue, idx) => (

                  <tr
                    key={idx}
                    className="hover:bg-gray-50 transition"
                  >

                    <td className="py-3 px-4 font-mono font-medium text-blue-600">
                      {issue.column}
                    </td>

                    <td className="py-3 px-4">
                      {issue.problem}
                    </td>

                    <td className="py-3 px-4 font-semibold">
                      {issue.count}
                    </td>

                    <td className="py-3 px-4">
                      {getSeverityBadge(issue.severity)}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        ) : (

          <p className="text-gray-500 italic">
            No major data quality issues detected!
          </p>

        )}

      </div>

      {/* ========================================================
          GEMINI RECOMMENDATIONS
      ======================================================== */}

      <div className="bg-white rounded-2xl shadow-xl p-8 border">

        <div className="flex items-center justify-between mb-6">

          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span>✨</span>
            Gemini AI Recommendations
          </h3>

          {/* IMPORTANT:
              No automatic refresh button.
              User explicitly generates AI.
          */}

        </div>

        {/* Gemini Error */}

        {recommendations?.error ? (

          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">

            <p className="text-amber-800 font-medium">
              Gemini Service Notice
            </p>

            <p className="text-amber-700 text-sm mt-1">
              {recommendations.error}
            </p>

          </div>

        ) : recList.length > 0 ? (

          <div className="space-y-4">

            {recList.map((rec, idx) => (

              <div
                key={idx}
                className="p-5 rounded-xl border bg-gradient-to-br from-gray-50 to-white hover:shadow-md transition space-y-2"
              >

                <div className="flex items-start">

                  <h4 className="font-bold text-gray-900 flex items-center gap-2">

                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded">
                      Step {idx + 1}
                    </span>

                    {rec.Recommendation ||
                      rec.recommendation ||
                      `Recommendation ${idx + 1}`}

                  </h4>

                </div>

                {(rec.Reason || rec.reason) && (

                  <p className="text-sm text-gray-700">

                    <span className="font-semibold text-gray-900">
                      Reason:
                    </span>{" "}

                    {rec.Reason || rec.reason}

                  </p>

                )}

                {(rec.Alternative || rec.alternative) && (

                  <p className="text-sm text-gray-500">

                    <span className="font-semibold text-gray-700">
                      Alternative:
                    </span>{" "}

                    {rec.Alternative || rec.alternative}

                  </p>

                )}

              </div>

            ))}

          </div>

        ) : recommendations?.raw_response ? (

          <div className="bg-gray-50 p-6 rounded-xl border whitespace-pre-wrap text-gray-800">
            {recommendations.raw_response}
          </div>

        ) : (

          <div className="bg-gray-50 p-6 rounded-xl border text-gray-600 text-sm">
            Gemini did not return any recommendations.
          </div>

        )}

      </div>

      {/* ========================================================
          PROMPT
      ======================================================== */}

      {prompt && (

        <div className="bg-white rounded-2xl shadow-md p-6 border">

          <button
            onClick={() => setShowPrompt(!showPrompt)}
            className="w-full flex items-center justify-between text-left font-semibold text-gray-700 hover:text-blue-600 transition"
          >

            <span className="flex items-center gap-2">
              <span>📜</span>
              View Generated AI Prompt
            </span>

            <span>
              {showPrompt ? "▲ Hide" : "▼ Show"}
            </span>

          </button>

          {showPrompt && (

            <pre className="mt-4 p-4 bg-gray-900 text-gray-100 text-xs rounded-xl overflow-x-auto whitespace-pre-wrap font-mono">
              {prompt}
            </pre>

          )}

        </div>

      )}

    </div>
  );
}