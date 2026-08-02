"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import DatasetDetails from "@/components/DatasetInfo";
import PreviewTable from "@/components/PreviewTable";

export default function Home() {
  const [dataset, setDataset] = useState(null);

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-[700px] text-center">
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

          <FileUpload onUploadSuccess={setDataset} />
        </div>

        {dataset && (
          <>
            <DatasetDetails data={dataset} />
            <PreviewTable data={dataset} />
          </>
        )}
      </div>
    </main>
  );
}