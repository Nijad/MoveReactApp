/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { DeleteOutlined, MoveUpOutlined } from "@mui/icons-material";
import {
  Card,
  CardActions,
  CardContent,
  Grid2,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";

function FileGridView({ files }) {
  return (
    <Grid2
      container
      spacing={2}
      direction="row"
      display="flex"
      flexWrap="wrap"
      justifyContent="flex-start"
    >
      {files.length > 0 ? (
        files.map((file, index) => (
          <Grid2
            display="flex"
            key={index}
            size={{ xl: 1.5, lg: 2, md: 3, sm: 6, xs: 12 }}
          >
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Tooltip title={file.name} placement="top-start">
                <CardContent sx={{ paddingBottom: "0" }}>
                  <Typography noWrap fontWeight={500}>
                    {file.name}
                  </Typography>
                  <Typography noWrap>
                    <b>Extension:</b> {file.extension}
                  </Typography>
                  <Typography>
                    <b>Size:</b>{" "}
                    {Math.round((file.length / 1024 / 1024) * 100) / 100} MB
                  </Typography>
                </CardContent>
              </Tooltip>
              <CardActions
                sx={{ paddingTop: "0", justifyContent: "space-between" }}
              >
                <IconButton color="primary">
                  <MoveUpOutlined />
                </IconButton>

                <IconButton color="error">
                  <DeleteOutlined />
                </IconButton>
              </CardActions>
            </Card>
          </Grid2>
        ))
      ) : (
        <Grid2
          container
          size="grow"
          direction="column"
          textAlign="center"
          alignContent="center"
          height="calc(100vh - 200px)"
          color="lightgray"
          justifyContent="center"
        >
          <Typography fontSize={48}>Empty Folder</Typography>
          <Typography fontSize={48}>No Files</Typography>
        </Grid2>
      )}
    </Grid2>
  );
}

export default FileGridView;
