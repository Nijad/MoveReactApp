/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { Box, Button, Typography } from "@mui/material";
function AppBarButton({ title, action, color, icon = null }) {
  return (
    <Button
      sx={{
        height: 64,
        minWidth: 128,
        align: "center",
        alignContent: "center",
        color: { color },
        //borderRadius: 0,
        // "&:hover": {
        //   color: "#2196f3",
        //   backgroundColor: "#fefefe",
        // },
        backgroundColor: "white",
      }}
      onClick={action}
    >
      {icon === null ? (
        <Typography>{title}</Typography>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="space-evenly"
          height="100%"
        >
          {icon}
          <Typography variant="body2">{title}</Typography>
        </Box>
      )}
    </Button>
  );
}

export default AppBarButton;
