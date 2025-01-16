import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { AppBar, Box, Button, Stack, Toolbar } from "@mui/material";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <AppBar>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Button
              variant="text"
              href="/"
              color="inherit"
              startIcon={<FileCopyIcon />}
            >
              Move App
            </Button>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button variant="text" href="/departments" color="inherit">
              Departments
            </Button>
            <Button variant="text" href="/extensions" color="inherit">
              Extensions
            </Button>
            <Button variant="text" href="/configurations" color="inherit">
              Configurations
            </Button>
            <Button variant="text" href="#" color="inherit">
              Move Manually
            </Button>
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
