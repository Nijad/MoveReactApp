/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { Card, CardContent, CardHeader, Grid2, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import ConfigField from "../../components/Config/ConfigField";

function Configurations() {
  const [configs, setConfigs] = useState([]);
  console.log(configs);

  useEffect(() => {
    axios
      .get("https://localhost:7203/api/Configurations")
      .then((res) => {
        setConfigs(res.data);
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
      <Card sx={{ width: { xl: "50%", lg: "75%", md: "100%" } }}>
        <CardHeader title="Configurations" subheader="Program setup" />
        <CardContent>
          <Stack spacing={1}>
            {configs.map((fieldInfo, index) => (
              <ConfigField key={index} fieldInfo={fieldInfo} />
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Grid2>
  );
}

export default Configurations;
