/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import {
  Card,
  CardContent,
  Grid2,
  Table,
  TableHead,
  Typography,
} from "@mui/material";

function FileListView({ files }) {
  return (
    <Grid2>
      <Card sx={{ marginBottom: "1px", backgroundColor: "lightgray" }}>
        <CardContent sx={{ padding: "8px !important" }}>
          <Grid2 container direction="row">
            <Grid2 size={6}>
              <Typography fontWeight={800}>File Name</Typography>
            </Grid2>
            <Grid2 size={2} textAlign="center">
              <Typography fontWeight={800}>Extension</Typography>
            </Grid2>
            <Grid2 size={2} textAlign="center">
              <Typography fontWeight={800}>File Size (MB)</Typography>
            </Grid2>
            <Grid2 size={2} textAlign="end">
              <Typography fontWeight={800}>Action</Typography>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>
      {files.map((file, index) => (
        <Card key={index} sx={{ marginBottom: "1px" }}>
          <CardContent sx={{ padding: "8px !important" }}>
            <Grid2 container direction="row">
              <Grid2 size={6}>{file.name}</Grid2>
              <Grid2 size={2} textAlign="center">
                {file.extension}
              </Grid2>
              <Grid2 size={2} textAlign="center">
                {Math.round((file.length / 1024 / 1024) * 100) / 100}
              </Grid2>
              <Grid2 size={2} textAlign="end">
                Action
              </Grid2>
            </Grid2>
          </CardContent>
        </Card>
      ))}
    </Grid2>
  );
}

export default FileListView;
