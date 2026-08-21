"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#f7fafc] text-[#172033]">

      {/* ================= NAVBAR ================= */}
      <nav className="w-full bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3">

            {/* DataMind AI Logo */}
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 flex items-center justify-center shadow-lg shadow-green-200">

              <svg
                viewBox="0 0 48 48"
                className="w-7 h-7 text-white"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Data bars */}
                <rect
                  x="7"
                  y="25"
                  width="6"
                  height="14"
                  rx="2"
                  fill="currentColor"
                />

                <rect
                  x="16"
                  y="18"
                  width="6"
                  height="21"
                  rx="2"
                  fill="currentColor"
                  opacity="0.9"
                />

                <rect
                  x="25"
                  y="11"
                  width="6"
                  height="28"
                  rx="2"
                  fill="currentColor"
                  opacity="0.8"
                />

                {/* Rising data connection */}
                <path
                  d="M31 16L39 8"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* AI node */}
                <circle
                  cx="40"
                  cy="7"
                  r="3"
                  fill="currentColor"
                />

                {/* AI signal */}
                <path
                  d="M37 23V31M33 27H41"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

            </div>

            <span className="text-2xl font-bold text-green-600">
              AI ML Workspace
            </span>

          </Link>


          {/* NAV LINKS */}
          <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">

            <a
              href="#features"
              className="hover:text-green-600 transition"
            >
              Features
            </a>

            <a
              href="#workflow"
              className="hover:text-green-600 transition"
            >
              How It Works
            </a>

            <a
              href="#benefits"
              className="hover:text-green-600 transition"
            >
              Benefits
            </a>

          </div>


          {/* GET STARTED */}
          <Link
            href="/workspace"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Get Started
          </Link>

        </div>
      </nav>


      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-br from-[#10b981] to-[#059669]">

        <div className="max-w-7xl mx-auto px-6 py-24 text-center">

          <div className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full bg-white/15 border border-white/20 text-sm font-semibold">
            ✨ AI-Powered Data Preparation
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            Turn Raw Data Into
            <span className="block">
              ML-Ready Data
            </span>
          </h1>

          <p className="max-w-3xl mx-auto mt-7 text-xl md:text-2xl text-green-50 leading-relaxed">
            Analyze your dataset, discover hidden quality issues, get
            AI-powered cleaning recommendations, and prepare your data
            for machine learning — all in one workspace.
          </p>

          <div className="mt-10 flex justify-center gap-5 flex-wrap">

            <Link
              href="/workspace"
              className="bg-white text-green-600 px-9 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition shadow-lg"
            >
              Analyze Your Dataset →
            </Link>

            <a
              href="#features"
              className="border-2 border-white text-white px-9 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-green-600 transition"
            >
              Explore Features
            </a>

          </div>

        </div>

      </section>


      {/* ================= STATISTICS ================= */}
      <section className="bg-white py-16 border-b border-gray-100">

        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">

          <Stat
            value="EDA"
            label="Automated Analysis"
            color="text-green-600"
          />

          <Stat
            value="AI"
            label="Smart Recommendations"
            color="text-blue-600"
          />

          <Stat
            value="ML"
            label="Algorithm Guidance"
            color="text-purple-600"
          />

          <Stat
            value="CSV"
            label="Clean Data Export"
            color="text-orange-600"
          />

        </div>

      </section>


      {/* ================= FEATURES ================= */}
      <section
        id="features"
        className="py-24 px-6 bg-[#f5f8fc]"
      >

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-14">

            <h2 className="text-5xl md:text-6xl font-bold text-[#172033]">
              Everything You Need for Better Data
            </h2>

            <p className="mt-5 text-xl text-gray-600">
              From raw CSV files to clean, validated and ML-ready datasets
            </p>

          </div>


          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            <FeatureCard
              icon="📂"
              title="Smart Dataset Upload"
              text="Upload CSV files and instantly inspect dataset size, columns and sample records."
            />

            <FeatureCard
              icon="📊"
              title="Automated EDA"
              text="Detect missing values, duplicates, outliers, correlations and distributions automatically."
            />

            <FeatureCard
              icon="🤖"
              title="AI Dataset Insights"
              text="Get simple explanations of important dataset quality issues using Gemini."
            />

            <FeatureCard
              icon="💡"
              title="Smart Recommendations"
              text="Receive cleaning techniques with reasons and alternative approaches."
            />

            <FeatureCard
              icon="🧹"
              title="Interactive Cleaning"
              text="Choose which recommended operations you want to apply."
            />

            <FeatureCard
              icon="🧠"
              title="ML Algorithm Guidance"
              text="Get algorithm suggestions based on dataset characteristics."
            />

            <FeatureCard
              icon="📈"
              title="Before vs After"
              text="Compare dataset quality before and after cleaning."
            />

            <FeatureCard
              icon="📥"
              title="Clean Dataset Export"
              text="Download your processed dataset as a CSV file."
            />

            <FeatureCard
              icon="🎯"
              title="ML-Ready Dataset"
              text="Transform your dataset into a cleaner and more reliable input for machine learning."
            />

          </div>

        </div>

      </section>


      {/* ================= WORKFLOW ================= */}
      <section
        id="workflow"
        className="py-24 px-6 bg-white"
      >

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">

            <h2 className="text-5xl font-bold">
              From Raw Data to ML-Ready
            </h2>

            <p className="text-xl text-gray-600 mt-5">
              A simple workflow that guides you through the complete
              data-preparation process.
            </p>

          </div>


          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-5">

            <Step
              number="01"
              icon="📂"
              title="Upload"
              text="Upload CSV"
            />

            <Step
              number="02"
              icon="🔍"
              title="Analyze"
              text="Run EDA"
            />

            <Step
              number="03"
              icon="🤖"
              title="AI Insights"
              text="Find Issues"
            />

            <Step
              number="04"
              icon="💡"
              title="Recommend"
              text="Get Solutions"
            />

            <Step
              number="05"
              icon="🧹"
              title="Clean"
              text="Apply Changes"
            />

            <Step
              number="06"
              icon="🚀"
              title="ML Ready"
              text="Export Dataset"
            />

          </div>

        </div>

      </section>


      {/* ================= BENEFITS ================= */}
      <section
        id="benefits"
        className="py-24 px-6 bg-[#f5f8fc]"
      >

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-14">

            <h2 className="text-5xl font-bold">
              Less Manual Work. Better Data Decisions.
            </h2>

            <p className="text-xl text-gray-600 mt-5">
              AI helps you understand your dataset instead of relying on
              trial and error.
            </p>

          </div>


          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-7">

            <Benefit
              icon="⚡"
              title="Faster Preparation"
              text="Automates repetitive dataset inspection and preprocessing tasks."
            />

            <Benefit
              icon="🎯"
              title="Better Decisions"
              text="Provides explanations instead of blindly applying preprocessing techniques."
            />

            <Benefit
              icon="🧹"
              title="Higher Data Quality"
              text="Systematically handles missing values, duplicates, outliers and other issues."
            />

            <Benefit
              icon="🔄"
              title="User Controlled"
              text="You choose which AI recommendations you want to apply."
            />

          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}
      <section className="py-24 px-6 bg-white">

        <div className="max-w-6xl mx-auto">

          <div className="rounded-3xl bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-20 text-center shadow-xl">

            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Prepare Your Dataset?
            </h2>

            <p className="max-w-2xl mx-auto mt-5 text-lg text-green-50">
              Upload your dataset and let AI help you understand,
              clean and prepare it for machine learning.
            </p>

            <Link
              href="/workspace"
              className="inline-block mt-9 bg-white text-green-600 px-9 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition"
            >
              Start Analyzing →
            </Link>

          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="bg-white border-t border-gray-200">

        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">

          <div className="font-bold text-xl text-green-600">
            AI ML Workspace
          </div>

          <p className="text-gray-500">
            AI-powered dataset analysis and preparation.
          </p>

          <p className="text-gray-400 text-sm">
            © 2026 AI ML Workspace
          </p>

        </div>

      </footer>

    </main>
  );
}


