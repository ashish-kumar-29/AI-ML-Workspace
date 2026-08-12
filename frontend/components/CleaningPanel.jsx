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

  // Stores the cleaned CSV returned by backend
  const [cleanedFile, setCleanedFile] = useState(null);

  // Stores cleaning statistics
  const [cleaningResult, setCleaningResult] = useState(null);


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

    // ----------------------------------------------------------
    // MISSING VALUES
    // ----------------------------------------------------------

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


    // ----------------------------------------------------------
    // OUTLIERS
    // ----------------------------------------------------------

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


    // ----------------------------------------------------------
    // INVALID VALUES
    // ----------------------------------------------------------

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


    // ----------------------------------------------------------
    // DUPLICATE ROWS
    // ----------------------------------------------------------

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


    // ----------------------------------------------------------
    // MISSING VALUES
    // ----------------------------------------------------------

    const missingAnalysis =
      eda?.missing_analysis || {};

    Object.entries(
      missingAnalysis
    ).forEach(
      ([column, info]) => {

        if (
          info?.missing_count > 0
        ) {

          issues.push({
            column,
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


    // ----------------------------------------------------------
    // DUPLICATE ROWS
    // ----------------------------------------------------------

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
        severity:
          getSeverity(
            duplicateAnalysis.duplicate_percent
          ),
      });
    }


    // ----------------------------------------------------------
    // OUTLIERS
    // ----------------------------------------------------------

    const outlierAnalysis =
      eda?.outlier_analysis || {};

    Object.entries(
      outlierAnalysis
    ).forEach(
      ([column, info]) => {

        if (
          info?.outliers_count > 0
        ) {

          issues.push({
            column,
            problem: "Outliers",
            count:
              info.outliers_count,
            percent: 0,
            severity: "Medium",
          });
        }
      }
    );


    // ----------------------------------------------------------
    // INVALID VALUES
    // ----------------------------------------------------------

    const invalidAnalysis =
      eda?.invalid_value_analysis || {};

    Object.entries(
      invalidAnalysis
    ).forEach(
      ([column, info]) => {

        if (
          info?.invalid_count > 0
        ) {

          issues.push({
            column,
            problem: "Invalid Values",
            count:
              info.invalid_count,
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
  // FIND AI RECOMMENDATION
  // ============================================================

  const getAIRecommendation = (issue) => {

    if (
      !Array.isArray(aiRecommendations)
    ) {
      return null;
    }

    return aiRecommendations.find(
      (recommendation) => {

        if (
          recommendation?.column !==
          issue.column
        ) {
          return false;
        }

        const recommendationProblem =
          String(
            recommendation?.problem || ""
          )
            .trim()
            .toLowerCase();

        const issueProblem =
          String(
            issue?.problem || ""
          )
            .trim()
            .toLowerCase();

        if (
          recommendationProblem ===
          issueProblem
        ) {
          return true;
        }

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
  // GET SELECTED METHOD
  // ============================================================

  const getSelectedMethod = (
    index,
    issue
  ) => {

    const selected =
      operations.find(
        (operation) =>
          operation.issueIndex === index
      );

    if (selected) {
      return selected.method;
    }

    const aiRecommendation =
      getAIRecommendation(issue);

    return (
      aiRecommendation?.recommended_method ||
      ""
    );
  };


  // ============================================================
  // USE AI RECOMMENDATION
  // ============================================================

  const handleAIRecommendation = (
    index,
    issue
  ) => {

    const recommendation =
      getAIRecommendation(issue);

    if (
      !recommendation?.recommended_method
    ) {

      alert(
        "AI recommendation is not available."
      );

      return;
    }

    addOrUpdateOperation(
      index,
      issue,
      recommendation.recommended_method
    );
  };


  // ============================================================
  // ADD / UPDATE OPERATION
  // ============================================================

  const addOrUpdateOperation = (
    index,
    issue,
    method
  ) => {

    if (!method) {

      alert(
        "Please select a cleaning method."
      );

      return;
    }


    const availableMethods =
      getMethods(
        issue.problem,
        issue.column
      );

    const validMethod =
      availableMethods.some(
        (item) =>
          item.value === method
      );

    if (!validMethod) {

      alert(
        "Selected cleaning method is not valid for this issue."
      );

      return;
    }


    setOperations(
      (previous) => {

        const existingIndex =
          previous.findIndex(
            (operation) =>
              operation.issueIndex ===
              index
          );


        const newOperation = {

          issueIndex:
            index,

          column:
            issue.column,

          problem:
            issue.problem,

          method:
            method,
        };


        if (
          existingIndex === -1
        ) {

          return [
            ...previous,
            newOperation,
          ];
        }


        const updated =
          [...previous];

        updated[
          existingIndex
        ] = newOperation;

        return updated;
      }
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


    // Remove frontend-only issueIndex
    // before sending operations.

    const backendOperations =
      operations.map(
        ({
          issueIndex,
          ...operation
        }) => operation
      );


    formData.append(
      "operations",
      JSON.stringify(
        backendOperations
      )
    );


    try {

      setLoading(true);

      // Clear previous download
      setCleanedFile(null);

      setCleaningResult(null);


      console.log(
        "Sending cleaning request..."
      );

      console.log(
        "Operations:",
        backendOperations
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
      // GET CLEANED CSV BLOB
      // ========================================================

      const blob =
        await response.blob();


      // ========================================================
      // STORE CLEANED FILE
      // ========================================================

      setCleanedFile(
        blob
      );


      // ========================================================
      // READ STATISTICS FROM HEADERS
      // ========================================================

      const originalRows =
        Number(
          response.headers.get(
            "X-Original-Rows"
          )
        );

      const cleanedRows =
        Number(
          response.headers.get(
            "X-Cleaned-Rows"
          )
        );

      const originalColumns =
        Number(
          response.headers.get(
            "X-Original-Columns"
          )
        );

      const cleanedColumns =
        Number(
          response.headers.get(
            "X-Cleaned-Columns"
          )
        );


      const contentDisposition =
        response.headers.get(
          "Content-Disposition"
        );


      // ========================================================
      // GET DOWNLOAD FILENAME
      // ========================================================

      let filename =
        "cleaned_dataset.csv";


      if (
        contentDisposition
      ) {

        const match =
          contentDisposition.match(
            /filename="?([^"]+)"?/
          );


        if (match?.[1]) {

          filename =
            match[1];

        }
      }


      // ========================================================
      // STORE RESULT
      // ========================================================

      const result = {

        message:
          "Dataset cleaned successfully.",

        original_rows:
          originalRows,

        cleaned_rows:
          cleanedRows,

        original_columns:
          originalColumns,

        cleaned_columns:
          cleanedColumns,

        filename:
          filename,
      };


      setCleaningResult(
        result
      );


      console.log(
        "Cleaning completed:",
        result
      );


      // ========================================================
      // SEND RESULT TO PAGE
      // ========================================================

      if (onCleaned) {

        onCleaned(
          result
        );
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
  // DOWNLOAD CLEANED DATASET
  // ============================================================

  const handleDownload = () => {

    if (!cleanedFile) {

      alert(
        "No cleaned dataset is available."
      );

      return;
    }


    const url =
      window.URL.createObjectURL(
        cleanedFile
      );


    const link =
      document.createElement(
        "a"
      );


    link.href =
      url;


    link.download =
      cleaningResult?.filename ||
      "cleaned_dataset.csv";


    document.body.appendChild(
      link
    );


    link.click();


    link.remove();


    window.URL.revokeObjectURL(
      url
    );
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
  // BUILD ISSUES
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
          AI STATUS
      ====================================================== */}

      {Array.isArray(aiRecommendations) &&
        aiRecommendations.length > 0 && (

        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-5">

          <div className="flex items-center gap-2">

            <span className="text-xl">
              🤖
            </span>

            <h3 className="font-bold text-blue-800">
              AI Recommendations Available
            </h3>

          </div>

          <p className="text-sm text-blue-700 mt-2">
            AI recommendations are highlighted for each
            detected issue. You can accept the recommendation
            or choose another available cleaning method.
          </p>

        </div>
      )}


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
          ISSUES
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
                key={
                  `${issue.column}-${issue.problem}-${index}`
                }
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
                    AI RECOMMENDATION
                ================================================= */}

                {aiRecommendation && (

                  <div className="mt-5 bg-blue-50 border-2 border-blue-300 rounded-xl p-5">

                    <div className="flex items-center justify-between gap-4">

                      <h4 className="font-bold text-blue-800 flex items-center gap-2">

                        <span>
                          🤖
                        </span>

                        AI Recommended Method

                      </h4>


                      <span className="text-sm font-bold text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200">

                        {
                          aiRecommendation
                            .recommended_method
                        }

                      </span>

                    </div>


                    {aiRecommendation.Recommendation && (

                      <p className="mt-3 text-gray-800 font-semibold">

                        {
                          aiRecommendation
                            .Recommendation
                        }

                      </p>
                    )}


                    {aiRecommendation.Reason && (

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
                    )}


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


                    <button
                      onClick={() =>
                        handleAIRecommendation(
                          index,
                          issue
                        )
                        
                      }
                      className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Use AI Recommendation
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
                        addOrUpdateOperation(
                          index,
                          issue,
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
                                ? " — AI Recommended"
                                : ""
                            }

                          </option>
                        )
                      )}

                    </select>


                    {/* =================================================
                        OPERATION STATUS
                    ================================================= */}

                    {selectedMethod && (

                      <p className="mt-2 text-sm text-green-700">
                        Selected:{" "}
                        <span className="font-semibold">
                          {selectedMethod}
                        </span>
                      </p>

                    )}

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


      {/* ======================================================
          CLEANING RESULT
      ====================================================== */}

      {cleaningResult && (

        <div className="mt-8 bg-green-50 border border-green-300 rounded-xl p-6">

          <h3 className="text-xl font-bold text-green-700">
            Cleaning Completed Successfully
          </h3>


          <p className="text-gray-700 mt-2">
            Dataset cleaned successfully.
          </p>


          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">


            {/* ORIGINAL ROWS */}

            <div className="bg-white rounded-lg p-4 border">

              <p className="text-sm text-gray-500">
                Original Rows
              </p>

              <p className="text-xl font-bold">
                {cleaningResult.original_rows}
              </p>

            </div>


            {/* CLEANED ROWS */}

            <div className="bg-white rounded-lg p-4 border">

              <p className="text-sm text-gray-500">
                Cleaned Rows
              </p>

              <p className="text-xl font-bold">
                {cleaningResult.cleaned_rows}
              </p>

            </div>


            {/* ORIGINAL COLUMNS */}

            <div className="bg-white rounded-lg p-4 border">

              <p className="text-sm text-gray-500">
                Original Columns
              </p>

              <p className="text-xl font-bold">
                {cleaningResult.original_columns}
              </p>

            </div>


            {/* CLEANED COLUMNS */}

            <div className="bg-white rounded-lg p-4 border">

              <p className="text-sm text-gray-500">
                Cleaned Columns
              </p>

              <p className="text-xl font-bold">
                {cleaningResult.cleaned_columns}
              </p>

            </div>

          </div>


          {/* ====================================================
              DOWNLOAD
          ==================================================== */}

          <button
            onClick={
              handleDownload
            }
            disabled={
              !cleanedFile
            }
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >

            ⬇ Download Cleaned Dataset

          </button>


          <p className="text-sm text-gray-500 mt-2">
            Your cleaned dataset will be downloaded as a CSV file.
          </p>

        </div>
      )}

    </div>
  );
}