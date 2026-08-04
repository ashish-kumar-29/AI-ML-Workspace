"use client";

import { createContext, useContext, useState } from "react";


const DatasetContext = createContext();



export function DatasetProvider({ children }) {


  const [dataset, setDataset] = useState(null);

  const [eda, setEda] = useState(null);


  // Upload status

  const [loading, setLoading] = useState(false);


  // Error messages

  const [error, setError] = useState(null);




  // Clear dataset

  const clearDataset = () => {

    setDataset(null);

    setEda(null);

    setError(null);

  };




  return (

    <DatasetContext.Provider

      value={{

        dataset,

        setDataset,


        eda,

        setEda,


        loading,

        setLoading,


        error,

        setError,


        clearDataset

      }}

    >

      {children}

    </DatasetContext.Provider>

  );

}





export function useDataset() {

  return useContext(DatasetContext);

}