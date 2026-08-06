"use client";

import { useRef, useState } from "react";
import api from "@/lib/api";
import { analyzeDataset } from "@/lib/eda";
import { useRouter } from "next/navigation";

export default function FileUpload({
  onUploadSuccess,
  onEDASuccess,
}) {

  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const [selectedFile, setSelectedFile] = useState("");

  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");

  const router = useRouter();



  const handleButtonClick = () => {

    if (!loading) {

      fileInputRef.current?.click();

    }

  };




  const handleFileChange = async (event) => {


    const file = event.target.files?.[0];


    if (!file) return;



    if (!file.name.endsWith(".csv")) {

      setError("Please upload a CSV file only.");

      return;

    }



    setSelectedFile(file.name);

    setError("");

    setSuccess("");



    const formData = new FormData();

    formData.append("file", file);



    setLoading(true);



    try {



      const response = await api.post(
        "/upload",
        formData,
        {
          headers:{
            "Content-Type":
            "multipart/form-data",
          },
        }
      );



      console.log(
        "Upload Response:",
        response.data
      );



      if(onUploadSuccess){

        onUploadSuccess(response.data);

      }



      const edaData = await analyzeDataset(file);



      console.log(
        "EDA Response:",
        edaData
      );



      if(onEDASuccess){

        onEDASuccess(edaData);

      }



      setSuccess(
        "Dataset analyzed successfully!"
      );



      setTimeout(()=>{

        router.push("/dashboard");

      },1200);



    }


    catch(error){


      console.error(error);


      setError(
        "Upload failed. Please try again."
      );


    }


    finally{


      setLoading(false);


    }


  };




  return (

    <div className="flex flex-col items-center">



      <input

        type="file"

        accept=".csv"

        ref={fileInputRef}

        hidden

        onChange={handleFileChange}

      />





      <div

        className="
        w-full
        max-w-md
        border-2
        border-dashed
        border-blue-300
        rounded-3xl
        p-8
        bg-white
        text-gray-800
        backdrop-blur-lg
        text-center
        "

      >



        <div className="text-5xl mb-4">

          📂

        </div>




        <h3 className="text-xl font-bold text-gray-800">

          Upload Dataset for Analysis

        </h3>




        <p className="text-gray-600 mt-2">

          Select your CSV file for AI analysis

        </p>




        {
          selectedFile && (

            <p className="mt-4 text-sm text-green-600 font-semibold">

              📄 {selectedFile}

            </p>

          )
        }





        <button

          onClick={handleButtonClick}

          disabled={loading}


          className={`mt-8 px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
          
          loading

          ?

          "bg-gray-400 text-white cursor-not-allowed"

          :

          "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-105 hover:shadow-xl"

          }`}


        >



          {
            loading

            ?

            <div className="flex items-center gap-3">


              <svg

                className="animate-spin h-5 w-5"

                xmlns="http://www.w3.org/2000/svg"

                fill="none"

                viewBox="0 0 24 24"

              >

                <circle

                  className="opacity-25"

                  cx="12"

                  cy="12"

                  r="10"

                  stroke="currentColor"

                  strokeWidth="4"

                />


                <path

                  className="opacity-75"

                  fill="currentColor"

                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"

                />


              </svg>


              Analyzing...


            </div>


            :

            
"📂 Select Dataset"

          }



        </button>




        {
          success && (

            <p className="mt-5 text-green-600 font-semibold">

              ✅ {success}

            </p>

          )
        }





        {
          error && (

            <p className="mt-5 text-red-600 font-semibold">

              ❌ {error}

            </p>

          )
        }



      </div>



    </div>

  );

}