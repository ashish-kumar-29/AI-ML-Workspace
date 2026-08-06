"use client";

import { useDataset } from "@/context/DatasetContext";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import UploadCard from "@/components/UploadCard";
import DatasetDetails from "@/components/DatasetInfo";
import PreviewTable from "@/components/PreviewTable";
import StatsCards from "@/components/StatsCards";
import EDASummary from "@/components/EDASummary";
import AIRecommendation from "@/components/AIRecommendation";


export default function Home() {
  const {
  dataset,
  setDataset,
  eda,
  setEda,
} = useDataset();

  return (
  <>
    <Navbar />

    <main className="
relative
overflow-hidden
min-h-screen
bg-gradient-to-br
from-slate-950
via-blue-950
to-black
pt-28
pb-16
px-6
">

  {/* AI Background Glow */}

<div className="absolute inset-0 -z-0">

  <div
    className="
    absolute
    top-20
    left-20
    w-96
    h-96
    bg-cyan-400/20
    rounded-full
    blur-3xl
    "
  />

  <div
    className="
    absolute
    bottom-20
    right-20
    w-[450px]
    h-[450px]
    bg-blue-500/20
    rounded-full
    blur-3xl
    "
  />

</div>

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