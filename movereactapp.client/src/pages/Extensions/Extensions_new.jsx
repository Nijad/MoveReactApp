/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { AccountCircle } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Divider,
  Grid2,
  IconButton,
  InputBase,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

function Extensions_new() {
  const ext = [
    "doc",
    "docx",
    "xls",
    "xlsx",
    // "ppt",
    // "pptx",
    // "jpg",
    // "jpeg",
    // "png",
    // "gif",
    // "zip",
    // "rar",
    // "py",
    // "cs",
    // "vb",
    // "js",
    // "css",
  ];
  return (
    <Grid2 container direction="row" columns={100} height="calc(100vh - 64px)">
      <Grid2
        container
        direction="column"
        size={{ md: 25, lg: 18, xl: 15 }}
        bgcolor="#1976d2"
        height="calc(100vh - 64px)"
      >
        <Grid2
          height="25%"
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
          >
            Add New Extension
          </Button>
          <Paper
            component="form"
            sx={{
              //p: "2px 4px",
              display: "flex",
              alignItems: "center",
              //marginX: 1,
              //marginTop: 2,
              //ml: 1,
              //flexGrow: 1,
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
        <Grid2 height="75%" overflow="auto" sx={{ direction: "rtl" }}>
          {ext.map((e) => (
            <Box
              key={e}
              textAlign="center"
              margin={1}
              bgcolor="white"
              color="#1976d2"
              borderRadius={1}
              boxShadow="10"
              paddingY={0.5}
            >
              <Typography sx={{ fontWeight: 500 }}>{e}</Typography>
            </Box>
          ))}
        </Grid2>
      </Grid2>
      <Grid2 size="grow" container direction="column">
        <Grid2 height="25%">
          <Typography>header</Typography>
        </Grid2>
        <Grid2 height="75%">
          <Typography>main</Typography>
        </Grid2>
      </Grid2>
    </Grid2>
  );
}

export default Extensions_new;
