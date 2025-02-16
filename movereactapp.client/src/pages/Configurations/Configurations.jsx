/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { Card, CardContent, CardHeader, Grid2, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import ConfigField from "../../components/Config/ConfigField";

function Configurations() {
  const [configs, setConfigs] = useState([]);

  const data = [
    {
      order: 1,
      key: "Backup_Path",
      value:
        "\\\\192.168.10.197\\C$Users\\khourynj\\Desktop\\test_move\\audit\\",
      fieldProps:
        '{"desc": "path to backup directory", "props": {}, "dataType": "text"}',
    },
    {
      order: 2,
      key: "Duration",
      value: "5,s",
      fieldProps:
        '{"desc": "time duration to pause program after each loop", "child": {"desc": "time unit (second, minute, hour)", "props": {"data": [{"label": "Second", "value": "s"}, {"label": "Minute", "value": "m"}, {"label": "Hour", "value": "h"}]}, "parent": "Duration", "dataType": "select"}, "props": {"max": 59, "min": 0}, "dataType": "number"}',
    },
    {
      order: 3,
      key: "Max_File_Size",
      value: "30,M",
      fieldProps:
        '{"desc": "maximum size allowed to move", "child": {"desc": "size unit (KB, MB, GB)", "props": {"data": [{"label": "KB", "value": "K"}, {"label": "MB", "value": "M"}, {"label": "GB", "value": "G"}]}, "parent": "Max_File_Size", "dataType": "select"}, "props": {"min": 0}, "dataType": "number"}',
    },
    {
      order: 4,
      key: "Admins",
      value: "mourado,daouda",
      fieldProps:
        '{"desc": "windows users separated by comma \\",\\"", "props": {}, "dataType": "text"}',
    },
    {
      order: 5,
      key: "Developers",
      value: "khourynj,saabn",
      fieldProps:
        '{"desc": "windows users separated by comma \\",\\"", "props": {}, "dataType": "text"}',
    },
  ];

  useEffect(() => {
    //setConfigs(data);
    axios
      .get("https://localhost:7203/api/Configurations")
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
