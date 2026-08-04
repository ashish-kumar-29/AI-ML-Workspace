"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LandingPage() {

  const router = useRouter();

  return (

    <main className="relative overflow-hidden min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-700 to-purple-900 px-6">

      {/* Animated Background */}

{/* Animated Background */}

<div className="absolute inset-0">

  <motion.div
    animate={{
      x: [0, 80, 0],
      y: [0, 50, 0],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className="absolute top-10 left-10 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl"
  />

  <motion.div
    animate={{
      x: [0, -100, 0],
      y: [0, 80, 0],
    }}
    transition={{
      duration: 10,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-purple-500/30 rounded-full blur-3xl"
  />

  <motion.div
    animate={{
      scale: [1, 1.3, 1],
    }}
    transition={{
      duration: 6,
      repeat: Infinity,
    }}
    className="absolute top-1/2 left-1/3 w-72 h-72 bg-cyan-400/30 rounded-full blur-3xl"
  />

</div>

      <motion.div
  initial={{ opacity:0, y:50 }}
  animate={{ opacity:1, y:0 }}
  transition={{
  duration: 1.5,
  ease: "easeOut"
}}
  className="relative z-10 max-w-5xl text-center text-white"
>

        {/* Logo */}

        <div className="text-7xl mb-8">
          🤖
        </div>


        {/* Heading */}

        <h1 className="text-6xl md:text-7xl font-extrabold leading-tight">

          DataMind
          <span className="text-blue-300">
            {" "}AI
          </span>

        </h1>


        <p className="mt-6 text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">

  AI ML Workspace is an intelligent data analysis platform
  designed to simplify the machine learning workflow.
  Upload your datasets, automatically perform exploratory
  data analysis, visualize important patterns, identify
  data quality issues, and receive AI-powered recommendations
  for preprocessing and machine learning models.

</p>

<p className="mt-5 text-lg text-blue-200">

  Transform raw data into meaningful insights with the power
  of Artificial Intelligence and Machine Learning.

</p>


        {/* Features */}

        <div className="grid md:grid-cols-3 gap-6 mt-12">


          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6">

            <h3 className="text-xl font-bold">
              📊 Smart EDA
            </h3>

            <p className="mt-2 text-blue-100">
              Automatically understand your dataset.
            </p>

          </div>



          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6">

            <h3 className="text-xl font-bold">
              🤖 AI Assistant
            </h3>

            <p className="mt-2 text-blue-100">
              Ask questions about your data.
            </p>

          </div>



          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6">

            <h3 className="text-xl font-bold">
              📈 ML Insights
            </h3>

            <p className="mt-2 text-blue-100">
              Get recommendations for models.
            </p>

          </div>


        </div>



        {/* Button */}

        <motion.button
  whileHover={{
    scale: 1.1,
  }}
  whileTap={{
    scale: 0.95,
  }}
  onClick={() => router.push("/home")}

          className="mt-14 px-12 py-4 rounded-full bg-white text-indigo-700 text-xl font-bold shadow-2xl hover:scale-110 transition duration-300"

        >

          🚀 Get Started

        </motion.button>

        <p className="mt-8 text-blue-200 text-sm">

  Powered by CodeAlchaemy

</p>


      </motion.div>


    </main>

  );
}