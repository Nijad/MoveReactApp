import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import FileCopyIcon from "@mui/icons-material/FileCopy";
function Index() {
  return (
    <Box
      sx={{
        height: "400px",
        width: "100%",
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
