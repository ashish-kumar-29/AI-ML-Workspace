"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import DatasetDetails from "@/components/DatasetInfo";
import PreviewTable from "@/components/PreviewTable";
import EDASummary from "@/components/EDASummary";
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
import Sidebar from "@/components/Sidebar";


export default function Home() {
  const [dataset, setDataset] = useState(null);
  const [eda, setEda] = useState(null);
  const [active, setActive] = useState("info");

  return (
    <main className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar
        active={active}
        setActive={setActive}
      />
      <div className="flex-1 ml-72 p-8">
      {/* <div className="bg-white shadow-xl rounded-2xl p-10 w-[900px] text-center"> */}
      <div className = "bg-white shadow-xl rounded-2xl p-10 w-full min-h-screen">

        {!dataset ? (
  <>
    <h1 className="text-5xl font-bold text-blue-600">
      AI ML Workspace
    </h1>

    <p className="text-gray-600 mt-4 text-lg">
      Analyze your datasets with AI-powered insights
    </p>

    <div className="mt-10 border-2 border-dashed border-blue-400 rounded-xl p-12">
      <div className="text-6xl">📂</div>

      <h2 className="text-3xl font-bold text-gray-800 mt-4">
        Upload Dataset
      </h2>

      <p className="text-gray-600 mt-2">
        Drag & Drop your CSV file here
      </p>

      <FileUpload
        onUploadSuccess={setDataset}
        onEDASuccess={setEda}
      />
    </div>
  </>
) : (
  <div className="flex justify-between items-center border-b pb-5 mb-8">

    <div>
      <h1 className="text-4xl font-bold text-blue-600">
        AI ML Workspace
      </h1>

      <p className="text-gray-600 mt-2">
        Dataset: <span className="font-semibold">{dataset.filename}</span>
      </p>
    </div>

    <FileUpload
      onUploadSuccess={setDataset}
      onEDASuccess={setEda}
    />

  </div>
)}

        {/* {dataset && (
          <>
          <DatasetDetails data={dataset} />
          <PreviewTable data={dataset} />
          </>
        )}

        {eda && (
          <>
            <EDASummary data={eda}/>
            <ColumnSummary data={eda.column_summary} />
            <MissingValues data={eda.missing_analysis} />
            <NumericalStatistics data={eda.numerical_statistics} />
            <CategoricalStatistics data={eda.categorical_statistics} />
            <DuplicateAnalysis data={eda.duplicate_analysis} />
            <InvalidValues data={eda.invalid_value_analysis} />
            <CorrelationAnalysis data={eda.correlation_analysis} />
            <OutlierAnalysis data={eda.outlier_analysis} />
            <DistributionAnalysis data={eda.distribution_analysis} />
            <KurtosisAnalysis data={eda.kurtosis_analysis} />

          </>
        )} */}

        {active === "info" && dataset && (
  <DatasetDetails data={dataset} />
)}

{active === "preview" && dataset && (
  <PreviewTable data={dataset} />
)}

{active === "column" && eda && (
  <ColumnSummary data={eda.column_summary} />
)}

{active === "missing" && eda && (
  <MissingValues data={eda.missing_analysis} />
)}

{active === "duplicate" && eda && (
  <DuplicateAnalysis data={eda.duplicate_analysis} />
)}

{active === "invalid" && eda && (
  <InvalidValues data={eda.invalid_value_analysis} />
)}

{active === "numerical" && eda && (
  <NumericalStatistics data={eda.numerical_statistics} />
)}

{active === "categorical" && eda && (
  <CategoricalStatistics data={eda.categorical_statistics} />
)}

{active === "correlation" && eda && (
  <CorrelationAnalysis data={eda.correlation_analysis} />
)}

{active === "distribution" && eda && (
  <DistributionAnalysis data={eda.distribution_analysis} />
)}

{active === "kurtosis" && eda && (
  <KurtosisAnalysis data={eda.kurtosis_analysis} />
)}

{active === "outlier" && eda && (
  <OutlierAnalysis data={eda.outlier_analysis} />
)}

      </div>
      </div>
    </main>
  );
}