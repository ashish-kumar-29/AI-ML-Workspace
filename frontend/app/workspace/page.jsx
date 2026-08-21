"use client";

import { useEffect, useState } from "react";

import FileUpload from "@/components/FileUpload";
import DatasetDetails from "@/components/DatasetInfo";
import PreviewTable from "@/components/PreviewTable";
import ColumnSummary from "@/components/ColumnSummary";
import MissingValues from "@/components/MissingValues";
import NumericalStatistics from "@/components/NumericalStatistics";
import CategoricalStatistics from "@/components/CategoricalStatistics";
import DuplicateAnalysis from "@/components/DuplicateAnalysis";
import InvalidValues from "@/components/InvalidValues";
import CorrelationAnalysis from "@/components/CorrelationAnalysis";
import OutlierAnalysis from "@/components/OutlierAnalysis";
import DistributionAnalysis from "@/components/DistributionAnalysis";
import KurtosisAnalysis from "@/components/KurtosisAnalysis";
import AIInsights from "@/components/AIInsights";
import CleaningPanel from "@/components/CleaningPanel";

import Sidebar from "@/components/Sidebar";

const WORKSPACE_STORAGE_KEY = "datamind_workspace_state";
const WORKSPACE_FILE_DB = "datamind_workspace_db";
const WORKSPACE_FILE_STORE = "files";
const WORKSPACE_FILE_KEY = "active_dataset_file";

function openWorkspaceFileDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      resolve(null);
      return;
    }

    const request = window.indexedDB.open(WORKSPACE_FILE_DB, 1);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(WORKSPACE_FILE_STORE)) {
        db.createObjectStore(WORKSPACE_FILE_STORE);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveWorkspaceFile(file) {
  const db = await openWorkspaceFileDB();

  if (!db || !file) return;

  await new Promise((resolve, reject) => {
    const transaction = db.transaction(
      WORKSPACE_FILE_STORE,
      "readwrite"
    );

    transaction.objectStore(WORKSPACE_FILE_STORE).put(
      file,
      WORKSPACE_FILE_KEY
    );

    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  });

  db.close();
}

async function restoreWorkspaceFile() {
  const db = await openWorkspaceFileDB();

  if (!db) return null;

  const file = await new Promise((resolve, reject) => {
    const transaction = db.transaction(
      WORKSPACE_FILE_STORE,
      "readonly"
    );

    const request = transaction
      .objectStore(WORKSPACE_FILE_STORE)
      .get(WORKSPACE_FILE_KEY);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });

  db.close();
  return file;
}

async function clearWorkspaceFile() {
  const db = await openWorkspaceFileDB();

  if (!db) return;

  await new Promise((resolve, reject) => {
    const transaction = db.transaction(
      WORKSPACE_FILE_STORE,
      "readwrite"
    );

    transaction.objectStore(WORKSPACE_FILE_STORE).delete(
      WORKSPACE_FILE_KEY
    );

    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  });

  db.close();
}


export default function Home() {

  // ============================================================
  // RESTORE WORKSPACE STATE
  // ============================================================

  useEffect(() => {
    let cancelled = false;

    async function restoreWorkspace() {
      try {
        const saved = sessionStorage.getItem(
          WORKSPACE_STORAGE_KEY
        );

        if (saved) {
          const state = JSON.parse(saved);

          if (!cancelled && state?.dataset) {
            setDataset(state.dataset);
          }

          if (!cancelled && state?.eda) {
            setEda(state.eda);
          }

          if (!cancelled && state?.aiInsights) {
            setAiInsights(state.aiInsights);
          }

          if (!cancelled && state?.cleaningResult) {
            setCleaningResult(state.cleaningResult);
          }

          if (!cancelled && state?.active) {
            setActive(state.active);
          }
        }

        // IMPORTANT:
        // sessionStorage cannot persist a browser File object.
        // Restore the original CSV from IndexedDB so existing
        // AI/Cleaning APIs can continue receiving the File.
        const savedFile = await restoreWorkspaceFile();

        if (!cancelled && savedFile) {
          setUploadedFile(savedFile);
        }
      } catch (error) {
        console.error(
          "Failed to restore workspace state:",
          error
        );
      }
    }

    restoreWorkspace();

    return () => {
      cancelled = true;
    };
  }, []);

  // ============================================================
  // DATASET
  // ============================================================

  const [dataset, setDataset] = useState(null);

  const [eda, setEda] = useState(null);

  // Keep original uploaded file
  // for AI insights and cleaning.
  const [uploadedFile, setUploadedFile] = useState(null);


  // ============================================================
  // AI
  // ============================================================

  const [aiInsights, setAiInsights] = useState(null);

  const [aiLoading, setAiLoading] = useState(false);

  const [aiError, setAiError] = useState(null);


  // ============================================================
  // AI RECOMMENDATIONS
  // ============================================================

  const aiRecommendations =
    aiInsights?.recommendations?.recommendations || [];


  // ============================================================
  // CLEANING
  // ============================================================

  const [cleaningResult, setCleaningResult] = useState(null);


  // ============================================================
  // SIDEBAR
  // ============================================================

  const [active, setActive] = useState("info");


  // ============================================================
  // PERSIST WORKSPACE STATE
  // ============================================================

  useEffect(() => {
    // Do not persist an empty workspace.
    if (!dataset) {
      return;
    }

    try {
      sessionStorage.setItem(
        WORKSPACE_STORAGE_KEY,
        JSON.stringify({
          dataset,
          eda,
          aiInsights,
          cleaningResult,
          active,
        })
      );
    } catch (error) {
      console.error(
        "Failed to save workspace state:",
        error
      );
    }
  }, [
    dataset,
    eda,
    aiInsights,
    cleaningResult,
    active,
  ]);


  // ============================================================
  // AI GENERATION
  // ============================================================

  const generateAI = async () => {

    if (aiLoading) {
      return;
    }

    if (!uploadedFile) {

      setAiError(
        "Please upload a CSV dataset first."
      );

      return;
    }

    try {

      setAiLoading(true);

      setAiError(null);

      const formData = new FormData();

      formData.append(
        "file",
        uploadedFile
      );

      const response = await fetch(
        "http://127.0.0.1:8000/ai-insights",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {

        let message =
          "Unable to generate AI insights.";

        try {

          const errorData =
            await response.json();

          message =
            errorData?.detail ||
            errorData?.message ||
            message;

        } catch {
          // Non-JSON response
        }

        throw new Error(message);
      }

      const result =
        await response.json();

      console.log(
        "AI Insights:",
        result
      );

      setAiInsights(
        result
      );

    } catch (error) {

      console.error(
        "AI generation failed:",
        error
      );

      setAiError(
        error?.message ||
        "Failed to generate AI insights."
      );

    } finally {

      setAiLoading(false);

    }
  };


  // ============================================================
  // FILE SELECTED
  // ============================================================

  const handleFileSelected = (file) => {

    console.log(
      "File selected:",
      file
    );

    setUploadedFile(file);

    // Persist the actual File separately. sessionStorage can
    // preserve the UI state, but it cannot preserve File objects.
    saveWorkspaceFile(file).catch((error) => {
      console.error(
        "Failed to persist uploaded dataset file:",
        error
      );
    });

    // A newly selected file represents a new workspace.
    // Clear the previous persisted workspace so old EDA/AI
    // results cannot appear for the new dataset.
    try {
      sessionStorage.removeItem(
        WORKSPACE_STORAGE_KEY
      );
    } catch (error) {
      console.error(
        "Failed to clear previous workspace state:",
        error
      );
    }

    // Clear previous AI result
    setAiInsights(null);

    setAiError(null);

    // Clear previous cleaning result
    setCleaningResult(null);

    // Clear old EDA
    setEda(null);

    // Reset sidebar
    setActive("info");
  };


  // ============================================================
  // UPLOAD SUCCESS
  // ============================================================

  const handleUploadSuccess = (data) => {

    console.log(
      "Upload successful:",
      data
    );

    setDataset(data);

    // New upload means old persisted workspace state
    // must not be reused.
    try {
      sessionStorage.removeItem(
        WORKSPACE_STORAGE_KEY
      );
    } catch (error) {
      console.error(
        "Failed to clear previous workspace state:",
        error
      );
    }

    // New upload means old EDA should not remain.
    setEda(null);

    setAiInsights(null);

    setAiError(null);

    setCleaningResult(null);

    setActive("info");
  };


  // ============================================================
  // EDA SUCCESS
  // ============================================================

  const handleEDASuccess = (data) => {

    console.log(
      "========================================"
    );

    console.log(
      "EDA RESPONSE RECEIVED:"
    );

    console.log(
      data
    );

    console.log(
      "EDA REPORT:"
    );

    console.log(
      data?.report
    );

    console.log(
      "========================================"
    );


    // ========================================================
    // IMPORTANT
    //
    // Backend response:
    //
    // {
    //   status: "success",
    //   dataset_id: "...",
    //   filename: "...",
    //   report: {
    //      basic_info: {...},
    //      column_summary: {...},
    //      missing_analysis: {...},
    //      numerical_statistics: {...},
    //      ...
    //   }
    // }
    //
    // Frontend components expect:
    //
    // eda.column_summary
    // eda.missing_analysis
    // eda.numerical_statistics
    //
    // Therefore store data.report.
    // ========================================================

    const report =
      data?.report || data;

    if (!report) {

      console.error(
        "EDA response did not contain a report."
      );

      setEda(null);

      return;
    }

    setEda(report);

    console.log(
      "EDA STATE SET TO:",
      report
    );
  };


  // ============================================================
  // CLEANING SUCCESS
  // ============================================================

  const handleCleaned = (data) => {

    console.log(
      "Cleaning successful:",
      data
    );

    setCleaningResult(data);
  };


  // ============================================================
  // HELPER
  // ============================================================

  const hasEDA = (
    eda &&
    typeof eda === "object"
  );


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <main className="min-h-screen bg-gray-100 flex">


      {/* ======================================================
          SIDEBAR
      ====================================================== */}

      <Sidebar
        active={active}
        setActive={setActive}
      />


      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="flex-1 ml-72 p-8">

        <div className="bg-white shadow-xl rounded-2xl p-10 w-full min-h-screen">


          {/* ==================================================
              UPLOAD PAGE
          ================================================== */}

          {!dataset ? (

            <>

              <h1 className="text-5xl font-bold text-blue-600">
                DataMind AI
              </h1>


              <p className="text-gray-600 mt-4 text-lg">
                Analyze your datasets with AI-powered insights
              </p>


              <div className="mt-10 border-2 border-dashed border-blue-400 rounded-xl p-12">

                <div className="text-6xl">
                  📂
                </div>


                <h2 className="text-3xl font-bold text-gray-800 mt-4">
                  Upload Dataset
                </h2>


                <p className="text-gray-600 mt-2">
                  Upload a CSV file to start analysis.
                </p>


                <FileUpload
                  onUploadSuccess={
                    handleUploadSuccess
                  }

                  onEDASuccess={
                    handleEDASuccess
                  }

                  onFileSelected={
                    handleFileSelected
                  }
                />

              </div>

            </>

          ) : (

            /* =================================================
               DATASET LOADED
            ================================================= */

            <>

              <div className="flex justify-between items-center border-b pb-5 mb-8">

                <div>

                  <h1 className="text-4xl font-bold text-blue-600">
                    DataMind AI
                  </h1>


                  <p className="text-gray-600 mt-2">

                    Dataset:

                    <span className="font-semibold ml-1">
                      {dataset.filename}
                    </span>

                  </p>

                </div>


                <FileUpload
                  onUploadSuccess={
                    handleUploadSuccess
                  }

                  onEDASuccess={
                    handleEDASuccess
                  }

                  onFileSelected={
                    handleFileSelected
                  }
                />

              </div>


              {/* =================================================
                 EDA NOT READY
              ================================================= */}

              {!hasEDA &&
                active !== "info" &&
                active !== "preview" &&
                active !== "cleaning" &&
                active !== "ai" && (

                  <div className="bg-yellow-50 border border-yellow-300 rounded-2xl p-8 text-center">

                    <h2 className="text-2xl font-bold text-yellow-700">
                      EDA data is not available yet
                    </h2>

                    <p className="text-gray-600 mt-3">
                      Please wait for EDA analysis to complete
                      after uploading the dataset.
                    </p>

                  </div>

                )}


              {/* =================================================
                 DATASET INFORMATION
              ================================================= */}

              {active === "info" && (

                <DatasetDetails
                  data={dataset}
                />

              )}


              {/* =================================================
                 DATASET PREVIEW
              ================================================= */}

              {active === "preview" && (

                <PreviewTable
                  data={dataset}
                />

              )}


              {/* =================================================
                 COLUMN SUMMARY
              ================================================= */}

              {active === "column" &&
                hasEDA && (

                  <ColumnSummary
                    data={
                      eda.column_summary || {}
                    }
                  />

                )}


              {/* =================================================
                 MISSING VALUES
              ================================================= */}

              {active === "missing" &&
                hasEDA && (

                  <MissingValues
                    data={
                      eda.missing_analysis || {}
                    }
                  />

                )}


              {/* =================================================
                 DUPLICATES
              ================================================= */}

              {active === "duplicate" &&
                hasEDA && (

                  <DuplicateAnalysis
                    data={
                      eda.duplicate_analysis || {}
                    }
                  />

                )}


              {/* =================================================
                 INVALID VALUES
              ================================================= */}

              {active === "invalid" &&
                hasEDA && (

                  <InvalidValues
                    data={
                      eda.invalid_value_analysis || {}
                    }
                  />

                )}


              {/* =================================================
                 NUMERICAL STATISTICS
              ================================================= */}

              {active === "numerical" &&
                hasEDA && (

                  <NumericalStatistics
                    data={
                      eda.numerical_statistics || {}
                    }
                  />

                )}


              {/* =================================================
                 CATEGORICAL STATISTICS
              ================================================= */}

              {active === "categorical" &&
                hasEDA && (

                  <CategoricalStatistics
                    data={
                      eda.categorical_statistics || {}
                    }
                  />

                )}


              {/* =================================================
                 CORRELATION
              ================================================= */}

              {active === "correlation" &&
                hasEDA && (

                  <CorrelationAnalysis
                    data={
                      eda.correlation_analysis || {}
                    }
                  />

                )}


              {/* =================================================
                 DISTRIBUTION
              ================================================= */}

              {active === "distribution" &&
                hasEDA && (

                  <DistributionAnalysis
                    data={
                      eda.distribution_analysis || {}
                    }
                  />

                )}


              {/* =================================================
                 KURTOSIS
              ================================================= */}

              {active === "kurtosis" &&
                hasEDA && (

                  <KurtosisAnalysis
                    data={
                      eda.kurtosis_analysis || {}
                    }
                  />

                )}


              {/* =================================================
                 OUTLIER
              ================================================= */}

              {active === "outlier" &&
                hasEDA && (

                  <OutlierAnalysis
                    data={
                      eda.outlier_analysis || {}
                    }
                  />

                )}


              {/* =================================================
                 DATA CLEANING
              ================================================= */}

              {active === "cleaning" && (

                <>

                  <CleaningPanel
                    file={uploadedFile}
                    eda={eda}
                    aiRecommendations={
                      aiRecommendations
                    }
                    onCleaned={
                      handleCleaned
                    }
                  />


                  {cleaningResult && (

                    <div className="mt-6 bg-green-50 border border-green-300 rounded-xl p-6">

                      <h3 className="text-xl font-bold text-green-700">
                        Cleaning Completed Successfully
                      </h3>


                      <p className="text-gray-700 mt-2">
                        {cleaningResult.message}
                      </p>


                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">


                        {/* Original Rows */}

                        <div className="bg-white rounded-lg p-4 border">

                          <p className="text-sm text-gray-500">
                            Original Rows
                          </p>

                          <p className="text-xl font-bold">
                            {cleaningResult.original_rows}
                          </p>

                        </div>


                        {/* Cleaned Rows */}

                        <div className="bg-white rounded-lg p-4 border">

                          <p className="text-sm text-gray-500">
                            Cleaned Rows
                          </p>

                          <p className="text-xl font-bold">
                            {cleaningResult.cleaned_rows}
                          </p>

                        </div>


                        {/* Original Columns */}

                        <div className="bg-white rounded-lg p-4 border">

                          <p className="text-sm text-gray-500">
                            Original Columns
                          </p>

                          <p className="text-xl font-bold">
                            {cleaningResult.original_columns}
                          </p>

                        </div>


                        {/* Cleaned Columns */}

                        <div className="bg-white rounded-lg p-4 border">

                          <p className="text-sm text-gray-500">
                            Cleaned Columns
                          </p>

                          <p className="text-xl font-bold">
                            {cleaningResult.cleaned_columns}
                          </p>

                        </div>

                      </div>

                    </div>

                  )}

                </>

              )}


              {/* =================================================
                 AI INSIGHTS
              ================================================= */}

              {active === "ai" && (

                <AIInsights
                  data={
                    aiInsights
                  }

                  loading={
                    aiLoading
                  }

                  error={
                    aiError
                  }

                  onGenerate={
                    generateAI
                  }
                />

              )}

            </>

          )}

        </div>

      </div>

    </main>

  );
}