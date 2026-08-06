"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";


export default function NotFound() {

  const router = useRouter();


  return (

    <main className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gradient-to-br
      from-slate-950
      via-blue-950
      to-black
      px-6
    ">


      <motion.div

        initial={{
          opacity:0,
          y:50
        }}

        animate={{
          opacity:1,
          y:0
        }}

        transition={{
          duration:0.8
        }}

        className="
        text-center
        text-white
        "

      >


        <motion.div

          animate={{
            scale:[1,1.1,1]
          }}

          transition={{
            duration:2,
            repeat:Infinity
          }}

          className="
          text-8xl
          "
        >

          🤖

        </motion.div>




        <h1 className="
          text-8xl
          font-extrabold
          text-cyan-400
          mt-6
        ">

          404

        </h1>




        <h2 className="
          text-3xl
          font-bold
          mt-4
        ">

          Page Not Found

        </h2>




        <p className="
          text-gray-300
          mt-4
          text-lg
        ">

          The page you are looking for does not exist
          in the DataMind AI workspace.

        </p>





        <button

          onClick={()=>router.push("/")}

          className="
          mt-8
          px-10
          py-3
          rounded-full
          bg-cyan-400
          text-black
          font-bold
          hover:scale-105
          transition
          shadow-[0_0_30px_rgba(34,211,238,0.5)]
          "

        >

          🚀 Back To Home

        </button>



      </motion.div>



    </main>

  );

}