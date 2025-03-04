/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { Card, CardContent, CardHeader, Grid2, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import ConfigField from "../../components/Config/ConfigField";
import { appUrl } from "../../../URL";

function Configurations() {
  const [configs, setConfigs] = useState([]);

  useEffect(() => {
    //setConfigs(data);
    axios
      .get(appUrl + "Configurations", {
        withCredentials: true,
      })
      .then((res) => {
        setConfigs(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        enqueueSnackbar("Fetching configurations failed.", {
          variant: "error",
          anchorOrigin: { horizontal: "center", vertical: "top" },
          autoHideDuration: 5000,
        });
        console.log(err);
      });
  }, []);

  return (
    <Grid2 display="flex" justifyContent="center" paddingTop={5} paddingX={5}>
      <Card sx={{ width: { xl: "40%", lg: "50%", md: "75%", sm: "100%" } }}>
        <CardHeader title="Configurations" subheader="Program setup" />
        <CardContent>
          <Stack spacing={1}>
            {configs.map((fieldInfo, index) =>
              JSON.parse(fieldInfo.fieldProps).parent?.length > 0 ? (
                <></>
              ) : (
                <ConfigField key={index} fieldInfo={fieldInfo} />
              )
            )}
          </Stack>
        </CardContent>
      </Card>
    </Grid2>
  );
}

export default Configurations;
