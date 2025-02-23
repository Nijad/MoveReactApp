/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { Box, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import MoveIcon from "./MoveIcon";
import DeleteIcon from "./DeleteIcon";

function FileListView({ files, destination, canMove }) {
  const [contentHeigh, setContentHeigh] = useState();
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
            />
            <DeleteIcon
              path={files.find((f) => f.id === id).path}
              destination={destination}
            />
          </Box>,
        ];
      },
    },
  ];

  const handleClick = (params, event) => {
    console.log(params);
  };

  useEffect(() => {
    const content = document.getElementById("content");
    const y = content?.getBoundingClientRect().y;
    setContentHeigh(y);
  }, []);

  return (
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
  );
}

export default FileListView;
