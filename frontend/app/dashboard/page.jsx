"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import Dashboard from "@/components/Dashboard";

export default function DashboardPage() {
  const [uploadData, setUploadData] = useState(null);
  const [edaData, setEdaData] = useState(null);

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold text-center text-gray-800">
          AI ML Workspace
        </h1>

        <p className="text-center text-gray-500 mt-3">
          Upload your dataset and analyze its quality
        </p>

        <div className="flex justify-center mt-8">
          <FileUpload
            onUploadSuccess={(data) => {
              setUploadData(data);
            }}
            onEDASuccess={(data) => {
              setEdaData(data);
            }}
          />
        </div>

        {uploadData && (
          <div className="mt-6 text-center text-green-600">
            Uploaded: {uploadData.filename}
          </div>
        )}

        <Dashboard data={edaData} />
      </div>
    </main>
  );
}
