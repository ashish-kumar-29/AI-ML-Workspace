"use client";

import { useRef } from "react";
import api from "@/lib/api";

export default function FileUpload({ onUploadSuccess }) {
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
      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onUploadSuccess(response.data);
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