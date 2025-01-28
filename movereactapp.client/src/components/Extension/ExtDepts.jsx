import { Grid2 } from "@mui/material";
import ExtDept from "./ExtDept";

function ExtDepts({ allDepartments, extDepartmens }) {
  return (
    <Grid2
      spacing={2}
      container
      display="flex"
      alignItems="center"
      sx={{ justifyContent: "space-evenly" }}
      border="1px solid lightGray"
      padding={2}
      borderRadius={1}
    >
      {allDepartments.map((d) => (
        <ExtDept key={d} department={d} />
      ))}
    </Grid2>
  );
}

export default ExtDepts;
