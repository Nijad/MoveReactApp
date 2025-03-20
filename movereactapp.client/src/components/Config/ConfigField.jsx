/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import {
  ButtonGroup,
  Grid2,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import UnitMenu from "./UnitMenu";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { appUrl } from "../../../URL";

function ConfigField({ fieldInfo }) {
  const props = JSON.parse(fieldInfo.fieldProps);

  const handleValue = (comingValue, isUnitChange) => {
    if (isUnitChange !== undefined) {
      const [originalValue, originalUnit] = fieldInfo.value.split(",");
      if (isUnitChange)
        fieldInfo = { ...fieldInfo, value: originalValue + "," + comingValue };
      else
        fieldInfo = { ...fieldInfo, value: comingValue + "," + originalUnit };
    } else {
      fieldInfo = { ...fieldInfo, value: comingValue };
    }
  };

  const handleSave = () => {
    let formData = new FormData();
    formData.append("key", fieldInfo.key);
    formData.append("value", fieldInfo.value);
    axios
      .post(appUrl + `Configurations`, formData, {
        withCredentials: true,
      })
      .then((res) => {
        enqueueSnackbar(`Updating ${fieldInfo.key} successfuly.`, {
          variant: "success",
          anchorOrigin: { horizontal: "center", vertical: "top" },
          autoHideDuration: 5000,
        });
      })
      .catch((err) => {
        if (err.response.status == 403)
          enqueueSnackbar(
            "You do not have the permission to update configurations",
            {
              variant: "error",
              anchorOrigin: { horizontal: "center", vertical: "top" },
              autoHideDuration: 5000,
            }
          );
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
    <Stack>
      <Grid2 container marginTop={1}>
        <Grid2 size="grow">
          <Typography color="primary">
            {fieldInfo.key.replaceAll("_", " ")}
          </Typography>
          {props.child != undefined ? (
            <ButtonGroup direction="row" sx={{ width: "100%" }}>
              <TextField
                type={props.dataType}
                fullWidth
                size="small"
                id="outlined-basic"
                variant="standard"
                defaultValue={fieldInfo.value.split(",")[0]}
                focused
                onChange={(event) => handleValue(event.target.value, false)}
              />
              <UnitMenu
                child={props.child}
                itemValue={fieldInfo.value}
                handleValue={handleValue}
              />
            </ButtonGroup>
          ) : (
            <TextField
              type={props.dataType}
              fullWidth
              size="small"
              id="outlined-basic"
              variant="standard"
              defaultValue={fieldInfo.value}
              focused
              onChange={(event) => handleValue(event.target.value)}
            />
          )}
        </Grid2>
        <Grid2
          paddingTop={2}
          size={0.75}
          justifyContent="flex-end"
          display="flex"
        >
          <IconButton
            color="primary"
            loading={false}
            onClick={() => handleSave()}
          >
            <SaveIcon />
          </IconButton>
        </Grid2>
      </Grid2>
      <Grid2 container>
        <Grid2>
          <Typography variant="body2" marginY={1} color="darkGray">
            {props.desc}
          </Typography>
        </Grid2>
      </Grid2>
    </Stack>
  );
}

export default ConfigField;
