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
    axios
      .put(`https://localhost:7203/api/Configurations`, {
        key: fieldInfo.key,
        value: fieldInfo.value,
      })
      .then((res) => {
        enqueueSnackbar(`Updating ${fieldInfo.key} successfuly.`, {
          variant: "success",
          anchorOrigin: { horizontal: "center", vertical: "top" },
          autoHideDuration: 5000,
        });
      })
      .catch((err) => {
        enqueueSnackbar(`Updating ${fieldInfo.key} failed.`, {
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
        <Grid2 justifyContent="flex-end" display="flex">
          <ButtonGroup direction="row">
            <IconButton
              color="primary"
              loading={false}
              onClick={() => handleSave()}
            >
              <SaveIcon />
            </IconButton>
          </ButtonGroup>
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
