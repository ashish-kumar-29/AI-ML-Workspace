export default function HeroSection() {
  return (
    <section className="text-center mb-12">

      <div className="inline-block px-5 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm mb-6 shadow">
        🚀 AI Powered Machine Learning Platform
      </div>

      <h1 className="text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
        AI ML Workspace
      </h1>

      <p className="text-2xl text-gray-700 mt-6 font-medium">
        Analyze • Visualize • Train Models
      </p>

      <p className="text-gray-500 mt-5 max-w-3xl mx-auto leading-8 text-lg">
        Upload your datasets, explore detailed statistics, visualize insights,
        and build machine learning models — all from one modern AI workspace.
      </p>

      <div className="flex justify-center gap-6 mt-10 flex-wrap">

        <div className="bg-white shadow-lg rounded-xl px-6 py-4">
          📂 CSV Upload
        </div>

        <div className="bg-white shadow-lg rounded-xl px-6 py-4">
          📊 Data Analytics
        </div>

        <div className="bg-white shadow-lg rounded-xl px-6 py-4">
          🤖 ML Models
        </div>

      </div>

    </section>
  );
}