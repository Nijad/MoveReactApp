/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import {
  Button,
  ButtonGroup,
  Grid2,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

function ConfigField({ fieldInfo }) {
  return (
    <Stack>
      <Grid2 container marginTop={1}>
        <Grid2
          size={2}
          display="flex"
          alignItems="center"
          //justifyContent="flex-end"
          paddingRight={2}
        >
          <Typography component="div" variant="body1">
            {fieldInfo.key}
          </Typography>
        </Grid2>
        <Grid2 size="grow">
          <TextField
            size="small"
            fullWidth
            id="outlined-basic"
            label="Outlined"
            variant="outlined"
            value={fieldInfo.value}
          />
        </Grid2>
        <Grid2 size={3} justifyContent="center" display="flex">
          <ButtonGroup direction="row">
            <Button size="small">Update</Button>
            <Button size="small">Cancel</Button>
          </ButtonGroup>
        </Grid2>
      </Grid2>
      <Grid2 container>
        <Grid2 offset={2}>
          <Typography variant="body2" marginY={1} color="darkGray">
            {fieldInfo.note}
          </Typography>
        </Grid2>
      </Grid2>
    </Stack>
  );
}

export default ConfigField;
