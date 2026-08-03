import FileUpload from "@/components/FileUpload";

export default function UploadCard({ onUploadSuccess }) {
  return (
    <section className="max-w-4xl mx-auto">

      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-10 border border-gray-200">

        <div className="border-2 border-dashed border-blue-400 rounded-2xl p-12 text-center hover:border-blue-600 transition duration-300">

          <div className="text-6xl mb-5">
            📂
          </div>

          <h2 className="text-3xl font-bold text-gray-800">
            Upload Dataset
          </h2>

          <p className="text-gray-600 mt-3">
            Drag & Drop your CSV file here
          </p>

          <p className="text-sm text-gray-400 mt-2">
            Supported Format: .CSV
          </p>

          <div className="mt-8">
            <FileUpload onUploadSuccess={onUploadSuccess} />
          </div>

        </div>

      </div>

    </section>
  );
}