/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { Apps, Delete, List, Refresh } from "@mui/icons-material";
import {
  Card,
  CardHeader,
  Grid2,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import axios from "axios";
import DraggableDialog from "../common/DraggableDialog";
import { useState } from "react";
import { appUrl } from "../../../URL";

function Header({
  displayDirectory,
  files,
  setFiles,
  directory,
  viewStyle,
  setViewStyle,
}) {
  const [open, setOpen] = useState(false);
  const getFiles = (directory) => {
    if (directory != null) {
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
          enqueueSnackbar("Fetching files failed.", {
            variant: "error",
            anchorOrigin: { horizontal: "center", vertical: "top" },
            autoHideDuration: 5000,
          });
          console.log(err);
        });
    } else setFiles([]);
  };

  const deleteConfirmation = () => {
    setOpen(true);
  };

  const deleteAll = () => {
    if (directory != null) {
      let formData = new FormData();
      formData.append("directory", directory);

      axios
        .post(appUrl + `Move/DeleteAll`, formData, {
          withCredentials: true,
        })
        .then((res) => {
          setFiles(res.data);
          enqueueSnackbar("All files deleted successfuly.", {
            variant: "success",
            anchorOrigin: { horizontal: "center", vertical: "top" },
            autoHideDuration: 5000,
          });
        })
        .catch((err) => {
          enqueueSnackbar("Some files were not deleted.", {
            variant: "error",
            anchorOrigin: { horizontal: "center", vertical: "top" },
            autoHideDuration: 5000,
          });
          console.log(err);
        });

      getFiles(directory);
    }
  };

  return (
    <>
      {displayDirectory?.length > 0 ? (
        <Grid2>
          <Card>
            <CardHeader
              sx={{ color: "#1976d2" }}
              title={displayDirectory}
              subheader="Current Location"
              action={
                files?.length > 0 ? (
                  <Stack direction="row">
                    <Tooltip title="Refresh" placement="bottom">
                      <IconButton
                        color="info"
                        onClick={() => getFiles(directory)}
                      >
                        <Refresh />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete All" placement="bottom">
                      <IconButton
                        color="error"
                        onClick={() => deleteConfirmation()}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                    {viewStyle == "grid" ? (
                      <Tooltip title="List View" placement="bottom">
                        <IconButton
                          color="primary"
                          onClick={() => setViewStyle("list")}
                        >
                          <List />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Grid View" placement="top">
                        <IconButton
                          color="primary"
                          onClick={() => setViewStyle("grid")}
                        >
                          <Apps />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                ) : null
              }
            />
          </Card>
          <DraggableDialog
            cancelTitle="Cancel"
            fullWidth={true}
            msg="Are you sure to delete all files from this folder?"
            title="Delete All Files"
            yesTitle="Delete All"
            yesFunction={deleteAll}
            open={open}
            setOpen={setOpen}
          />
        </Grid2>
      ) : (
        <></>
      )}
    </>
  );
}

export default Header;
