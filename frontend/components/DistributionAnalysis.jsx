export default function DistributionAnalysis({ data }) {
  return (
    <div className="mt-10 bg-white rounded-2xl shadow-xl p-8">
    <section className="mt-12">
      <h2 className="text-5xl font-bold text-blue-600 text-center mb-10">
        Distribution Analysis
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {Object.entries(data).map(([column, info]) => {

          let badge = "bg-gray-500";

          if (info.distribution === "Right Skewed")
            badge = "bg-orange-500";

          else if (info.distribution === "Left Skewed")
            badge = "bg-blue-500";

          else
            badge = "bg-green-500";

          return (

            <div
              key={column}
              className="bg-white rounded-2xl shadow-lg border p-8"
            >

              <h3 className="text-2xl font-bold text-blue-600 text-center mb-6 break-words">
                {column}
              </h3>

              <div className="flex justify-center mb-6">

                <span
                  className={`${badge} text-white px-5 py-2 rounded-full font-bold`}
                >
                  {info.distribution === "Right Skewed" && "📈 Right Skewed"}
                  {info.distribution === "Left Skewed" && "📉 Left Skewed"}
                  {info.distribution === "Symmetric" && "⚖️ Symmetric"}
                </span>

              </div>

              <div className="space-y-4">

                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">
                    Skewness
                  </span>

                  <span className="font-bold text-gray-900">
                    {info.skewness}
                  </span>
                </div>

                <hr />

                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">
                    Zero Count
                  </span>

                  <span className="font-bold text-gray-900">
                    {info.zero_count}
                  </span>
                </div>

                <hr />

                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">
                    Negative Count
                  </span>

                  <span className="font-bold text-gray-900">
                    {info.negative_count}
                  </span>
                </div>

              </div>

            </div>

          );

        })}

      </div>
    </section>
      </div>

  );
}