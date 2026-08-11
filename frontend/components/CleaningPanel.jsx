"use client";

import { useState } from "react";

export default function CleaningPanel({
  file,
  eda,
  aiRecommendations,
  onCleaned,
}) {
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMethods, setSelectedMethods] = useState({});

  // ============================================================
  // CHECK NUMERICAL COLUMN
  // ============================================================

  const isNumericalColumn = (column) => {
    const dtype =
      eda?.column_summary?.[column]?.dtype || "";

    return (
      dtype.startsWith("int") ||
      dtype.startsWith("float")
    );
  };

  // ============================================================
  // GET AVAILABLE CLEANING METHODS
  // ============================================================

  const getMethods = (problem, column) => {
    // ==========================================================
    // MISSING VALUES
    // ==========================================================

    if (problem === "Missing Values") {
      const methods = [];

      if (isNumericalColumn(column)) {
        methods.push({
          value: "mean",
          label: "Fill with Mean",
        });

        methods.push({
          value: "median",
          label: "Fill with Median",
        });
      }

      methods.push({
        value: "mode",
        label: "Fill with Mode",
      });

      methods.push({
        value: "drop_rows",
        label: "Drop Rows",
      });

      methods.push({
        value: "drop_column",
        label: "Drop Column",
      });

      return methods;
    }

    // ==========================================================
    // OUTLIERS
    // ==========================================================

    if (problem === "Outliers") {
      return [
        {
          value: "remove_outliers",
          label: "Remove Outliers",
        },

        {
          value: "cap_outliers",
          label: "Cap Outliers",
        },
      ];
    }

    // ==========================================================
    // INVALID VALUES
    // ==========================================================

    if (problem === "Invalid Values") {
      return [
        {
          value: "replace_with_mode",
          label: "Replace with Mode",
        },

        {
          value: "replace_with_nan",
          label: "Replace with Missing Value",
        },

        {
          value: "drop_rows",
          label: "Drop Rows",
        },
      ];
    }

    // ==========================================================
    // DUPLICATE ROWS
    // ==========================================================

    if (problem === "Duplicate Rows") {
      return [
        {
          value: "drop_duplicates",
          label: "Remove Duplicate Rows",
        },
      ];
    }

    return [];
  };

  // ============================================================
  // BUILD ISSUES FROM EDA
  // ============================================================

  const buildIssues = () => {
    const issues = [];

    // ==========================================================
    // MISSING VALUES
    // ==========================================================

    const missingAnalysis =
      eda?.missing_analysis || {};

    Object.entries(missingAnalysis).forEach(
      ([column, info]) => {
        if (info?.missing_count > 0) {
          issues.push({
            column: column,
            problem: "Missing Values",
            count: info.missing_count,
            percent: info.missing_percent,
            severity: getSeverity(
              info.missing_percent
            ),
          });
        }
      }
    );

    // ==========================================================
    // DUPLICATE ROWS
    // ==========================================================

    const duplicateAnalysis =
      eda?.duplicate_analysis || {};

    if (
      duplicateAnalysis?.duplicate_count > 0
    ) {
      issues.push({
        column: "Dataset",
        problem: "Duplicate Rows",
        count:
          duplicateAnalysis.duplicate_count,
        percent:
          duplicateAnalysis.duplicate_percent,
        severity: getSeverity(
          duplicateAnalysis.duplicate_percent
        ),
      });
    }

    // ==========================================================
    // OUTLIERS
    // ==========================================================

    const outlierAnalysis =
      eda?.outlier_analysis || {};

    Object.entries(outlierAnalysis).forEach(
      ([column, info]) => {
        if (info?.outliers_count > 0) {
          issues.push({
            column: column,
            problem: "Outliers",
            count: info.outliers_count,
            percent: 0,
            severity: "Medium",
          });
        }
      }
    );

    // ==========================================================
    // INVALID VALUES
    // ==========================================================

    const invalidAnalysis =
      eda?.invalid_value_analysis || {};

    Object.entries(invalidAnalysis).forEach(
      ([column, info]) => {
        if (info?.invalid_count > 0) {
          issues.push({
            column: column,
            problem: "Invalid Values",
            count: info.invalid_count,
            percent: 0,
            severity: "Low",
          });
        }
      }
    );

    return issues;
  };

  // ============================================================
  // SEVERITY
  // ============================================================

  const getSeverity = (percent) => {
    if (percent >= 70) {
      return "Critical";
    }

    if (percent >= 30) {
      return "High";
    }

    if (percent >= 10) {
      return "Medium";
    }

    if (percent > 0) {
      return "Low";
    }

    return "None";
  };

  // ============================================================
  // FIND GEMINI RECOMMENDATION
  // ============================================================

  const getAIRecommendation = (issue) => {
    if (!Array.isArray(aiRecommendations)) {
      return null;
    }

    return aiRecommendations.find(
      (recommendation) => {
        // ------------------------------------------------------
        // COLUMN MUST MATCH
        // ------------------------------------------------------

        if (
          recommendation?.column !==
          issue.column
        ) {
          return false;
        }

        const recommendationProblem =
          String(
            recommendation?.problem || ""
          ).toLowerCase();

        const issueProblem =
          String(
            issue?.problem || ""
          ).toLowerCase();

        // ------------------------------------------------------
        // NORMAL MATCH
        // ------------------------------------------------------

        if (
          recommendationProblem ===
          issueProblem
        ) {
          return true;
        }

        // ------------------------------------------------------
        // HANDLE:
        //
        // Gemini:
        // "SibSp Outliers"
        //
        // EDA:
        // "Outliers"
        // ------------------------------------------------------

        if (
          issue.problem === "Outliers" &&
          recommendationProblem.includes(
            "outlier"
          )
        ) {
          return true;
        }

        return false;
      }
    );
  };

  // ============================================================
  // GET CURRENT SELECTED METHOD
  // ============================================================

  const getSelectedMethod = (
    index,
    issue
  ) => {
    const aiRecommendation =
      getAIRecommendation(issue);

    // User's manually selected method
    // has priority.

    if (
      selectedMethods[index]
    ) {
      return selectedMethods[index];
    }

    // Otherwise use Gemini recommendation
    // as the default selected method.

    return (
      aiRecommendation
        ?.recommended_method || ""
    );
  };

  // ============================================================
  // SELECT METHOD
  // ============================================================

  const selectMethod = (
    index,
    method
  ) => {
    setSelectedMethods(
      (previous) => ({
        ...previous,
        [index]: method,
      })
    );
  };

  // ============================================================
  // USE GEMINI RECOMMENDATION
  //
  // IMPORTANT:
  // THIS DOES NOT CALL GEMINI.
  //
  // It only uses the recommendation that was
  // already returned by /ai-insights.
  // ============================================================

  function useAIRecommendation(index, issue) {

  const recommendation =
    getAIRecommendation(issue);

  if (!recommendation?.recommended_method) {
    alert("Gemini recommendation is not available.");
    return;
  }

  setSelectedMethods((prev) => ({
    ...prev,
    [index]: recommendation.recommended_method,
  }));
}

  // ============================================================
  // ADD OPERATION
  // ============================================================

  const addOperation = (
    index,
    issue
  ) => {
    const method =
      getSelectedMethod(
        index,
        issue
      );

    if (!method) {
      alert(
        "Please select a cleaning method."
      );

      return;
    }

    // ----------------------------------------------------------
    // PREVENT DUPLICATE OPERATION
    // ----------------------------------------------------------

    const alreadyExists =
      operations.some(
        (operation) =>
          operation.column ===
            issue.column &&
          operation.problem ===
            issue.problem
      );

    if (alreadyExists) {
      alert(
        "A cleaning operation for this issue is already selected."
      );

      return;
    }

    // ----------------------------------------------------------
    // ADD OPERATION
    // ----------------------------------------------------------

    setOperations(
      (previous) => [
        ...previous,

        {
          column:
            issue.column,

          problem:
            issue.problem,

          method: method,
        },
      ]
    );
  };

  // ============================================================
  // REMOVE OPERATION
  // ============================================================

  const removeOperation = (
    operationIndex
  ) => {
    setOperations(
      (previous) =>
        previous.filter(
          (_, index) =>
            index !==
            operationIndex
        )
    );
  };

  // ============================================================
  // CLEAN DATASET
  // ============================================================

  const handleClean = async () => {
    if (!file) {
      alert(
        "Please upload a CSV dataset first."
      );

      return;
    }

    if (
      operations.length === 0
    ) {
      alert(
        "Select at least one cleaning operation."
      );

      return;
    }

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    formData.append(
      "operations",
      JSON.stringify(
        operations
      )
    );

    try {
      setLoading(true);

      console.log(
        "Sending cleaning request..."
      );

      console.log(
        "Operations:",
        operations
      );

      // ========================================================
      // CALL BACKEND
      // ========================================================

      const response =
        await fetch(
          "http://127.0.0.1:8000/clean",
          {
            method: "POST",
            body: formData,
          }
        );

      // ========================================================
      // HANDLE ERROR
      // ========================================================

      if (!response.ok) {
        let message =
          "Cleaning failed.";

        try {
          const errorData =
            await response.json();

          message =
            errorData?.detail ||
            message;
        } catch {
          // Response was not JSON
        }

        throw new Error(
          message
        );
      }

      // ========================================================
      // READ RESPONSE
      // ========================================================

      const data =
        await response.json();

      console.log(
        "Cleaning Response:",
        data
      );

      // ========================================================
      // SEND RESULT TO PAGE
      // ========================================================

      if (onCleaned) {
        onCleaned(data);
      }

    } catch (error) {
      console.error(
        "Cleaning failed:",
        error
      );

      alert(
        error?.message ||
        "Cleaning failed."
      );

    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // NO EDA
  // ============================================================

  if (!eda) {
    return (
      <div className="mt-10 bg-white rounded-2xl shadow-xl p-8">

        <h2 className="text-3xl font-bold text-blue-600 mb-6">
          Data Cleaning
        </h2>

        <p className="text-gray-600">
          EDA analysis is not available yet.
          Please upload the dataset again.
        </p>

      </div>
    );
  }

  // ============================================================
  // BUILD ALL EDA ISSUES
  // ============================================================

  const issues =
    buildIssues();

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="mt-10 bg-white rounded-2xl shadow-xl p-8">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <h2 className="text-3xl font-bold text-blue-600 mb-6">
        Data Cleaning
      </h2>

      <p className="text-gray-600 mb-8">
        Review the issues detected by EDA and choose how you
        want to clean them.
      </p>

      {/* ======================================================
          NO ISSUES
      ====================================================== */}

      {issues.length === 0 && (
        <div className="bg-green-50 border border-green-300 rounded-xl p-5">

          <p className="font-semibold text-green-700">
            No cleaning issues were detected.
          </p>

        </div>
      )}

      {/* ======================================================
          ALL DETECTED ISSUES
      ====================================================== */}

      <div className="space-y-6">

        {issues.map(
          (issue, index) => {

            const methods =
              getMethods(
                issue.problem,
                issue.column
              );

            const aiRecommendation =
              getAIRecommendation(
                issue
              );

            const selectedMethod =
              getSelectedMethod(
                index,
                issue
              );

            return (
              <div
                key={`${issue.column}-${issue.problem}-${index}`}
                className="border rounded-xl p-5"
              >

                {/* =================================================
                    ISSUE INFORMATION
                ================================================= */}

                <div className="flex justify-between items-start">

                  <div>

                    <h3 className="text-xl font-bold text-gray-800">
                      {issue.column}
                    </h3>

                    <p className="text-gray-600 mt-1">
                      {issue.problem}
                    </p>

                  </div>

                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700">
                    {issue.severity}
                  </span>

                </div>

                {/* =================================================
                    ISSUE COUNT
                ================================================= */}

                <div className="mt-3 text-sm text-gray-600">

                  Count:

                  <span className="font-semibold ml-1">
                    {issue.count}
                  </span>

                  {issue.percent > 0 && (
                    <>
                      <span className="mx-2">
                        |
                      </span>

                      Percentage:

                      <span className="font-semibold ml-1">
                        {issue.percent}%
                      </span>
                    </>
                  )}

                </div>

                {/* =================================================
                    GEMINI RECOMMENDATION
                ================================================= */}

                {aiRecommendation && (
                  <div className="mt-5 bg-blue-50 border border-blue-300 rounded-xl p-5">

                    <div className="flex items-center justify-between">

                      <h4 className="font-bold text-blue-700">
                        🤖 Gemini Recommendation
                      </h4>

                      <span className="text-sm font-semibold text-blue-600">
                        {
                          aiRecommendation
                            .recommended_method
                        }
                      </span>

                    </div>

                    <p className="mt-3 text-gray-800 font-semibold">
                      {
                        aiRecommendation
                          .Recommendation
                      }
                    </p>

                    <p className="mt-2 text-gray-600">

                      <span className="font-semibold">
                        Reason:
                      </span>

                      {" "}

                      {
                        aiRecommendation
                          .Reason
                      }

                    </p>

                    {aiRecommendation.Alternative && (
                      <p className="mt-2 text-gray-600">

                        <span className="font-semibold">
                          Alternative:
                        </span>

                        {" "}

                        {
                          aiRecommendation
                            .Alternative
                        }

                      </p>
                    )}

                    {/* =================================================
                        USE GEMINI BUTTON
                    ================================================= */}

                   <button
  onClick={() => {
    const recommendation = getAIRecommendation(issue);

    if (!recommendation?.recommended_method) {
      alert("Gemini recommendation is not available.");
      return;
    }

    setSelectedMethods((prev) => ({
      ...prev,
      [index]: recommendation.recommended_method,
    }));
  }}
  className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg"
>
  Use Gemini Recommendation
</button>

                  </div>
                )}

                {/* =================================================
                    AVAILABLE METHODS
                ================================================= */}

                {methods.length > 0 && (
                  <div className="mt-5">

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Choose Cleaning Method
                    </label>

                    <select
                      value={
                        selectedMethod
                      }
                      onChange={(event) =>
                        selectMethod(
                          index,
                          event.target.value
                        )
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white"
                    >

                      <option value="">
                        Select cleaning method
                      </option>

                      {methods.map(
                        (method) => (
                          <option
                            key={
                              method.value
                            }
                            value={
                              method.value
                            }
                          >
                            {method.label}

                            {
                              aiRecommendation
                                ?.recommended_method ===
                              method.value
                                ? " — Gemini Recommended"
                                : ""
                            }
                          </option>
                        )
                      )}

                    </select>

                    {/* =================================================
                        ADD OPERATION
                    ================================================= */}

                    <button
                      onClick={() =>
                        addOperation(
                          index,
                          issue
                        )
                      }
                      className="mt-3 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      Add Cleaning Operation
                    </button>

                  </div>
                )}

              </div>
            );
          }
        )}

      </div>

      {/* ======================================================
          SELECTED OPERATIONS
      ====================================================== */}

      {operations.length > 0 && (
        <div className="mt-8">

          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Selected Operations
          </h3>

          {operations.map(
            (operation, index) => (
              <div
                key={index}
                className="bg-gray-100 p-4 rounded-lg mb-3 flex justify-between items-center"
              >

                <div>

                  <span className="font-semibold">
                    {operation.column}
                  </span>

                  <span className="mx-2">
                    →
                  </span>

                  <span>
                    {operation.problem}
                  </span>

                  <span className="mx-2">
                    →
                  </span>

                  <span className="font-semibold">
                    {operation.method}
                  </span>

                </div>

                <button
                  onClick={() =>
                    removeOperation(
                      index
                    )
                  }
                  className="text-red-600 font-semibold hover:text-red-800"
                >
                  Remove
                </button>

              </div>
            )
          )}

        </div>
      )}

      {/* ======================================================
          APPLY CLEANING
      ====================================================== */}

      <button
        onClick={handleClean}
        disabled={
          loading ||
          operations.length === 0
        }
        className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition"
      >
        {loading
          ? "Cleaning..."
          : "Apply Cleaning"}
      </button>

    </div>
  );
}