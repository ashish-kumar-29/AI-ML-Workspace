"use client";

export default function DistributionAnalysis({ data }) {
  // ============================================================
  // SAFETY CHECK
  // ============================================================

  if (!data || typeof data !== "object") {
    return (
      <div className="mt-10 bg-white rounded-2xl shadow-xl p-8">
        <section>
          <h2 className="text-4xl font-bold text-blue-600 text-center mb-6">
            Distribution Analysis
          </h2>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
            <p className="text-gray-700 font-medium">
              Distribution analysis is not available yet.
            </p>

            <p className="text-gray-500 text-sm mt-2">
              Please make sure the EDA analysis has completed successfully.
            </p>
          </div>
        </section>
      </div>
    );
  }

  const entries = Object.entries(data);

  // ============================================================
  // EMPTY DATA
  // ============================================================

  if (entries.length === 0) {
    return (
      <div className="mt-10 bg-white rounded-2xl shadow-xl p-8">
        <section>
          <h2 className="text-4xl font-bold text-blue-600 text-center mb-6">
            Distribution Analysis
          </h2>

          <div className="bg-gray-50 border rounded-xl p-6 text-center">
            <p className="text-gray-600">
              No distribution information is available.
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mt-10 bg-white rounded-2xl shadow-xl p-8">
      <section>
        <h2 className="text-4xl font-bold text-blue-600 text-center mb-10">
          Distribution Analysis
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {entries.map(([column, info]) => {
            // ----------------------------------------------------
            // Protect against malformed column data
            // ----------------------------------------------------

            if (!info || typeof info !== "object") {
              return (
                <div
                  key={column}
                  className="bg-gray-50 rounded-2xl border p-8"
                >
                  <h3 className="text-2xl font-bold text-blue-600 text-center">
                    {column}
                  </h3>

                  <p className="text-gray-500 text-center mt-4">
                    Distribution information unavailable.
                  </p>
                </div>
              );
            }

            let badge = "bg-gray-500";
            let badgeText = "Distribution unavailable";

            if (info.distribution === "Right Skewed") {
              badge = "bg-orange-500";
              badgeText = "📈 Right Skewed";
            } else if (
              info.distribution === "Left Skewed"
            ) {
              badge = "bg-blue-500";
              badgeText = "📉 Left Skewed";
            } else if (
              info.distribution === "Symmetric"
            ) {
              badge = "bg-green-500";
              badgeText = "⚖️ Symmetric";
            } else if (info.distribution) {
              badge = "bg-gray-500";
              badgeText = info.distribution;
            }

            return (
              <div
                key={column}
                className="bg-white rounded-2xl shadow-lg border p-8"
              >
                {/* Column */}
                <h3 className="text-2xl font-bold text-blue-600 text-center mb-6 break-words">
                  {column}
                </h3>

                {/* Distribution badge */}
                <div className="flex justify-center mb-6">
                  <span
                    className={`${badge} text-white px-5 py-2 rounded-full font-bold`}
                  >
                    {badgeText}
                  </span>
                </div>

                {/* Statistics */}
                <div className="space-y-4">

                  {/* Skewness */}
                  <div className="flex justify-between gap-4">
                    <span className="font-medium text-gray-700">
                      Skewness
                    </span>

                    <span className="font-bold text-gray-900">
                      {info.skewness ?? "N/A"}
                    </span>
                  </div>

                  <hr />

                  {/* Zero Count */}
                  <div className="flex justify-between gap-4">
                    <span className="font-medium text-gray-700">
                      Zero Count
                    </span>

                    <span className="font-bold text-gray-900">
                      {info.zero_count ?? "N/A"}
                    </span>
                  </div>

                  <hr />

                  {/* Negative Count */}
                  <div className="flex justify-between gap-4">
                    <span className="font-medium text-gray-700">
                      Negative Count
                    </span>

                    <span className="font-bold text-gray-900">
                      {info.negative_count ?? "N/A"}
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