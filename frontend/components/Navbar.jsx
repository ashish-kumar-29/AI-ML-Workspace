"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {

  const router = useRouter();


  return (

    <nav className="
      fixed top-0 left-0 w-full
      bg-white/90
      backdrop-blur-lg
      shadow-md
      px-6 md:px-10
      py-4
      flex
      justify-between
      items-center
      z-50
    ">



      {/* Logo */}


      <div 
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => router.push("/")}
      >

        <span className="text-3xl">
          🤖
        </span>


        <h1 className="text-2xl font-extrabold text-blue-600">

          DataMind AI

        </h1>


      </div>





      {/* Navigation */}


      <div className="hidden md:flex gap-4">


        <button

          onClick={() => router.push("/")}

          className="
          px-5 py-2
          rounded-xl
          text-gray-700
          hover:bg-blue-50
          hover:text-blue-600
          transition
          font-medium
          "

        >

          Home

        </button>





        <button

          onClick={() => router.push("/dashboard")}

          className="
          px-5 py-2
          rounded-xl
          text-gray-700
          hover:bg-blue-50
          hover:text-blue-600
          transition
          font-medium
          "

        >

          Dashboard

        </button>





        <button

          className="
          px-5 py-2
          rounded-xl
          text-gray-700
          hover:bg-blue-50
          hover:text-blue-600
          transition
          font-medium
          "

        >

          Models

        </button>



      </div>





      {/* AI Status */}


      <div className="
        hidden md:flex
        items-center
        gap-2
        bg-green-50
        px-4
        py-2
        rounded-full
        text-green-700
        text-sm
        font-semibold
      ">


        <span className="h-2 w-2 bg-green-500 rounded-full"></span>


        AI Ready


      </div>



    </nav>


  );

}