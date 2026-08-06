import FileUpload from "@/components/FileUpload";

export default function UploadCard({
  onUploadSuccess,
  onEDASuccess,
}) {
  return (
    <section className="max-w-5xl mx-auto">

      <div
        className="
        bg-white/10
        backdrop-blur-xl
        rounded-3xl
        shadow-2xl
        border
        border-cyan-400/20
        overflow-hidden
        "
      >


        {/* Header */}

        <div
          className="
          bg-gradient-to-r
          from-cyan-500
          via-blue-600
          to-indigo-700
          px-8
          py-6
          text-white
          "
        >

          <h2 className="
            text-3xl
            font-bold
          ">
            📂 Upload Dataset
          </h2>


          <p className="
            mt-2
            text-cyan-100
          ">
            Upload your CSV file to start AI-powered analysis
          </p>


        </div>





        {/* Upload Area */}


        <div className="p-10">


          <div
            className="
            border-2
            border-dashed
            border-cyan-400/50
            rounded-2xl
            p-14
            text-center
            bg-black/30
            transition-all
            duration-300
            hover:border-cyan-300
            hover:bg-cyan-400/5
            "
          >



            <div className="
              text-7xl
              mb-6
            ">

              📁

            </div>





            <h3
              className="
              text-3xl
              font-bold
              text-white
              "
            >

              Upload Your Dataset

            </h3>





            <p
              className="
              text-gray-300
              mt-3
              text-lg
              "
            >

              Drag and drop your CSV file or select it from your device

            </p>







            {/* Tags */}


            <div className="
              flex
              justify-center
              gap-4
              mt-6
              flex-wrap
            ">



              <span
                className="
                bg-cyan-400/20
                border
                border-cyan-300/30
                text-cyan-200
                px-4
                py-2
                rounded-full
                text-sm
                "
              >

                CSV

              </span>





              <span
                className="
                bg-green-400/20
                border
                border-green-300/30
                text-green-200
                px-4
                py-2
                rounded-full
                text-sm
                "
              >

                Max 50 MB

              </span>





              <span
                className="
                bg-purple-400/20
                border
                border-purple-300/30
                text-purple-200
                px-4
                py-2
                rounded-full
                text-sm
                "
              >

                UTF-8 Supported

              </span>



            </div>







            {/* File Upload Button */}


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