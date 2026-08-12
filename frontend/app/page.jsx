"use client";


import { useRouter } from "next/navigation";
import FeatureCards from "@/components/FeatureCards";
import { motion } from "framer-motion";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main
      className="
        relative
        overflow-hidden
        min-h-screen
        flex
        items-center
        justify-center
        bg-gradient-to-br
        from-slate-950
        via-blue-950
        to-black
        px-6
      "
    >
      {/* AI Grid Background */}

      <div
        className="
          absolute
          inset-0
          opacity-20
          bg-[linear-gradient(#38bdf8_1px,transparent_1px),linear-gradient(90deg,#38bdf8_1px,transparent_1px)]
          bg-[size:50px_50px]
        "
      />

      {/* Animated Glow Background */}

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
          className="
            absolute
            top-10
            left-10
            w-96
            h-96
            bg-green-400/20
            rounded-full
            blur-3xl
          "
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
          className="
            absolute
            bottom-10
            right-10
            w-[450px]
            h-[450px]
            bg-blue-500/20
            rounded-full
            blur-3xl
          "
        />

        <motion.div
          animate={{
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
          }}
          className="
            absolute
            top-1/2
            left-1/3
            w-72
            h-72
            bg-purple-500/20
            rounded-full
            blur-3xl
          "
        />

      </div>

      <motion.div
        initial={{
          opacity: 0,
          y: 50,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 2.5,
        }}
        className="
          relative
          z-10
          max-w-5xl
          text-center
          text-white
        "
      >

        {/* Logo */}

        <motion.div
          initial={{
            scale: 0,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          transition={{
            duration: 2,
          }}
          className="
            text-7xl
            mb-8
          "
        >
          🤖
        </motion.div>

        {/* Heading */}

        <motion.h1
          initial={{
            scale: 0.3,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          transition={{
            duration: 2.6,
            ease: "easeOut",
          }}
          className="
            text-6xl
            md:text-7xl
            font-extrabold
            leading-tight
          "
        >
          DataMind

          <span className="text-cyan-400">
            {" "}AI
          </span>
        </motion.h1>

        {/* First Description */}

        <motion.p
          initial={{
            x: -150,
            opacity: 0,
          }}
          animate={{
            x: 0,
            opacity: 1,
          }}
          transition={{
            duration: 1.9,
            delay: 2.3,
          }}
          className="
            mt-6
            text-xl
            md:text-2xl
            text-gray-200
            max-w-4xl
            mx-auto
            leading-relaxed
          "
        >
          DataMind AI is an intelligent data analysis platform
          designed to simplify the machine learning workflow.
          Upload your datasets, automatically perform exploratory
          data analysis, visualize important patterns, identify
          data quality issues, and receive AI-powered recommendations
          for preprocessing and machine learning models.
        </motion.p>

        {/* Second Description */}

        <motion.p
          initial={{
            x: 150,
            opacity: 0,
          }}
          animate={{
            x: 0,
            opacity: 1,
          }}
          transition={{
            duration: 1.9,
            delay: 2.5,
          }}
          className="
            mt-5
            text-lg
            text-green-200
          "
        >
          Transform raw data into meaningful insights with the power
          of Artificial Intelligence and Machine Learning.
        </motion.p>

        {/* Features */}

        <div
          className="
            grid
            md:grid-cols-3
            gap-6
            mt-12
          "
        >

          {[
            {
              icon: "📊",
              title: "Smart EDA",
              text: "Automatically understand your dataset.",
            },
            {
              icon: "🤖",
              title: "AI Assistant",
              text: "Ask questions about your data.",
            },
            {
              icon: "📈",
              title: "ML Insights",
              text: "Get recommendations for models.",
            },
          ].map((item, index) => (

            <motion.div
              key={index}
              initial={{
                opacity: 0,
                y: 50,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 3 + index * 0.5,
              }}
              className="
                bg-white/40
                backdrop-blur-lg
                border
                bg-cyan-400/20
                rounded-3xl
                p-6
                shadow-[0_0_35px_rgba(34,211,238,0.6)]
              "
            >

              <h3
                className="
                  text-xl
                  font-bold
                  text-white
                "
              >
                {item.icon} {item.title}
              </h3>

              <p
                className="
                  mt-2
                  text-gray-300
                "
              >
                {item.text}
              </p>

            </motion.div>

          ))}

        </div>

        <FeatureCards />

        {/* Get Started Button */}

        <motion.button
          initial={{
            opacity: 0,
            x: -300,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 2,
            delay: 4.5,
            ease: "easeOut",
          }}
          whileHover={{
            scale: 1.08,
          }}
          whileTap={{
            scale: 0.95,
          }}

          // IMPORTANT:
          // Existing workspace is now /workspace
          onClick={() => router.push("/workspace")}

          className="
            relative
            overflow-hidden
            mt-14
            px-12
            py-4
            rounded-full
            bg-cyan-400
            text-black
            text-xl
            font-bold
            shadow-[0_0_35px_rgba(34,197,94,0.6)]
          "
        >

          <motion.span
            animate={{
              x: ["-150%", "150%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-transparent
              via-white/50
              to-transparent
            "
          />

          <span className="relative">
            🚀 Get Started
          </span>

        </motion.button>

        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 3.3,
          }}
          className="
            mt-8
            text-green-200
            text-sm
          "
        >
          Powered by CodeAlchaemy
        </motion.p>

      </motion.div>

    </main>
  );
}