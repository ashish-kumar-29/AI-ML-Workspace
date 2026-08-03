"use client";

import { useRef, useState } from "react";
import api from "@/lib/api";
import { analyzeDataset } from "@/lib/eda";

export default function FileUpload({
  onUploadSuccess,
  onEDASuccess,
}) {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleButtonClick = () => {
    if (!loading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      // Upload dataset
      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload Response:", response.data);

      onUploadSuccess(response.data);

      // Run EDA
      const edaData = await analyzeDataset(file);

      console.log("EDA Response:", edaData);

      if (onEDASuccess) {
        onEDASuccess(edaData);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
      alert("Upload Failed");
    }
  };

  return (
    <>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        hidden
        onChange={handleFileChange}
      />

      <button
        onClick={handleButtonClick}
        disabled={loading}
        className={`mt-8 px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
          loading
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl hover:scale-105"
        }`}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>

            Uploading...
          </div>
        ) : (
          "Choose CSV"
        )}
      </button>
    </>
  );
}