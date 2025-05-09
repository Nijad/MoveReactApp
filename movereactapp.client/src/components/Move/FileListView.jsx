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
import { appUrl } from "../../../URL";

function FileListView({
  destination,
  canMove,
  displayDirectory,
  directory,
  setViewStyle,
}) {
  const [contentHeigh, setContentHeigh] = useState();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (directory !== undefined && directory !== null) {
      let formData = new FormData();
      formData.append("directory", directory);

      axios
        .post(appUrl + `Move/GetFiles`, formData, {
          withCredentials: true,
        })
        .then((res) => {
          setFiles(res.data);
        })
        .catch((err) => {
          if (err.response.status == 403)
            enqueueSnackbar(
              "You do not have the permission to view files in the directory",
              {
                variant: "error",
                anchorOrigin: { horizontal: "center", vertical: "top" },
                autoHideDuration: 5000,
              }
            );
          else
            enqueueSnackbar(err.response.data.msg, {
              variant: "error",
              anchorOrigin: { horizontal: "center", vertical: "top" },
              autoHideDuration: 5000,
            });
          console.log(err);
        });
    } else setFiles([]);
  }, [directory]);

  const columns = [
    { field: "name", headerName: "File Name", flex: 7 },
    { field: "extension", headerName: "File Extension", flex: 2 },
    {
      field: "length",
      headerName: "File Size",
      flex: 2,
      valueFormatter: (value) => {
        if (value <= 1000) return value + " B";
        else if (value / 1024 <= 1024)
          return Math.round((value / 1024) * 100) / 100 + " KB";
        else if (value / 1024 / 1024 <= 1000)
          return Math.round((value / 1024 / 1024) * 100) / 100 + " MB";
        else
          return Math.round((value / 1024 / 1024 / 1024) * 100) / 100 + " GB";
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
