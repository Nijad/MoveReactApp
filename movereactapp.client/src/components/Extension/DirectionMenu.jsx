/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Stack, Typography } from "@mui/material";

export default function DirectionMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [direction, setDirection] = useState("IN/OUT");
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (dir) => {
    setDirection(dir);
    setAnchorEl(null);
  };

  return (
    <Stack direction="row" alignItems="center">
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
      <Typography>{direction}</Typography>
    </Stack>
  );
}
