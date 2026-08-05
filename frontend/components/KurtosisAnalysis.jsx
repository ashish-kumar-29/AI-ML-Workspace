export default function KurtosisAnalysis({ data }) {
  return (
    <div className="mt-10 bg-white rounded-2xl shadow-xl p-8">

    <section className="mt-14">

      <h2 className="text-5xl font-bold text-blue-600 text-center mb-10">
        Kurtosis Analysis
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {Object.entries(data).map(([column, info]) => {

          let badge = "bg-gray-500";

          if (info.type === "Leptokurtic")
            badge = "bg-red-500";

          else if (info.type === "Mesokurtic")
            badge = "bg-green-500";

          else
            badge = "bg-yellow-500";

          return (

            <div
              key={column}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
            >

              <h3 className="text-2xl font-bold text-blue-600 text-center mb-6 break-words">
                {column}
              </h3>

              <div className="flex justify-center mb-6">

                <span
                  className={`${badge} text-white px-5 py-2 rounded-full font-bold`}
                >
                  {info.type}
                </span>

              </div>

              <div className="space-y-4">

                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">
                    Kurtosis
                  </span>

                  <span className="font-bold text-gray-900">
                    {info.kurtosis}
                  </span>
                </div>

              </div>

            </div>

          );

        })}

      </div>

      <div className="mt-10 bg-gray-50 border border-gray-200 rounded-xl p-6">

  <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
    Kurtosis Legend
  </h3>

  <div className="grid md:grid-cols-3 gap-8">

    <div className="flex items-center gap-4">
      <div className="w-8 h-8 rounded bg-red-500"></div>

      <div>
        <p className="font-semibold text-gray-900">
          Leptokurtic
        </p>

        <p className="text-gray-600 text-sm">
          Heavy Tails
        </p>
      </div>
    </div>

    <div className="flex items-center gap-4">
      <div className="w-8 h-8 rounded bg-green-500"></div>

      <div>
        <p className="font-semibold text-gray-900">
          Mesokurtic
        </p>

        <p className="text-gray-600 text-sm">
          Normal Distribution
        </p>
      </div>
    </div>

    <div className="flex items-center gap-4">
      <div className="w-8 h-8 rounded bg-yellow-500"></div>

      <div>
        <p className="font-semibold text-gray-900">
          Platykurtic
        </p>

        <p className="text-gray-600 text-sm">
          Light Tails
        </p>
      </div>
    </div>

  </div>

</div>

    </section>
</div>

  );
}