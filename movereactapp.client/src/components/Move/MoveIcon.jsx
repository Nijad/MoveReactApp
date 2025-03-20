/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { MoveUpOutlined } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import DraggableInputDialog from "../common/DraggableInputDialog";
import { appUrl } from "../../../URL";

function MoveIcon({ path, destination, canMove, setFiles }) {
  const [open, setOpen] = useState(false);
  const [yesTitle, setYesTitle] = useState("");
  const [msg, setMsg] = useState("");
  const [reason, setReason] = useState("");

  const handleClick = () => {
    if (!canMove) {
      setYesTitle("Ok");
      setMsg(
        "You are in destination (IN) folder. You can not move file from here."
      );
    } else {
      setYesTitle("Move");
      setMsg("Are you sure to move file?");
    }
    setOpen(true);
  };

  const MoveFile = () => {
    if (!path.toLowerCase().includes("\\in\\")) {
      let formData = new FormData();
      formData.append("File", path);
      formData.append("Destination", destination);
      formData.append("Reason", reason);

      axios
        .post(appUrl + `Move/MoveFile`, formData, {
          withCredentials: true,
        })
        .then((res) => {
          setFiles(res.data);
          enqueueSnackbar(`File moved successfuly.`, {
            variant: "success",
            anchorOrigin: { horizontal: "center", vertical: "top" },
            autoHideDuration: 5000,
          });
        })
        .catch((err) => {
          if (err.response.status == 403)
            enqueueSnackbar("You don't have permission to move files", {
              variant: "error",
              anchorOrigin: { horizontal: "center", vertical: "top" },
              autoHideDuration: 5000,
            });
          else
            enqueueSnackbar(err.response.data.msg, {
              variant: "error",
              anchorOrigin: { horizontal: "center", vertical: "top" },
              autoHideDuration: 5000,
            });
          console.log(err);
        });
    }
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="Move File">
        <IconButton color="primary" onClick={handleClick}>
          <MoveUpOutlined />
        </IconButton>
      </Tooltip>
      <DraggableInputDialog
        cancelTitle="Cancel"
        msg={msg}
        yesTitle={yesTitle}
        yesFunction={MoveFile}
        open={open}
        setOpen={setOpen}
        fullWidth={true}
        fieldName="Reason"
        setReason={setReason}
        displayInputField={canMove}
      />
    </>
  );
}

export default MoveIcon;
