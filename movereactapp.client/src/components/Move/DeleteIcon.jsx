/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { IconButton, Tooltip } from "@mui/material";
import DraggableDialog from "../common/DraggableDialog";
import { useState } from "react";
import { DeleteOutline } from "@mui/icons-material";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

function DeleteIcon({ path, destination, setFiles }) {
  const [open, setOpen] = useState(false);
  const [yesTitle, setYesTitle] = useState("");
  const [msg, setMsg] = useState("");

  const handleClick = () => {
    setYesTitle("Delete");
    setMsg("Are you sure to delete file?");
    setOpen(true);
  };

  const DeleteFile = () => {
    axios
      .post(`https://localhost:7203/api/Move/DeleteFile`, {
        file: path,
        destination: destination,
      })
      .then((res) => {
        setFiles(res.data);
        enqueueSnackbar(`File deleted successfuly.`, {
          variant: "success",
          anchorOrigin: { horizontal: "center", vertical: "top" },
          autoHideDuration: 5000,
        });
      })
      .catch((err) => {
        enqueueSnackbar(`Deleting file failed.`, {
          variant: "error",
          anchorOrigin: { horizontal: "center", vertical: "top" },
          autoHideDuration: 5000,
        });
        console.log(err);
      });
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="Delete File">
        <IconButton color="error" onClick={handleClick}>
          <DeleteOutline />
        </IconButton>
      </Tooltip>
      <DraggableDialog
        cancelTitle="Cancel"
        msg={msg}
        yesTitle={yesTitle}
        yesFunction={DeleteFile}
        open={open}
        setOpen={setOpen}
        fullWidth
      />
    </>
  );
}

export default DeleteIcon;
