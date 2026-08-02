"use client";

import { useRef } from "react";
import api from "@/lib/api";
import { analyzeDataset } from "@/lib/eda";

export default function FileUpload({ onUploadSuccess, onEDASuccess }) {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Upload API
      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload Response:", response.data);

      onUploadSuccess(response.data);

      // EDA API
      const edaData = await analyzeDataset(file);

      console.log("EDA Response:", edaData);
      console.log("Basic Info:", edaData.basic_info);

      // We'll connect this later
      onEDASuccess(edaData);

    } catch (error) {
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
        className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Choose CSV
      </button>
    </>
  );
}