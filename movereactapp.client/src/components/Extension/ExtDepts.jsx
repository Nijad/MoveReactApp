/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Card, Grid2, Stack } from "@mui/material";
import ExtDept from "./ExtDept";

function ExtDepts({ allDepartments, extDepartmens }) {
  const depts = [
    "ACCOUNTING",
    "ADMINISTRATIVE",
    "AUDIT",
    "BACK OFFICE",
    "CAMERA",
    "CENTRAL bANK",
    "COMPLIANCE",
    "CORPORATE",
    "CREDIT ADMINISTRATION",
    "ELECTRONIC PAYMENTS",
    "EXTERANAL AUDIT",
    "GM",
    "GM OFFICE",
    "HR",
    "IT-ICBS",
    "IT-NETWORK",
    "IT ADMINS",
    "IT AUDIT",
    "IT SECURITY",
    "INTERNATIONAL",
    "LEGAL",
    "MIS",
    "OPERATION",
    "OPERATOR",
    "ORGANIZATIONS & VIP",
    "RETAIL",
    "RISK",
    "TRADE SERVICES",
  ];
  return (
    <>
      <Stack direction="row" flexWrap="wrap">
        {depts.map((d) => (
          <Card
            sx={{
              margin: 0.5,
              paddingX: 0.75,
              paddingY: 0.25,
              color: "white",
              backgroundColor: "#1976d2",
            }}
            key={d}
          >
            {d}
          </Card>
        ))}
      </Stack>
      <Grid2
        spacing={2}
        container
        display="flex"
        alignItems="center"
        sx={{ justifyContent: "flex-start" }}
        border="1px solid lightGray"
        padding={2}
        borderRadius={1}
      >
        {allDepartments.map((d) => (
          <ExtDept key={d} department={d} />
        ))}
      </Grid2>
    </>
  );
}

export default ExtDepts;
