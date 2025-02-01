/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Stack, Typography } from "@mui/material";

export default function DirectionMenu({ direction, setDirection }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [dir, setDir] = useState(direction);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (dir) => {
    setAnchorEl(null);
    setDirection(dir);
    setDir(dir);
  };

  return (
    <Stack direction="row" alignItems="center">
      <>
        <IconButton onClick={handleClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={() => handleClose("IN/OUT")}>IN/OUT</MenuItem>
          <MenuItem onClick={() => handleClose("IN")}>IN</MenuItem>
          <MenuItem onClick={() => handleClose("OUT")}>OUT</MenuItem>
        </Menu>
      </>
      <Typography width={50}>{dir}</Typography>
    </Stack>
  );
}
