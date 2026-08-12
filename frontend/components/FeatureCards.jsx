export default function FeatureCards() {
  const features = [
    {
      icon: "📄",
      title: "Dataset Information",
      text: "Get complete details about your dataset including filename, rows, columns and structure."
    },
    {
      icon: "📑",
      title: "Dataset Preview",
      text: "View your uploaded dataset records in a clean and interactive table."
    },
    {
      icon: "📋",
      title: "Column Summary",
      text: "Understand columns, data types and feature information."
    },
    {
      icon: "❗",
      title: "Missing Values",
      text: "Detect missing data and improve dataset quality."
    },
    {
      icon: "📊",
      title: "Numerical Statistics",
      text: "Analyze mean, median and statistical patterns."
    },
    {
      icon: "📈",
      title: "Correlation Analysis",
      text: "Find relationships between different features."
    },
    {
      icon: "🔥",
      title: "Distribution Analysis",
      text: "Understand data distribution and hidden patterns."
    },
    {
      icon: "🤖",
      title: "AI Insights",
      text: "Get AI-powered recommendations for ML models."
    }
  ];

  return (
    <section className="max-w-7xl mx-auto mt-20 px-6">
      <h2 className="text-4xl font-bold text-center text-white mb-12">
        🚀 Powerful Data Intelligence Features
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((item, index) => (
          <div
            key={index}
            className="
              bg-white/10
              backdrop-blur-xl
              border
              border-cyan-400/20
              rounded-3xl
              p-6
              text-white
              hover:scale-105
              transition
              duration-300
            "
          >
            <div className="text-4xl mb-4">
              {item.icon}
            </div>

            <h3 className="text-xl font-bold">
              {item.title}
            </h3>

            <p className="mt-3 text-gray-300 text-sm">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}