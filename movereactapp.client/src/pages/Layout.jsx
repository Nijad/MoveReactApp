import { AppBar } from "@mui/material";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <Outlet />
    </>
  );
}

export default Layout;
