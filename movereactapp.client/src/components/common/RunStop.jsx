/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import StopCircleIcon from "@mui/icons-material/StopCircle";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import { useEffect, useState } from "react";
import AppBarButton from "./AppBarButton";
import axios from "axios";
import { appUrl } from "../../../URL";
import { enqueueSnackbar } from "notistack";
import { useData } from "../../DataContext";
function RunStop() {
  const { data, loading, error } = useData();
  const handleClick = () => {
    let formData = new FormData();
    formData.append("statusId", data.statusId);
    axios
      .post(appUrl + "TerminalProgram/StartStop", formData, {
        withCredentials: true,
      })
      .then((res) => {
        let msg = "";
        if (data.statusId == 0) msg = "run";
        else msg = "stopped";
        enqueueSnackbar(`Terminal ${msg} successfuly.`, {
          variant: "success",
          anchorOrigin: { horizontal: "center", vertical: "top" },
          autoHideDuration: 5000,
        });
      })
      .catch((err) => {
        if (err.response.status == 403)
          enqueueSnackbar("You do not have the permission to add extensions", {
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
  };

  return (
    <>
      {data?.statusId == 1 ? (
        <AppBarButton
          title="Stop"
          action={() => handleClick()}
          color="red"
          icon={<StopCircleIcon />}
        />
      ) : data?.statusId == 2 ? (
        <AppBarButton
          title="Terminate"
          action={() => handleClick()}
          color="red"
          icon={<DisabledByDefaultIcon />}
        />
      ) : (
        <AppBarButton
          title="Run"
          action={() => handleClick()}
          color="green"
          icon={<PlayCircleFilledIcon />}
        />
      )}
    </>
  );
}

export default RunStop;
