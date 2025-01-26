/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { Box, Grid2, Stack, Typography } from "@mui/material";
import React from "react";

function Extensions_new() {
  return (
    <Grid2 container direction="row">
      <Grid2 size={3} border="1px solid" height="100vh">
        <Typography>sidebar</Typography>
      </Grid2>
      <Grid2 size="grow" container direction="column">
        <Grid2 border="1px solid" height="25%">
          <Typography>header</Typography>
        </Grid2>
        <Grid2 border="1px solid" height="75%">
          <Typography>main</Typography>
        </Grid2>
      </Grid2>
    </Grid2>
  );
}

export default Extensions_new;
