import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { AppBar, Box, Button, Icon, Link, Stack, Toolbar } from "@mui/material";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { Outlet } from "react-router-dom";
import AppBarLink from "../components/AppBarLink";

const Layout = () => {
  return (
    <>
      <AppBar>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <FileCopyIcon />
            <AppBarLink title="MOVE APP" link="/" />
          </Box>
          <Stack direction="row" spacing={2}>
            <AppBarLink title="DEPARTEMENTS" link="/departments" />
            <AppBarLink title="EXTENSIONS" link="/extensions" />
            <AppBarLink title="CONFIGURATIONS" link="/configurations" />
            <AppBarLink title="MOVE" link="#" />
          </Stack>
        </Toolbar>
      </AppBar>
      <Box marginY={10} marginX={3}>
        <Outlet />
      </Box>
    </>
  );
};

export default Layout;
