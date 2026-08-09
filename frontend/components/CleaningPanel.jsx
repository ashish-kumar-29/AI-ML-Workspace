"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function CleaningPanel({ file, onCleaned }) {
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(false);

  const addOperation = (column, method) => {
    setOperations((prev) => [
      ...prev,
      {
        column,
        method,
      },
    ]);
  };

  const handleClean = async () => {
    if (!file || operations.length === 0) {
      alert("Select at least one cleaning operation.");
      return;
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append("operations", JSON.stringify(operations));

    try {
      setLoading(true);

      const response = await api.post("/clean", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Cleaning Response:", response.data);

      onCleaned(response.data);
    } catch (error) {
      console.error("Cleaning failed:", error);
      alert("Cleaning failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-blue-600 mb-6">
        Data Cleaning
      </h2>

      <div className="space-y-4">
        <button
          onClick={() => addOperation("Age", "median")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Fill Age with Median
        </button>

        <button
          onClick={() => addOperation("Cabin", "drop_column")}
          className="bg-red-600 text-white px-5 py-2 rounded-lg ml-3"
        >
          Drop Cabin
        </button>
      </div>

      {operations.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-3">
            Selected Operations
          </h3>

          {operations.map((op, index) => (
            <div
              key={index}
              className="bg-gray-100 p-3 rounded-lg mb-2"
            >
              {op.column} → {op.method}
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleClean}
        disabled={loading}
        className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg"
      >
        {loading ? "Cleaning..." : "Apply Cleaning"}
      </button>
    </div>
  );
}