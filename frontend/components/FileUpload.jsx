"use client";

import { useRef, useState } from "react";

import api from "@/lib/api";

import { analyzeDataset } from "@/lib/eda";


export default function FileUpload({
  onUploadSuccess,
  onEDASuccess,
  onFileSelected,
}) {

  const fileInputRef =
    useRef(null);

  const [loading, setLoading] =
    useState(false);


  // ============================================================
  // OPEN FILE PICKER
  // ============================================================

  const handleButtonClick = () => {

    fileInputRef.current?.click();

  };


  // ============================================================
  // FILE CHANGE
  // ============================================================

  const handleFileChange = async (event) => {

    const file =
      event.target.files?.[0];


    if (!file) {
      return;
    }


    // ==========================================================
    // VALIDATE FILE
    // ==========================================================

    if (
      !file.name
        .toLowerCase()
        .endsWith(".csv")
    ) {

      alert(
        "Please select a CSV file."
      );

      return;
    }


    try {

      setLoading(true);


      // ========================================================
      // SAVE FILE IN PARENT
      // ========================================================

      if (onFileSelected) {

        onFileSelected(file);

      }


      // ========================================================
      // 1. UPLOAD
      // ========================================================

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );


      const uploadResponse =
        await api.post(
          "/upload",
          formData
        );


      console.log(
        "Upload Response:",
        uploadResponse.data
      );


      if (onUploadSuccess) {

        onUploadSuccess(
          uploadResponse.data
        );

      }


      // ========================================================
      // 2. EDA
      // ========================================================

      const edaData =
        await analyzeDataset(
          file
        );


      console.log(
        "EDA Response:",
        edaData
      );


      if (onEDASuccess) {

        onEDASuccess(
          edaData
        );

      }


      // ========================================================
      // IMPORTANT:
      //
      // Gemini is NOT called here.
      //
      // AI is generated only when the user clicks
      // "Generate AI Recommendations".
      // ========================================================

    } catch (error) {

      console.error(
        "Dataset upload/EDA error:",
        error
      );


      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Dataset analysis failed.";


      alert(message);

    } finally {

      setLoading(false);


      // Allow selecting same file again

      if (fileInputRef.current) {

        fileInputRef.current.value =
          "";

      }

    }

  };


  // ============================================================
  // UI
  // ============================================================

  return (

    <>

      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        hidden
        onChange={
          handleFileChange
        }
      />


      <button
        onClick={
          handleButtonClick
        }

        disabled={
          loading
        }

        className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >

        {loading
          ? "Analyzing..."
          : "Choose CSV"}

      </button>

    </>

  );

}