/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import DirectionMenu from "./DirectionMenu";
import { useState } from "react";

function ExtDept({ department }) {
  const [direction, setDirection] = useState("IN/OUT");
  return (
    <Card>
      <CardHeader title={department} action={<Switch />} />
      <CardContent>
        <Stack direction="row" alignItems="center">
          <DirectionMenu setDirection={() => setDirection} />
          <Typography>{direction}</Typography>
        </Stack>
      </CardContent>
      <CardActions></CardActions>
    </Card>
  );
}

export default ExtDept;