/* ================= COMPONENTS ================= */

function Stat({ value, label, color }) {
  return (
    <div>
      <div className={`text-4xl md:text-5xl font-bold ${color}`}>
        {value}
      </div>

      <p className="mt-3 text-gray-600 text-lg">
        {label}
      </p>
    </div>
  );
}


function FeatureCard({ icon, title, text }) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition duration-300 border border-gray-100">

      <div className="text-5xl mb-7">
        {icon}
      </div>

      <h3 className="text-2xl font-bold text-[#172033]">
        {title}
      </h3>

      <p className="mt-4 text-gray-600 text-lg leading-relaxed">
        {text}
      </p>

    </div>
  );
}


function Step({ number, icon, title, text }) {
  return (
    <div className="relative bg-white border border-gray-200 rounded-2xl p-7 text-center shadow-sm hover:shadow-lg transition">

      <div className="text-sm font-bold text-green-600">
        {number}
      </div>

      <div className="text-4xl mt-4">
        {icon}
      </div>

      <h3 className="text-xl font-bold mt-4">
        {title}
      </h3>

      <p className="text-gray-500 mt-2">
        {text}
      </p>

    </div>
  );
}


function Benefit({ icon, title, text }) {
  return (
    <div className="bg-white rounded-2xl p-7 shadow-md border border-gray-100">

      <div className="text-4xl">
        {icon}
      </div>

      <h3 className="text-xl font-bold mt-5">
        {title}
      </h3>

      <p className="text-gray-600 mt-3 leading-relaxed">
        {text}
      </p>

    </div>
  );
}