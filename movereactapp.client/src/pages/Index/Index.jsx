import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import FileCopyIcon from "@mui/icons-material/FileCopy";
function Index() {
  return (
    <Box
      sx={{
        height: "400px",
        width: { xs: 100, sm: 600, md: 800, lg: 1200, xl: 1500 },
      }}
      alignContent="center"
    >
      <Typography align="center" variant="h3">
        <FileCopyIcon fontSize="inherit" />
        &nbsp; Welcome
      </Typography>
    </Box>
  );
}

export default Index;
