/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import {
  Card,
  CardContent,
  CardHeader,
  Grid2,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { appUrl } from "../../../URL";
import RunStop from "../../components/common/RunStop";
import { useData } from "../../DataContext";
function Terminal() {
  const [attributes, setAttributes] = useState({});
  const { data, loading, error } = useData();
  // const handleRefresh = () => {
  //   setInterval(() => {
  //     getAttributes();
  //   }, 5000);
  // };

  // const getAttributes = () => {
  //   axios
  //     .get(appUrl + "TerminalProgram", {
  //       withCredentials: true,
  //     })
  //     .then((res) => {
  //       setAttributes(res.data);
  //     })
  //     .catch((err) => {
  //       if (err.response.status == 403) {
  //         enqueueSnackbar("You don't have permission to view this page", {
  //           variant: "error",
  //           anchorOrigin: { horizontal: "center", vertical: "top" },
  //           autoHideDuration: 5000,
  //         });
  //         setTimeout(() => window.location.replace("/"), 5000);
  //       } else
  //         enqueueSnackbar(err.response.data.msg, {
  //           variant: "error",
  //           anchorOrigin: { horizontal: "center", vertical: "top" },
  //           autoHideDuration: 5000,
  //         });
  //       console.log(err);
  //     });
  // };
  // useEffect(() => {
  //   handleRefresh();
  // }, []);

  return (
    <Grid2 display="flex" justifyContent="center" paddingTop={5} paddingX={5}>
      <Card sx={{ width: { xl: "40%", lg: "50%", md: "75%", sm: "100%" } }}>
        <CardHeader
          title="Terminal Information"
          subheader="Executive Move Program Attributes"
          action={<RunStop />}
        />
        <CardContent>
          <Stack spacing={1}>
            <Stack>
              {
                <Grid2 container marginTop={1}>
                  <Grid2 size="grow">
                    <Typography color="primary">STATUS</Typography>
                    <Typography>{data?.statusDesc}</Typography>
                    <hr color="lightgray"></hr>

                    {data?.errorMessage != null ? (
                      <>
                        <Typography color="error">ERROR</Typography>
                        <Typography color="error">
                          {data?.errorMessage}
                        </Typography>
                        <hr color="lightgray"></hr>
                      </>
                    ) : (
                      <></>
                    )}

                    <Typography color="primary">START AT</Typography>
                    <Typography>{data?.startAt?.replace("T", " ")}</Typography>
                    <hr color="lightgray"></hr>

                    {data?.stopAt != null ? (
                      <>
                        <Typography color="primary">STOP AT</Typography>
                        <Typography>
                          {data?.stopAt?.replace("T", " ")}
                        </Typography>
                        <hr color="lightgray"></hr>
                      </>
                    ) : (
                      <></>
                    )}

                    <Typography color="primary">USER</Typography>
                    <Typography>{data?.user}</Typography>
                  </Grid2>
                </Grid2>
              }
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Grid2>
  );
}

export default Terminal;
