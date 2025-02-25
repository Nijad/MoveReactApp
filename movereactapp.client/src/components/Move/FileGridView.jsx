/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import {
  Card,
  CardActions,
  CardContent,
  Grid2,
  Tooltip,
  Typography,
} from "@mui/material";
import MoveIcon from "./MoveIcon";
import DeleteIcon from "./DeleteIcon";
import { useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";
import axios from "axios";
import Header from "./Header";

function FileGridView({
  directory,
  destination,
  canMove,
  displayDirectory,
  setViewStyle,
}) {
  const [files, setFiles] = useState([]);
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
  return (
    <>
      <Header
        directory={directory}
        displayDirectory={displayDirectory}
        files={files}
        setFiles={setFiles}
        viewStyle="grid"
        setViewStyle={setViewStyle}
      />
      <Grid2
        container
        spacing={2}
        direction="row"
        display="flex"
        flexWrap="wrap"
        justifyContent="flex-start"
      >
        {files?.length > 0 ? (
          files?.map((file, index) => (
            <Grid2
              display="flex"
              key={index}
              size={{ xl: 1.5, lg: 2, md: 3, sm: 6, xs: 12 }}
            >
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Tooltip title={file?.name} placement="top-start">
                  <CardContent sx={{ paddingBottom: "0" }}>
                    <Typography noWrap fontWeight={500}>
                      {file?.name}
                    </Typography>
                    <Typography noWrap>
                      <b>Extension:</b> {file?.extension}
                    </Typography>
                    <Typography>
                      <b>Size:</b>{" "}
                      {Math.round((file?.length / 1024 / 1024) * 100) / 100} MB
                    </Typography>
                  </CardContent>
                </Tooltip>
                <CardActions
                  sx={{ paddingTop: "0", justifyContent: "space-between" }}
                >
                  <MoveIcon
                    path={file?.path}
                    destination={destination}
                    canMove={canMove}
                    setFiles={setFiles}
                  />
                  <DeleteIcon
                    path={file?.path}
                    destination={destination}
                    setFiles={setFiles}
                  />
                </CardActions>
              </Card>
            </Grid2>
          ))
        ) : (
          <Grid2
            container
            size="grow"
            direction="column"
            textAlign="center"
            alignContent="center"
            height="calc(100vh - 200px)"
            color="lightgray"
            justifyContent="center"
          >
            <Typography fontSize={48}>Empty Folder</Typography>
            <Typography fontSize={48}>No Files</Typography>
          </Grid2>
        )}
      </Grid2>
    </>
  );
}

export default FileGridView;
