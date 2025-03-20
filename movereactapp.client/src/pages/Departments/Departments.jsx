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
import queryString from "query-string";
import { useSnackbar } from "notistack";
import axios from "axios";
import DeptForm from "../../components/Department/DeptForm";
import Datagrid from "../../components/Department/Datagrid";
import { appUrl } from "../../../URL";

function Departemnts() {
  const [dept, setDept] = useState();
  const [extensionsList, setExtensionsList] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [departmentDetails, setDepartmentDetails] = useState({});
  const [contentHeigh, setContentHeigh] = useState();
  const [filter, setFilter] = useState("");
  const [filterList, setFilterList] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const handleQueryString = () => {
    // Parsing the query string from the window.location.search
    const queries = queryString.parse(window.location.search);
    if (queries.dept != undefined) handleDeptChange(queries.dept);
  };

  const handleDeptChange = (department) => {
    setDept(department);
    if (department != null)
      axios
        .get(appUrl + `Departments/${department}`, {
          withCredentials: true,
        })
        .then((res) => {
          setDepartmentDetails(res.data);
        })
        .catch((err) => {
          enqueueSnackbar(err.response.data.msg, {
            variant: "error",
            anchorOrigin: { horizontal: "center", vertical: "top" },
            autoHideDuration: 5000,
          });
          console.log(err);
        });
  };

  const handleDeptClick = (extension) => {
    history.pushState(
      null,
      null,
      `https://localhost:54785/departments?dept=${extension}`
    );
    handleDeptChange(extension);
  };

  const handleAddNewClick = () => {
    history.pushState(null, null, `https://localhost:54785/departments`);
    handleDeptChange(null);
    //add
  };

  const handleFilter = (e) => {
    setFilter(e.target.value);
    setFilterList(
      e.target.value.length > 0
        ? departmentsList.filter((x) => x.includes(e.target.value))
        : departmentsList
    );
  };

  const GetExtensionNames = () => {
    axios
      .get(appUrl + "Extensions/names", {
        withCredentials: true,
      })
      .then((res) => {
        setExtensionsList(res.data);
      })
      .catch((err) => {
        enqueueSnackbar(err.response.data.msg, {
          variant: "error",
          anchorOrigin: { horizontal: "center", vertical: "top" },
          autoHideDuration: 5000,
        });
        console.log(err);
      });
  };

  const GetDepartmentNames = () => {
    axios
      .get(appUrl + "Departments/names", {
        withCredentials: true,
      })
      .then((res) => {
        setDepartmentsList(res.data);
        setFilterList(res.data);
        handleQueryString();
      })
      .catch((err) => {
        enqueueSnackbar(err.response.data.msg, {
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
            Add New Department
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
              onClick={() => handleDeptClick(e)}
              sx={{ cursor: "pointer" }}
            >
              <Typography sx={{ fontWeight: 500 }}>{e}</Typography>
            </Box>
          ))}
        </Grid2>
      </Grid2>
      <Grid2 size="grow" container direction="column" margin={2} spacing={2}>
        <Grid2 id="head">
          <Box borderRadius={1}>
            {dept === undefined ? (
              <span></span>
            ) : dept === null ? (
              <>
                <Typography fontWeight="600">Extension Details</Typography>
                {
                  <DeptForm
                    isNew={true}
                    dept={null}
                    enabled={false}
                    note={null}
                    localPath={null}
                    netPath={null}
                    setDept={setDept}
                    setDepartmentsList={setDepartmentsList}
                    setFilterList={setFilterList}
                    departmentsList={departmentsList}
                  />
                }
              </>
            ) : (
              <>
                <Typography fontWeight="600">Department Details</Typography>
                <DeptForm
                  isNew={false}
                  dept={departmentDetails.dept}
                  enabled={departmentDetails.enabled}
                  note={departmentDetails.note}
                  localPath={departmentDetails.localPath}
                  netPath={departmentDetails.netPath}
                  setDept={setDept}
                  setDepartmentsList={setDepartmentsList}
                  setFilterList={setFilterList}
                  departmentsList={departmentsList}
                />
              </>
            )}
          </Box>
        </Grid2>
        <Grid2>
          <Box>
            {dept === undefined ? (
              <Box
                textAlign="center"
                alignContent="center"
                height="calc(100vh - 128px)"
                color="lightgray"
              >
                <Typography fontSize={48}>Select Departemnt</Typography>
                <Typography fontSize={48}>or Add New One</Typography>
              </Box>
            ) : dept !== null ? (
              <>
                <Typography fontWeight="600">Department Extensions</Typography>
                <Datagrid department={dept} extensionsList={extensionsList} />
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

export default Departemnts;
