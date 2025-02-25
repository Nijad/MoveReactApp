/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { Box, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import MoveIcon from "./MoveIcon";
import DeleteIcon from "./DeleteIcon";
import Header from "./Header";
import { enqueueSnackbar } from "notistack";
import axios from "axios";

function FileListView({
  destination,
  canMove,
  displayDirectory,
  directory,
  setViewStyle,
}) {
  const [contentHeigh, setContentHeigh] = useState();
  const [files, setFiles] = useState([]);
  //const [viewStyle, setViewStyle] = useState("grid");
  useEffect(() => {
    if (directory !== undefined && directory !== null)
      axios
        .post(`https://localhost:7203/api/Move/GetFiles`, {
          directory: `${directory}`,
        })
        .then((res) => {
          setFiles(res.data);
        })
        .catch((err) => {
          enqueueSnackbar("Fetching files failed.", {
            variant: "error",
            anchorOrigin: { horizontal: "center", vertical: "top" },
            autoHideDuration: 5000,
          });
          console.log(err);
        });
    else setFiles([]);
  }, [directory]);
  const columns = [
    { field: "name", headerName: "File Name", flex: 7 },
    { field: "extension", headerName: "File Extension", flex: 2 },
    {
      field: "length",
      headerName: "File Size (MB)",
      flex: 2,
      valueGetter: (value) => {
        return Math.round((value / 1024 / 1024) * 100) / 100;
      },
    },
    {
      field: "actions",
      type: "actions",
      cellClassName: "actions",
      headerName: "Actions",
      flex: 1,
      getActions: ({ id }) => {
        return [
          <Box key={id}>
            <MoveIcon
              path={files.find((f) => f.id === id).path}
              destination={destination}
              canMove={canMove}
              setFiles={setFiles}
            />
            <DeleteIcon
              path={files.find((f) => f.id === id).path}
              destination={destination}
              setFiles={setFiles}
            />
          </Box>,
        ];
      },
    },
  ];

  const handleClick = (params, event) => {
    //console.log(params);
  };

  useEffect(() => {
    const content = document.getElementById("content");
    const y = content?.getBoundingClientRect().y;
    setContentHeigh(y);
  }, []);

  return (
    <>
      <Header
        directory={directory}
        displayDirectory={displayDirectory}
        files={files}
        setFiles={setFiles}
        setViewStyle={setViewStyle}
        viewStyle="list"
      />
      <Paper
        id="content"
        sx={{ height: `calc(100vh - ${contentHeigh + 16}px)`, width: "100%" }}
      >
        <DataGrid
          rows={files}
          columns={columns}
          hideFooterPagination
          onRowClick={handleClick}
        />
      </Paper>
    </>
  );
}

export default FileListView;
