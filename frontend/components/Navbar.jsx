"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {

  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);



  const navigate = (path) => {

    router.push(path);

    setMenuOpen(false);

  };



  return (

    <nav className="
      fixed top-0 left-0 w-full
      bg-white/90
      backdrop-blur-lg
      shadow-md
      px-6 md:px-10
      py-4
      z-50
    ">


      <div className="
        flex
        justify-between
        items-center
      ">



        {/* Logo */}


        <div

          className="flex items-center gap-3 cursor-pointer"

          onClick={() => navigate("/")}

        >

          <span className="text-3xl">
            🤖
          </span>


          <h1 className="text-xl md:text-2xl font-extrabold text-blue-600">

            DataMind AI

          </h1>


        </div>





        {/* Desktop Navigation */}


        <div className="hidden md:flex gap-4">


          <button

            onClick={() => navigate("/")}

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

            onClick={() => navigate("/dashboard")}

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

            onClick={() => navigate("/models")}

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





        {/* AI Status Desktop */}


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


          <span className="
            h-2
            w-2
            bg-green-500
            rounded-full
          "></span>


          AI Ready


        </div>





        {/* Mobile Menu Button */}


        <button

          onClick={() => setMenuOpen(!menuOpen)}

          className="
          md:hidden
          text-3xl
          text-gray-700
          "

        >

          ☰


        </button>



      </div>





      {/* Mobile Menu */}


      {/* Mobile Menu */}

{menuOpen && (

  <div
    className="
      md:hidden
      mt-4
      bg-white
      rounded-2xl
      shadow-xl
      p-4
      space-y-3
      border
    "
  >

    <button
      onClick={() => navigate("/")}
      className="
        block
        w-full
        text-left
        px-4
        py-3
        rounded-xl
        text-gray-800
        bg-gray-100
        hover:bg-blue-100
        hover:text-blue-600
        transition
        font-semibold
      "
    >
      Home
    </button>


    <button
      onClick={() => navigate("/dashboard")}
      className="
        block
        w-full
        text-left
        px-4
        py-3
        rounded-xl
        text-gray-800
        bg-gray-100
        hover:bg-blue-100
        hover:text-blue-600
        transition
        font-semibold
      "
    >
      Dashboard
    </button>


    <button
      onClick={() => navigate("/models")}
      className="
        block
        w-full
        text-left
        px-4
        py-3
        rounded-xl
        text-gray-800
        bg-gray-100
        hover:bg-blue-100
        hover:text-blue-600
        transition
        font-semibold
      "
    >
      Models
    </button>


  </div>

)}



    </nav>

  );

}