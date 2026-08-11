"use client";

import { useState } from "react";

export default function CleaningPanel({ file, onCleaned }) {

  const [operations, setOperations] = useState([]);

  const [loading, setLoading] = useState(false);


  // ============================================================
  // ADD OPERATION
  // ============================================================

  const addOperation = (
    column,
    method
  ) => {

    setOperations((prev) => [

      ...prev,

      {
        column,
        method,
      },

    ]);

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


    if (operations.length === 0) {

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


    formData.append(
      "operations",
      JSON.stringify(operations)
    );


    try {

      setLoading(true);


      console.log(
        "Sending cleaning request..."
      );

      console.log(
        "Operations:",
        operations
      );


      // ======================================================
      // CALL BACKEND DIRECTLY
      // ======================================================

      const response =
        await fetch(
          "http://127.0.0.1:8000/clean",
          {
            method: "POST",
            body: formData,
          }
        );


      // ======================================================
      // HANDLE ERROR
      // ======================================================

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


      // ======================================================
      // READ RESPONSE
      // ======================================================

      const data =
        await response.json();


      console.log(
        "Cleaning Response:",
        data
      );


      // ======================================================
      // SEND RESULT TO PAGE
      // ======================================================

      if (onCleaned) {

        onCleaned(
          data
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
  // UI
  // ============================================================

  return (

    <div className="mt-10 bg-white rounded-2xl shadow-xl p-8">


      <h2 className="text-3xl font-bold text-blue-600 mb-6">
        Data Cleaning
      </h2>


      <div className="space-y-4">


        <button
          onClick={() =>
            addOperation(
              "Age",
              "median"
            )
          }

          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Fill Age with Median
        </button>


        <button
          onClick={() =>
            addOperation(
              "Cabin",
              "drop_column"
            )
          }

          className="bg-red-600 text-white px-5 py-2 rounded-lg ml-3"
        >
          Drop Cabin
        </button>


      </div>


      {/* ======================================================
          SELECTED OPERATIONS
      ====================================================== */}

      {operations.length > 0 && (

        <div className="mt-6">

          <h3 className="font-semibold mb-3">
            Selected Operations
          </h3>


          {operations.map(
            (op, index) => (

              <div
                key={index}
                className="bg-gray-100 p-3 rounded-lg mb-2"
              >

                {op.column}
                {" → "}
                {op.method}

              </div>

            )
          )}

        </div>

      )}


      {/* ======================================================
          APPLY CLEANING
      ====================================================== */}

      <button
        onClick={
          handleClean
        }

        disabled={
          loading
        }

        className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
      >

        {
          loading
            ? "Cleaning..."
            : "Apply Cleaning"
        }

      </button>


    </div>

  );

}