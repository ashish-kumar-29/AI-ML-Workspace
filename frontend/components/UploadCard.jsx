import FileUpload from "@/components/FileUpload";

export default function UploadCard({
  onUploadSuccess,
  onEDASuccess,
}) {
  return (
    <section className="max-w-5xl mx-auto">

      <div className="bg-white shadow-2xl rounded-3xl border border-gray-200 overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">

          <h2 className="text-3xl font-bold">
            📂 Upload Dataset
          </h2>

          <p className="mt-2 text-blue-100">
            Upload your CSV file to start AI-powered analysis
          </p>

        </div>

        {/* Upload Area */}
        <div className="p-10">

          <div className="border-2 border-dashed border-blue-400 rounded-2xl p-14 text-center transition-all duration-300 hover:border-indigo-600 hover:bg-blue-50">

            <div className="text-7xl mb-6">
              📁
            </div>

            <h3 className="text-3xl font-bold text-gray-800">
              Drag & Drop CSV File
            </h3>

            <p className="text-gray-600 mt-3 text-lg">
              or click the button below to browse your computer
            </p>

            <div className="flex justify-center gap-4 mt-6">

              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm">
                CSV
              </span>

              <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm">
                Max 50 MB
              </span>

              <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm">
                UTF-8 Supported
              </span>

            </div>

            <div className="mt-10">

              <FileUpload
  onUploadSuccess={onUploadSuccess}
  onEDASuccess={onEDASuccess}
/>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}