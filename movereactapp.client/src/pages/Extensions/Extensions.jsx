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
import Datagrid from "../../components/Extension/Datagrid";

function Extensions() {
  const [ext, setExt] = useState();
  const [extensionsList, setExtensionsList] = useState([]);
  const [extensionDetails, setExtensionDetails] = useState({});
  const [contentHeigh, setContentHeigh] = useState();
  const [filter, setFilter] = useState("");
  const [filterList, setFilterList] = useState([]);
  const [departmentsList, setDepartmentList] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const handleQueryString = () => {
    // Parsing the query string from the window.location.search
    const queries = queryString.parse(window.location.search);
    if (queries.ext != undefined) handleExtChange(queries.ext);
  };

  const handleExtChange = (extension) => {
    setExt(extension);
    if (extension != null)
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

  const handleExtClick = (extension) => {
    history.pushState(
      null,
      null,
      `https://localhost:54785/extensions?ext=${extension}`
    );
    handleExtChange(extension);
  };

  const handleAddNewClick = () => {
    history.pushState(null, null, `https://localhost:54785/extensions`);
    handleExtChange(null);
    //add
  };

  const handleFilter = (e) => {
    setFilter(e.target.value);
    setFilterList(
      e.target.value.length > 0
        ? extensionsList.filter((x) => x.includes(e.target.value))
        : extensionsList
    );
  };

  const GetExtensionNames = () => {
    axios
      .get("https://localhost:7203/api/Extensions/names")
      .then((res) => {
        setExtensionsList(res.data);
        setFilterList(res.data);
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
  };

  const GetDepartmentNames = () => {
    axios
      .get("https://localhost:7203/api/Departments/names")
      .then((res) => {
        setDepartmentList(res.data);
      })
      .catch((err) => {
        enqueueSnackbar("Fetching departments failed.", {
          variant: "error",
          anchorOrigin: { horizontal: "center", vertical: "top" },
          autoHideDuration: 5000,
        });
        console.log(err);
      });
  };

  useEffect(() => {
    GetExtensionNames();
    GetDepartmentNames();
    const content = document.getElementById("sidebar");
    const y = content?.getBoundingClientRect().y;
    setContentHeigh(y);
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
              value={filter}
              onChange={handleFilter}
            />
          </Paper>
        </Grid2>
        <Grid2
          id="sidebar"
          sx={{
            direction: "rtl",
            overflowY: "auto",
            height: `calc(100vh - ${contentHeigh}px)`,
          }}
        >
          {filterList.map((e, index) => (
            <Box
              key={index}
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
      <Grid2
        size="grow"
        //size={{ md: 75, lg: 82, xl: 85 }}
        // sx={{
        //   width: { md: "100%", lg: "70%" },
        //   marginX: "auto",
        // }}
        container
        direction="column"
        margin={2}
        spacing={2}
      >
        <Grid2 id="head">
          <Box borderRadius={1}>
            {ext === undefined ? (
              <span></span>
            ) : ext === null ? (
              <>
                <Typography fontWeight="600">Extension Details</Typography>
                <ExtForm
                  isNew={true}
                  ext={null}
                  enabled={false}
                  note={null}
                  program={null}
                  setExt={setExt}
                  setExtensionsList={setExtensionsList}
                  setFilterList={setFilterList}
                />
              </>
            ) : (
              <>
                <Typography fontWeight="600">Extension Details</Typography>
                <ExtForm
                  isNew={false}
                  ext={extensionDetails.ext}
                  enabled={extensionDetails.enabled}
                  note={extensionDetails.note}
                  program={extensionDetails.program}
                  setExt={setExt}
                  extensionsList={extensionsList}
                  setExtensionsList={setExtensionsList}
                  setFilterList={setFilterList}
                />
              </>
            )}
          </Box>
        </Grid2>
        <Grid2>
          <Box>
            {ext === undefined ? (
              <Box
                textAlign="center"
                alignContent="center"
                height="calc(100vh - 128px)"
                color="lightgray"
              >
                <Typography fontSize={48}>Select Extension</Typography>
                <Typography fontSize={48}>or Add New One</Typography>
              </Box>
            ) : ext !== null ? (
              <>
                <Typography fontWeight="600">Extension Departments</Typography>
                <Datagrid extension={ext} departmentsList={departmentsList} />
              </>
            ) : (
              <></>
            )}
          </Box>
        </Grid2>
      </Grid2>
    </Grid2>
  );
}

export default Extensions;
