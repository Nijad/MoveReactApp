/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import {
  Button,
  ButtonGroup,
  Grid2,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import UnitMenu from "./UnitMenu";
import SaveIcon from "@mui/icons-material/Save";

function ConfigField({ fieldInfo }) {
  const props = JSON.parse(fieldInfo.fieldProps);
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
                fullWidth
                size="small"
                id="outlined-basic"
                variant="standard"
                defaultValue={fieldInfo.value.split(",")[0]}
                focused
              />
              <UnitMenu
                child={props.child}
                itemValue={fieldInfo.value.split(",")[1]}
              />
            </ButtonGroup>
          ) : (
            <TextField
              fullWidth
              size="small"
              id="outlined-basic"
              variant="standard"
              defaultValue={fieldInfo.value}
              focused
            />
          )}
        </Grid2>
        <Grid2 size={1} justifyContent="flex-end" display="flex">
          <ButtonGroup direction="row">
            <IconButton color="primary" loading={false}>
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
