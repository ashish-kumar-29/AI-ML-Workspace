"use client";

import Navbar from "@/components/Navbar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useDataset } from "@/context/DatasetContext";

import DatasetChart from "@/components/DatasetChart";
import MissingValuesChart from "@/components/MissingValuesChart";
import AIChat from "@/components/AIChat";

import calculateHealthScore from "@/lib/healthScore";
import generateRecommendations from "@/lib/recommendationEngine";

import { motion } from "framer-motion";


export default function Dashboard() {

  const { dataset, eda } = useDataset();


  const healthScore =
    dataset && eda
      ? calculateHealthScore(dataset, eda)
      : "--";


  const recommendations =
    dataset && eda
      ? generateRecommendations(dataset, eda)
      : [];


  return (

    <>

      <Navbar />


      <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 pt-28 pb-10 px-6">


        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">


          {/* Sidebar */}

          <DashboardSidebar />



          {/* Main Content */}

          <div className="flex-1">



            {/* Heading */}

            <motion.div

              initial={{
                opacity: 0,
                y: 30
              }}

              animate={{
                opacity: 1,
                y: 0
              }}

              transition={{
                duration: 0.8
              }}

              className="mb-10"

            >


              <h1 className="text-5xl font-extrabold text-gray-800">

                DataMind AI Dashboard

              </h1>



              <p className="text-gray-500 mt-3 text-lg">

                Explore your data, discover patterns,
                and generate intelligent machine learning insights.

              </p>




              <div className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-xl">


                <h3 className="text-2xl font-bold">

                  👋 Welcome to DataMind AI

                </h3>



                <p className="mt-2 text-blue-100">

                  Upload your dataset and let AI analyze
                  data quality, identify patterns, and
                  recommend the best ML approaches.

                </p>


              </div>



            </motion.div>




            {/* Overview Cards */}



            <motion.div

              initial={{
                opacity: 0,
                y: 40
              }}

              animate={{
                opacity: 1,
                y: 0
              }}

              transition={{
                duration: 0.8,
                delay: 0.2
              }}

              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"

            >




              {/* Dataset Size */}


              <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-1 transition">


                <div className="text-4xl mb-4">

                  📄

                </div>



                <p className="text-gray-500">

                  Dataset Size

                </p>



                <h2 className="text-4xl font-bold mt-3 text-blue-600">

                  {dataset?.rows ?? "--"}

                </h2>



                <p className="text-sm text-gray-400 mt-2">

                  Total Records

                </p>


              </div>





              {/* Features */}



              <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-1 transition">


                <div className="text-4xl mb-4">

                  📊

                </div>



                <p className="text-gray-500">

                  Features

                </p>



                <h2 className="text-4xl font-bold mt-3 text-purple-600">

                  {dataset?.columns ?? "--"}

                </h2>



                <p className="text-sm text-gray-400 mt-2">

                  Data Attributes

                </p>


              </div>





              {/* Memory Usage */}



              <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-1 transition">


                <div className="text-4xl mb-4">

                  💾

                </div>



                <p className="text-gray-500">

                  Memory Usage

                </p>



                <h2 className="text-4xl font-bold mt-3 text-orange-600">


                  {eda?.basic_info?.memory_usage_mb

                    ? `${eda.basic_info.memory_usage_mb} MB`

                    : "--"

                  }


                </h2>



                <p className="text-sm text-gray-400 mt-2">

                  Dataset Size

                </p>


              </div>





              {/* Health Score */}



              <div className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl hover:-translate-y-1 transition">


                <div className="text-4xl mb-4">

                  ❤️

                </div>



                <p className="text-gray-500">

                  Data Health

                </p>



                <h2 className="text-4xl font-bold mt-3 text-green-600">

                  {healthScore !== "--"
                    ? `${healthScore}%`
                    : "--"}

                </h2>



                <p className="text-sm text-gray-400 mt-2">

                  Quality Score

                </p>


              </div>



            </motion.div>

            
            {/* Analytics Section */}


            <motion.div

              initial={{
                opacity: 0,
                scale: 0.95
              }}

              animate={{
                opacity: 1,
                scale: 1
              }}

              transition={{
                duration: 0.8,
                delay: 0.4
              }}

              className="grid lg:grid-cols-2 gap-8 mt-10"

            >



              {/* Dataset Health */}


              <div className="bg-white rounded-3xl shadow-xl p-8">


                <h2 className="text-2xl font-bold mb-6">

                  🩺 Dataset Health

                </h2>



                <div className="flex justify-center items-center h-64">


                  <div className="text-center">



                    <div className="text-7xl font-extrabold text-green-600">


                      {dataset
                        ? `${healthScore}%`
                        : "--"}


                    </div>



                    <p className="text-gray-500 mt-3">


                      {!dataset

                        ? "Waiting for Dataset"

                        : healthScore >= 90

                        ? "Excellent Dataset Quality"

                        : healthScore >= 75

                        ? "Good Dataset Quality"

                        : healthScore >= 60

                        ? "Average Dataset Quality"

                        : "Poor Dataset Quality"}


                    </p>



                  </div>


                </div>


              </div>





              {/* AI Recommendation */}



              <div className="bg-white rounded-3xl shadow-xl p-8">



                <h2 className="text-2xl font-bold mb-6">

                  🤖 AI Recommendation

                </h2>




                <div className="space-y-4">



                  {dataset ? (



                    recommendations.map((item, index) => (


                      <div

                        key={index}

                        className={`rounded-xl p-4 border-l-4 ${

                          item.type === "success"

                            ? "bg-green-50 border-green-500"

                            : item.type === "warning"

                            ? "bg-yellow-50 border-yellow-500"

                            : "bg-blue-50 border-blue-500"

                        }`}

                      >

                        {item.text}


                      </div>


                    ))



                  ) : (



                    <div className="bg-blue-50 rounded-xl p-5">


                      Upload a dataset to receive AI recommendations.



                    </div>


                  )}



                </div>



              </div>



            </motion.div>






            {/* Charts Section */}




            <motion.div

              initial={{
                opacity: 0
              }}

              animate={{
                opacity: 1
              }}

              transition={{
                duration: 0.8,
                delay: 0.6
              }}

              className="mt-10 grid lg:grid-cols-2 gap-8"


            >




              {/* Column Types Chart */}



              <div className="bg-white rounded-3xl shadow-xl p-8">



                <h2 className="text-2xl font-bold mb-6">


                  📊 Column Types


                </h2>



                <DatasetChart eda={eda} />



              </div>





              {/* Missing Values Chart */}



              <div className="bg-white rounded-3xl shadow-xl p-8">



                <h2 className="text-2xl font-bold mb-6">


                  📈 Missing Values


                </h2>



                <MissingValuesChart eda={eda} />



              </div>



            </motion.div>






            {/* AI Chat Section */}



            <motion.section

              initial={{
                opacity: 0,
                y: 30
              }}

              animate={{
                opacity: 1,
                y: 0
              }}

              transition={{
                duration: 0.8,
                delay: 0.8
              }}

              className="mt-10"


            >



              <AIChat

                dataset={dataset}

                eda={eda}

                healthScore={healthScore}

              />



            </motion.section>





          </div>


        </div>


      </main>


    </>

  );

}