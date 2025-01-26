import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { AppBar, Box, Stack, Toolbar } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import FilterIcon from "@mui/icons-material/Filter";
import LineStyleIcon from "@mui/icons-material/LineStyle";
import HomeIcon from "@mui/icons-material/Home";
import { Outlet } from "react-router-dom";
import AppBarLink from "../components/AppBarLink";

const Layout = () => {
  return (
    <>
      <AppBar>
        <Toolbar style={{ padding: "0" }}>
          <Stack
            direction="row"
            spacing={0}
            sx={{ flexGrow: 1 }}
            alignItems="center"
          >
            <AppBarLink title="HOME" link="/" icon={<HomeIcon />} />
          </Stack>
          <Stack direction="row" spacing={0}>
            <AppBarLink
              title="DEPARTEMENTS"
              link="/departments"
              icon={<LineStyleIcon />}
            />
            <AppBarLink
              title="EXTENSIONS"
              link="/extensions"
              icon={<FilterIcon />}
            />
            <AppBarLink
              title="CONFIG"
              link="/configurations"
              icon={<SettingsIcon />}
            />
            <AppBarLink title="MOVE" link="#" icon={<DriveFileMoveIcon />} />
          </Stack>
        </Toolbar>
      </AppBar>
      <Box paddingTop={10} alignContent="center" sx={{ width: "100vw" }}>
        <Outlet />
      </Box>
    </>
  );
};

export default Layout;
