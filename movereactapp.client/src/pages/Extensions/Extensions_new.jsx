/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import {
  Box,
  Button,
  Grid2,
  InputBase,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ExtForm from "../../components/Extension/ExtForm";
import queryString from "query-string";
import { useSnackbar } from "notistack";
import axios from "axios";
import ExtDepts from "../../components/Extension/ExtDepts";

function Extensions_new() {
  const [ext, setExt] = useState();
  const [extensionsList, setExtensionsList] = useState([]);
  const [extensionDetails, setExtensionDetails] = useState({});
  const [departmnetsList, setDepartmentsList] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const handleQueryString = () => {
    // Parsing the query string from the window.location.search
    const queries = queryString.parse(window.location.search);
    if (queries.ext != undefined) handleExtClick(queries.ext);
  };

  const handleExtClick = (extension) => {
    setExt(extension);
    axios
      .get(`https://localhost:7203/api/Extensions/${extension}`)
      .then((res) => {
        setExtensionDetails(res.data);
      })
      .catch((err) => {
        enqueueSnackbar("Fetching extension details failed.", {
          variant: "error",
          anchorOrigin: { horizontal: "center", vertical: "top" },
          autoHideDuration: 5000,
        });
        console.log(err);
      });
  };

  const handleAddNewClick = () => {
    setExt(null);
    //add
  };

  useEffect(() => {
    axios
      .get("https://localhost:7203/api/Extensions/names")
      .then((res) => {
        setExtensionsList(res.data);
        handleQueryString();
      })
      .catch((err) => {
        enqueueSnackbar("Fetching extensions failed.", {
          variant: "error",
          anchorOrigin: { horizontal: "center", vertical: "top" },
          autoHideDuration: 5000,
        });
        console.log(err);
      });

    axios("https://localhost:7203/api/Departments/names")
      .then((res) => {
        setDepartmentsList(res.data);
      })
      .catch((err) => {
        enqueueSnackbar("Fetching departments name failed.", {
          variant: "error",
          anchorOrigin: { horizontal: "center", vertical: "top" },
          autoHideDuration: 5000,
        });
        console.log(err);
      });
  }, []);

  return (
    <Grid2
      container
      direction="row"
      columns={100}
      minHeight="calc(100vh - 64px)"
    >
      <Grid2
        container
        direction="column"
        size={{ md: 25, lg: 18, xl: 15 }}
        bgcolor="#1976d2"
      >
        <Grid2
          height="100px"
          borderBottom="1px solid white"
          display="flex"
          flexDirection="column"
          paddingX={2}
          alignItems="center"
          sx={{ justifyContent: "space-evenly" }}
        >
          <Button
            sx={{
              color: "#1976d2",
              backgroundColor: "white",
              width: "100%",
            }}
            size="small"
            onClick={() => handleAddNewClick()}
          >
            Add New Extension
          </Button>
          <Paper
            component="form"
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            <ManageSearchIcon sx={{ ml: 1, color: "#1976d2" }} />
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="filter"
              inputProps={{ "aria-label": "filter extension" }}
            />
          </Paper>
        </Grid2>
        <Grid2 overflow="auto" sx={{ direction: "rtl" }}>
          {extensionsList.map((e) => (
            <Box
              key={e}
              textAlign="center"
              marginX={2}
              marginY={1}
              borderRadius={1}
              bgcolor="white"
              color="#1976d2"
              boxShadow="10"
              paddingY={0.5}
              onClick={() => handleExtClick(e)}
              sx={{ cursor: "pointer" }}
            >
              <Typography sx={{ fontWeight: 500 }}>{e}</Typography>
            </Box>
          ))}
        </Grid2>
      </Grid2>
      <Grid2 size="grow" container direction="column" margin={2} spacing={2}>
        <Grid2>
          <Box borderRadius={1}>
            {ext === undefined ? (
              <span></span>
            ) : ext === null ? (
              <ExtForm isNew={true} ext="" enabled="" note="" program="" />
            ) : (
              <ExtForm
                isNew={false}
                ext={extensionDetails.ext}
                enabled={extensionDetails.enabled}
                note={extensionDetails.note}
                program={extensionDetails.program}
              />
            )}
          </Box>
        </Grid2>
        <Grid2>
          <Box>
            {ext != null ? (
              <ExtDepts
                extDepartmens={extensionDetails.departmens}
                allDepartments={departmnetsList}
              />
            ) : (
              <></>
            )}
          </Box>
        </Grid2>
      </Grid2>
    </Grid2>
  );
}

export default Extensions_new;
