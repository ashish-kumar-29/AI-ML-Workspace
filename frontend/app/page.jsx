"use client";

import { useState } from "react";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import UploadCard from "@/components/UploadCard";
import DatasetDetails from "@/components/DatasetInfo";
import PreviewTable from "@/components/PreviewTable";
import StatsCards from "@/components/StatsCards";
import EDASummary from "@/components/EDASummary";

export default function Home() {
  const [dataset, setDataset] = useState(null);
  const [eda, setEda] = useState(null);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 pt-28 pb-16 px-6">

        <HeroSection />

        <UploadCard
          onUploadSuccess={setDataset}
          onEDASuccess={setEda}
        />

        {dataset && (
          <>
            <StatsCards data={dataset} />

            <section className="max-w-6xl mx-auto mt-10">
              <DatasetDetails data={dataset} />
              <PreviewTable data={dataset} />
            </section>
          </>
        )}

        {eda && (
          <section className="max-w-6xl mx-auto mt-10">
            <EDASummary data={eda} />
          </section>
        )}

      </main>
    </>
  );
}