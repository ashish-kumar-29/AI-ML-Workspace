"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";


export default function MissingValuesChart({ eda }) {


  if (!eda?.missing_values) {

    return (

      <div className="
        flex
        items-center
        justify-center
        h-80
        text-gray-500
      ">

        Upload a dataset to view missing values.

      </div>

    );

  }




  const chartData = Object.entries(
    eda.missing_values
  ).map(([column,value])=>({

    column,
    missing:value

  }));





  // Check if dataset has no missing values

  const totalMissing = chartData.reduce(
    (sum,item)=>sum + item.missing,
    0
  );



  if(totalMissing === 0){

    return (

      <div className="
        flex
        flex-col
        items-center
        justify-center
        h-80
        text-gray-500
      ">

        <div className="text-5xl mb-4">
          ✅
        </div>

        <p className="text-lg font-semibold">
          No Missing Values Found
        </p>

        <p className="text-sm mt-2">
          Your dataset is complete.
        </p>

      </div>

    );

  }






  return (

    <div
      className="
      h-80
      w-full
      flex
      items-center
      justify-center
      overflow-visible
      "
    >



      {/* Only chart hover */}

      <div

        className="
        w-full
        h-full
        transition-transform
        duration-300
        ease-in-out
        hover:scale-110
        hover:z-50
        relative
        cursor-pointer
        "

      >


        <ResponsiveContainer
          width="100%"
          height="100%"
        >


          <BarChart

            data={chartData}

            margin={{
              top:20,
              right:20,
              left:10,
              bottom:50
            }}

          >



            <CartesianGrid
              strokeDasharray="3 3"
            />



            <XAxis

              dataKey="column"

              angle={-35}

              textAnchor="end"

              interval={0}

            />



            <YAxis />



            <Tooltip />



            <Bar

              dataKey="missing"

              fill="#2563EB"

              radius={[
                6,
                6,
                0,
                0
              ]}

            />


          </BarChart>


        </ResponsiveContainer>



      </div>



    </div>

  );

}