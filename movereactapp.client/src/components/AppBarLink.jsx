import { Link } from "@mui/material";

function AppBarLink({ title, link }) {
  return (
    <Link
      height={64}
      width={128}
      align="center"
      alignContent="center"
      href={link}
      underline="none"
      color="white"
      sx={{
        "&:hover": { backgroundColor: "white", fontWeight: "bold" },
      }}
    >
      {title}
    </Link>
  );
}

export default AppBarLink;
