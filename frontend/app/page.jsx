"use client";

import { useState } from "react";

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


export default function Home() {

  // ============================================================
  // DATASET
  // ============================================================

  const [dataset, setDataset] = useState(null);

  const [eda, setEda] = useState(null);

  // Keep original uploaded file
  // so Gemini and cleaning can be called later.
  const [uploadedFile, setUploadedFile] = useState(null);


  // ============================================================
  // AI
  // ============================================================

  const [aiInsights, setAiInsights] = useState(null);

  const [aiLoading, setAiLoading] = useState(false);

  const [aiError, setAiError] = useState(null);

  const aiRecommendations =
  aiInsights?.recommendations || [];


  // ============================================================
  // CLEANING
  // ============================================================

  const [cleaningResult, setCleaningResult] = useState(null);


  // ============================================================
  // SIDEBAR
  // ============================================================

  const [active, setActive] = useState("info");


  // ============================================================
  // AI GENERATION
  // ============================================================

  const generateAI = async () => {

    // Prevent duplicate requests
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


      // --------------------------------------------------------
      // Create multipart request
      // --------------------------------------------------------

      const formData =
        new FormData();

      formData.append(
        "file",
        uploadedFile
      );


      // --------------------------------------------------------
      // Call Gemini backend
      // --------------------------------------------------------

      const response =
        await fetch(
          "http://127.0.0.1:8000/ai-insights",
          {
            method: "POST",
            body: formData,
          }
        );


      // --------------------------------------------------------
      // Handle HTTP errors
      // --------------------------------------------------------

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

          // Response was not JSON

        }


        throw new Error(
          message
        );

      }


      // --------------------------------------------------------
      // Parse result
      // --------------------------------------------------------

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

  const handleFileSelected = (
    file
  ) => {

    setUploadedFile(
      file
    );


    // Clear old AI result

    setAiInsights(
      null
    );


    setAiError(
      null
    );


    // Clear old cleaning result

    setCleaningResult(
      null
    );

  };


  // ============================================================
  // UPLOAD SUCCESS
  // ============================================================

  const handleUploadSuccess = (
    data
  ) => {

    console.log(
      "Upload successful:",
      data
    );


    setDataset(
      data
    );

  };


  // ============================================================
  // EDA SUCCESS
  // ============================================================

  const handleEDASuccess = (
    data
  ) => {

    console.log(
      "EDA successful:",
      data
    );


    setEda(
      data
    );

  };


  // ============================================================
  // CLEANING SUCCESS
  // ============================================================

  const handleCleaned = (
    data
  ) => {

    console.log(
      "Cleaning successful:",
      data
    );


    setCleaningResult(
      data
    );

  };


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
          MAIN
      ====================================================== */}

      <div className="flex-1 ml-72 p-8">

        <div className="bg-white shadow-xl rounded-2xl p-10 w-full min-h-screen">


          {/* ==================================================
              UPLOAD PAGE
          ================================================== */}

          {!dataset ? (

            <>

              <h1 className="text-5xl font-bold text-blue-600">
                AI ML Workspace
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
                    AI ML Workspace
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
                 INFO
              ================================================= */}

              {active === "info" && (

                <DatasetDetails
                  data={dataset}
                />

              )}


              {/* =================================================
                 PREVIEW
              ================================================= */}

              {active === "preview" && (

                <PreviewTable
                  data={dataset}
                />

              )}


              {/* =================================================
                 COLUMN SUMMARY
              ================================================= */}

              {active === "column" && eda && (

                <ColumnSummary
                  data={
                    eda.column_summary
                  }
                />

              )}


              {/* =================================================
                 MISSING
              ================================================= */}

              {active === "missing" && eda && (

                <MissingValues
                  data={
                    eda.missing_analysis
                  }

                />

              )}


              {/* =================================================
                 DUPLICATES
              ================================================= */}

              {active === "duplicate" && eda && (

                <DuplicateAnalysis
                  data={
                    eda.duplicate_analysis
                  }

                />

              )}


              {/* =================================================
                 INVALID
              ================================================= */}

              {active === "invalid" && eda && (

                <InvalidValues
                  data={
                    eda.invalid_value_analysis
                  }

                />

              )}


              {/* =================================================
                 NUMERICAL
              ================================================= */}

              {active === "numerical" && eda && (

                <NumericalStatistics
                  data={
                    eda.numerical_statistics
                  }

                />

              )}


              {/* =================================================
                 CATEGORICAL
              ================================================= */}

              {active === "categorical" && eda && (

                <CategoricalStatistics
                  data={
                    eda.categorical_statistics
                  }

                />

              )}


              {/* =================================================
                 CORRELATION
              ================================================= */}

              {active === "correlation" && eda && (

                <CorrelationAnalysis
                  data={
                    eda.correlation_analysis
                  }

                />

              )}


              {/* =================================================
                 DISTRIBUTION
              ================================================= */}

              {active === "distribution" && eda && (

                <DistributionAnalysis
                  data={
                    eda.distribution_analysis
                  }

                />

              )}


              {/* =================================================
                 KURTOSIS
              ================================================= */}

              {active === "kurtosis" && eda && (

                <KurtosisAnalysis
                  data={
                    eda.kurtosis_analysis
                  }

                />

              )}


              {/* =================================================
                 OUTLIER
              ================================================= */}

              {active === "outlier" && eda && (

                <OutlierAnalysis
                  data={
                    eda.outlier_analysis
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
  aiRecommendations={aiRecommendations}
  onCleaned={handleCleaned}
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

                        <div className="bg-white rounded-lg p-4 border">
                          <p className="text-sm text-gray-500">
                            Original Rows
                          </p>

                          <p className="text-xl font-bold">
                            {cleaningResult.original_rows}
                          </p>
                        </div>


                        <div className="bg-white rounded-lg p-4 border">
                          <p className="text-sm text-gray-500">
                            Cleaned Rows
                          </p>

                          <p className="text-xl font-bold">
                            {cleaningResult.cleaned_rows}
                          </p>
                        </div>


                        <div className="bg-white rounded-lg p-4 border">
                          <p className="text-sm text-gray-500">
                            Original Columns
                          </p>

                          <p className="text-xl font-bold">
                            {cleaningResult.original_columns}
                          </p>
                        </div>


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