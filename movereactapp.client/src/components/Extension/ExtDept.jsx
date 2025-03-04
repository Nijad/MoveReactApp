/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Card, CardContent, CardHeader, IconButton, Link } from "@mui/material";
import DirectionMenu from "./DirectionMenu";
import CancelIcon from "@mui/icons-material/Close";

function ExtDept({ department }) {
  return (
    <Card>
      <CardHeader
        subheader={<Link href="#">{department}</Link>}
        action={
          <IconButton>
            <CancelIcon />
          </IconButton>
        }
      />
      <CardContent>
        <DirectionMenu />
      </CardContent>
    </Card>
  );
}

export default ExtDept;
