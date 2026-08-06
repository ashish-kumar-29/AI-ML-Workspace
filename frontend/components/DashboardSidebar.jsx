"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";


export default function DashboardSidebar() {

  const pathname = usePathname();


  const menuItems = [

    {
      name: "Home",
      icon: "🏠",
      path: "/"
    },

    {
      name: "Dashboard",
      icon: "📊",
      path: "/dashboard"
    },

    {
      name: "AI Models",
      icon: "🤖",
      path: "/models"
    }

  ];



  const extraItems = [

    {
      name:"Upload History",
      icon:"📂"
    },

    {
      name:"Settings",
      icon:"⚙️"
    }

  ];



  return (

    <aside
      className="
      w-72
      bg-white
      rounded-3xl
      shadow-xl
      p-8
      h-[85vh]
      sticky
      top-24
      "
    >



      {/* Logo */}


      <motion.h2

        initial={{
          opacity:0,
          x:-20
        }}

        animate={{
          opacity:1,
          x:0
        }}

        className="
        text-3xl
        font-extrabold
        text-blue-600
        mb-10
        "

      >

        🤖 DataMind AI

      </motion.h2>





      {/* Navigation */}


      <nav className="space-y-3">


        {
          menuItems.map((item,index)=>{


            const active = pathname === item.path;


            return (

              <motion.div

                key={item.name}

                whileHover={{
                  x:5
                }}

              >

                <Link

                  href={item.path}

                  className={`
                    flex
                    items-center
                    gap-4
                    px-5
                    py-4
                    rounded-xl
                    font-semibold
                    transition

                    ${
                      active

                      ? 
                      "bg-blue-600 text-white shadow-lg"

                      :

                      "text-gray-700 hover:bg-blue-50 hover:text-blue-600"

                    }

                  `}

                >

                  <span className="text-xl">

                    {item.icon}

                  </span>


                  {item.name}


                </Link>


              </motion.div>

            );

          })
        }




        {/* Extra Buttons */}


        {
          extraItems.map((item)=>(
            

            <motion.button

              key={item.name}

              whileHover={{
                x:5
              }}

              className="
              w-full
              flex
              items-center
              gap-4
              px-5
              py-4
              rounded-xl
              text-gray-700
              hover:bg-blue-50
              hover:text-blue-600
              transition
              font-semibold
              "

            >

              <span className="text-xl">

                {item.icon}

              </span>


              {item.name}


            </motion.button>


          ))
        }


      </nav>


    </aside>

  );

}