"use client";

import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";


export default function ModelsPage() {


  const models = [

    {
      icon: "📈",
      name: "Linear Regression",
      description:
        "A simple and effective algorithm for predicting continuous values.",
      use:
        "Best for understanding relationships between numerical features.",
      color:
        "blue"
    },


    {
      icon: "🌲",
      name: "Random Forest",
      description:
        "An ensemble learning algorithm that combines multiple decision trees.",
      use:
        "Suitable for large datasets and complex prediction problems.",
      color:
        "green"
    },


    {
      icon: "🌳",
      name: "Decision Tree",
      description:
        "A tree-based algorithm that makes decisions using feature conditions.",
      use:
        "Good starting model for classification and regression tasks.",
      color:
        "purple"
    },


    {
      icon: "⚡",
      name: "XGBoost",
      description:
        "A powerful boosting algorithm known for high performance.",
      use:
        "Recommended for advanced machine learning solutions.",
      color:
        "orange"
    }

  ];



  return (

    <>

      <Navbar />


      <main className="
        min-h-screen
        bg-gradient-to-br
        from-slate-100
        via-white
        to-blue-50
        pt-28
        px-6
        pb-10
      ">



        <div className="
          max-w-7xl
          mx-auto
        ">


          {/* Heading */}


          <motion.div

            initial={{
              opacity:0,
              y:40
            }}

            animate={{
              opacity:1,
              y:0
            }}

            transition={{
              duration:0.8
            }}

            className="text-center mb-12"

          >


            <h1 className="
              text-5xl
              font-extrabold
              text-gray-800
            ">

              🤖 Machine Learning Models

            </h1>



            <p className="
              mt-4
              text-lg
              text-gray-600
              max-w-3xl
              mx-auto
            ">

              Explore different machine learning algorithms
              supported by DataMind AI for intelligent predictions
              and data-driven solutions.

            </p>


          </motion.div>





          {/* AI Recommendation Banner */}


          <motion.div

            initial={{
              opacity:0,
              scale:0.9
            }}

            animate={{
              opacity:1,
              scale:1
            }}

            transition={{
              delay:0.3
            }}

            className="
              bg-gradient-to-r
              from-blue-600
              to-indigo-600
              rounded-3xl
              p-8
              text-white
              shadow-xl
              mb-10
            "

          >

            <h2 className="
              text-3xl
              font-bold
            ">

              🧠 AI Model Recommendation

            </h2>


            <p className="
              mt-3
              text-blue-100
              text-lg
            ">

              DataMind AI analyzes your dataset and suggests
              the most suitable machine learning approach.

            </p>


          </motion.div>






          {/* Models Grid */}



          <div className="
            grid
            md:grid-cols-2
            gap-8
          ">


            {
              models.map((model,index)=>(


                <motion.div

                  key={index}

                  initial={{
                    opacity:0,
                    y:40
                  }}

                  animate={{
                    opacity:1,
                    y:0
                  }}

                  transition={{
                    delay:index*0.2
                  }}

                  whileHover={{
                    y:-8
                  }}

                  className="
                    bg-white
                    rounded-3xl
                    shadow-xl
                    p-8
                    border
                    hover:shadow-2xl
                    transition
                  "

                >


                  <div className="
                    text-5xl
                    mb-5
                  ">

                    {model.icon}

                  </div>



                  <h3 className="
                    text-2xl
                    font-bold
                    text-gray-800
                  ">

                    {model.name}

                  </h3>



                  <p className="
                    mt-3
                    text-gray-600
                  ">

                    {model.description}

                  </p>



                  <div className="
                    mt-5
                    bg-blue-50
                    rounded-xl
                    p-4
                  ">

                    <p className="
                      text-blue-700
                      font-medium
                    ">

                      💡 {model.use}

                    </p>


                  </div>



                </motion.div>


              ))
            }


          </div>



        </div>



      </main>


    </>

  );

}