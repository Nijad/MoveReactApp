/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Box, Link, Typography } from "@mui/material";

function AppBarLink({ title, link, icon = null }) {
  return (
    <Link
      height={64}
      minWidth={128}
      align="center"
      alignContent="center"
      href={link}
      underline="none"
      color="white"
      sx={{
        "&:hover": {
          color: "#2196f3",
          backgroundColor: "#fefefe",
        },
      }}
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
    </Link>
  );
}

export default AppBarLink;
