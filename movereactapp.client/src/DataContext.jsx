/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// DataContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { appUrl } from "../URL";
import { enqueueSnackbar } from "notistack";
const DataContext = createContext();

export const DataProvider = ({ children, pollInterval = 5000 }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    axios
      .get(appUrl + "TerminalProgram", {
        withCredentials: true,
      })
      .then((res) => {
        setData(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        if (err.response.status == 403) {
          enqueueSnackbar("You don't have permission to view this page", {
            variant: "error",
            anchorOrigin: { horizontal: "center", vertical: "top" },
            autoHideDuration: 5000,
          });
          setTimeout(() => window.location.replace("/"), 5000);
        } else
          enqueueSnackbar(err.response.data.msg, {
            variant: "error",
            anchorOrigin: { horizontal: "center", vertical: "top" },
            autoHideDuration: 5000,
          });
        setError(err);
        console.log(err);
      })
      .finally(setLoading(false));
  };

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Set up polling
    const intervalId = setInterval(fetchData, pollInterval);

    // Cleanup
    return () => clearInterval(intervalId);
  }, [pollInterval]);

  return (
    <DataContext.Provider value={{ data, loading, error }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
