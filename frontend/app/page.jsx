"use client";

import { useState } from "react";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import UploadCard from "@/components/UploadCard";
import DatasetDetails from "@/components/DatasetInfo";
import PreviewTable from "@/components/PreviewTable";
import StatsCards from "@/components/StatsCards";
import EDASummary from "@/components/EDASummary";
import AIRecommendation from "@/components/AIRecommendation";


export default function Home() {
  const [dataset, setDataset] = useState(null);
  const [eda, setEda] = useState(null);

  return (
  <>
    <Navbar />

    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 pt-28 pb-16 px-6">

      {/* Hero */}
      <HeroSection />

      {/* Upload */}
      <section className="max-w-6xl mx-auto mt-12">
        <UploadCard
          onUploadSuccess={setDataset}
          onEDASuccess={setEda}
        />
      </section>

      {/* Statistics */}
      {dataset && (
        <section className="max-w-6xl mx-auto mt-16">

          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            📊 Dataset Overview
          </h2>

          <StatsCards data={dataset} />

        </section>
      )}

      {/* Dataset Information */}
      {dataset && (
        <section className="max-w-6xl mx-auto mt-16">

          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            📋 Dataset Information
          </h2>

          <DatasetDetails data={dataset} />

        </section>
      )}

      {dataset && eda && (
  <section className="max-w-6xl mx-auto mt-10">
    <AIRecommendation
      dataset={dataset}
      eda={eda}
    />
  </section>
)}

      {/* EDA */}
      {eda && (
        <section className="max-w-6xl mx-auto mt-16">

          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            📈 Exploratory Data Analysis
          </h2>

          <EDASummary data={eda} />

        </section>
      )}

      {/* Preview */}
      {dataset && (
        <section className="max-w-6xl mx-auto mt-16">

          <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            📑 Dataset Preview
          </h2>

          <PreviewTable data={dataset} />

        </section>
      )}

    </main>
  </>
);
}