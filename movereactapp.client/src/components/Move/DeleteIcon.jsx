/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { IconButton, Tooltip } from "@mui/material";
import DraggableDialog from "../common/DraggableDialog";
import { useState } from "react";
import { DeleteOutline } from "@mui/icons-material";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { appUrl } from "../../../URL";

function DeleteIcon({ path, setFiles }) {
  const [open, setOpen] = useState(false);
  const [yesTitle, setYesTitle] = useState("");
  const [msg, setMsg] = useState("");

  const handleClick = () => {
    setYesTitle("Delete");
    setMsg("Are you sure to delete file?");
    setOpen(true);
  };

  const DeleteFile = () => {
    let formData = new FormData();
    formData.append("directory", path);

    axios
      .post(appUrl + `Move/DeleteFile`, formData, {
        withCredentials: true,
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
