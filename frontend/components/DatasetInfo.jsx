export default function DatasetDetails({ data }) {
  return (
    <div className="bg-white rounded-3xl shadow-2xl p-10">

      {/* Header */}

      <div className="text-center mb-10">

        <span className="
          bg-indigo-100
          text-indigo-700
          px-5
          py-2
          rounded-full
          text-sm
          font-medium
        ">
          Dataset Summary
        </span>


        <h2 className="
          text-4xl
          font-bold
          mt-5
          text-gray-800
        ">
          📋 Dataset Information
        </h2>


        <p className="
          text-gray-500
          mt-3
        ">
          Basic information about your uploaded dataset
        </p>


      </div>





      {/* Information Cards */}


      <div className="
        grid
        md:grid-cols-3
        gap-6
      ">


        <div className="
          bg-gradient-to-r
          from-blue-500
          to-indigo-600
          rounded-2xl
          p-6
          text-white
          shadow-lg
          hover:-translate-y-1
          transition
        ">

          <p className="text-blue-100">
            Filename
          </p>


          <h3 className="
            text-xl
            font-bold
            mt-2
            break-words
          ">
            {data.filename}
          </h3>


        </div>





        <div className="
          bg-gradient-to-r
          from-green-500
          to-emerald-600
          rounded-2xl
          p-6
          text-white
          shadow-lg
          hover:-translate-y-1
          transition
        ">


          <p className="text-green-100">
            Rows
          </p>


          <h3 className="
            text-4xl
            font-bold
            mt-2
          ">
            {data.rows.toLocaleString()}
          </h3>


        </div>





        <div className="
          bg-gradient-to-r
          from-purple-500
          to-pink-600
          rounded-2xl
          p-6
          text-white
          shadow-lg
          hover:-translate-y-1
          transition
        ">


          <p className="text-purple-100">
            Columns
          </p>


          <h3 className="
            text-4xl
            font-bold
            mt-2
          ">
            {data.columns}
          </h3>


        </div>


      </div>






      {/* Column Names */}


      <div className="
        mt-14
        text-center
      ">


        {/* Title with lines */}


        <div className="
          flex
          items-center
          justify-center
          gap-5
          mb-5
        ">


          <div className="
            hidden
            md:block
            h-[2px]
            bg-indigo-100
            flex-1
          "></div>



          <div>


            <div className="
              text-3xl
              mb-2
            ">
              🗂️
            </div>


            <h3 className="
              text-3xl
              font-bold
              text-gray-800
            ">
              Dataset Columns
            </h3>


          </div>




          <div className="
            hidden
            md:block
            h-[2px]
            bg-indigo-100
            flex-1
          "></div>



        </div>




        <p className="
          text-gray-500
          mb-8
        ">

          These are the columns available in your dataset

        </p>





        {/* Column Pills */}


        <div className="
          flex
          flex-wrap
          justify-center
          gap-4
        ">


          {data.column_names
            .filter((column) => column !== "Unnamed: 0")
            .map((column) => (

              <span

                key={column}

                className="
                  bg-gradient-to-r
                  from-indigo-500
                  to-blue-500
                  text-white
                  px-6
                  py-3
                  rounded-full
                  shadow-md
                  font-semibold
                  hover:scale-110
                  transition
                "

              >

                🗃️ {column}

              </span>

            ))}


        </div>


      </div>


    </div>
  );
}