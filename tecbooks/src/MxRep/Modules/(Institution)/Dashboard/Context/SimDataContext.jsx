import React, { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
// import LeaderBoard from "../Sections/OverView/Small/LeaderBoard"
import { simToken } from "./example.data"

const SimDataContext = createContext()

export const useSimData = () => useContext(SimDataContext)

export const SimDataProvider = ({ children }) => {
  const [simData, setSimData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  const token = simToken

  const navigate = useNavigate()

  useEffect(() => {
    // async function fetchData() {
    //   console.log("inside fetch data func")
    //   try {
    //     console.log("inside try for fetch data")
    //     const response = await fetch("/get-sim-info")

    //     const decoded = await response.json()
    //     console.log("decoded token: ", decoded)
    //     // setSim(JSON.parse(decoded))
    //     setSimData(decoded)
    //     setIsLoading(false)
    //     // console.log("commented out deciphering of sim token")
    //     // console.log("setting sim token with practice object: ")
    //     // console.log(simToken)
    //   } catch (e) {
    //     console.error("jwt validation failed ", e)
    //     setError(true)
    //     setIsLoading(false)
    //   }
    // }

    // fetchData()
    setTimeout(() => {
      setError(false)
      setIsLoading(false)
      setSimData(token)

      if (error) {
        console.log("was error")
        navigate('/error')
      }
      // if (simData == null) {
      //   console.log("simData was null")
      //   navigate('/error')
      // }

    }, 4000)
  }, [])

  return (
    <SimDataContext.Provider value={{ simData, isLoading, error }}>
      {children}
    </SimDataContext.Provider>
  );
};
