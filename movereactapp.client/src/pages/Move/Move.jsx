/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  Grid2,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import FolderTree from "react-folder-tree";
import { enqueueSnackbar } from "notistack";
import FileGridView from "../../components/Move/FileGridView";
import { Delete, List, Apps } from "@mui/icons-material";
import FileListView from "../../components/Move/FileListView";

function Move() {
  const [tree, setTree] = useState({});
  const [files, setFiles] = useState([]);
  const [displayDirectory, setDisplayDirectory] = useState("\\\\");
  const [viewStyle, setViewStyle] = useState("grid");
  const treeState = {
    name: "root",
    isOpen: false,
    directory: "directory goes here",
    children: [
      { name: "children 1", checked: 0 },
      {
        name: "children 2",
        isOpen: false,
        children: [
          { name: "children 2-1", checked: 0 },
          { name: "children 2-2", checked: 1 },
        ],
      },
      {
        name: "folder 3",
        children: [
          {
            name: "folder 3",
            children: [
              {
                name: "folder 3",
                children: [
                  {
                    name: "folder 3",
                    children: [],
                    isOpen: false,
                  },
                  {
                    name: "folder 3",
                    children: [],
                    isOpen: false,
                  },
                ],
                isOpen: false,
              },
            ],
            isOpen: false,
          },
        ],
        isOpen: false,
      },
    ],
  };

  console.log(treeState);

  const onTreeStateChange = (state, event) => console.log(state, event);

  useEffect(() => {
    axios
      .get("https://localhost:7203/api/Move")
      .then((res) => {
        console.log(res.data);

        setTree(res.data);
      })
      .catch((err) => {
        enqueueSnackbar("Fetching department directories failed.", {
          variant: "error",
          anchorOrigin: { horizontal: "center", vertical: "top" },
          autoHideDuration: 5000,
        });
        console.log(err);
      });
  }, []);

  const handleClick = (data) => {
    setDisplayDirectory(data.nodeData.displayDirectory);
    if (data.nodeData.directory != null)
      axios
        .post(`https://localhost:7203/api/Move/GetFiles`, {
          directory: `${data.nodeData.directory}`,
        })
        .then((res) => {
          console.log("files", res.data);

          setFiles(res.data);
        })
        .catch((err) => {
          enqueueSnackbar("Fetching files failed.", {
            variant: "error",
            anchorOrigin: { horizontal: "center", vertical: "top" },
            autoHideDuration: 5000,
          });
          console.log(err);
        });
    else setFiles({});
  };

  return (
    <Grid2
      container
      direction="row"
      columns={100}
      minHeight="calc(100vh - 64px)"
    >
      <Grid2
        container
        direction="column"
        size={{ md: 25, lg: 18, xl: 15 }}
        bgcolor="#1976d2"
        color="white"
        padding={2}
        fontSize="1.1em"
        sx={{ overflow: "auto" }}
      >
        <FolderTree
          showCheckbox={false}
          data={tree}
          onChange={onTreeStateChange}
          readOnly
          initOpenStatus={false}
          onNameClick={handleClick}
        />
      </Grid2>
      <Grid2 size="grow" container direction="column" margin={2} spacing={2}>
        {displayDirectory?.length > 0 ? (
          <Grid2>
            <Card>
              <CardHeader
                sx={{ color: "#1976d2" }}
                title={displayDirectory}
                subheader="Current Location"
                action={
                  files.length > 0 ? (
                    <Stack>
                      {viewStyle == "grid" ? (
                        <Tooltip title="List View" placement="top">
                          <IconButton
                            color="primary"
                            onClick={() => setViewStyle("list")}
                          >
                            <List />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Grid View" placement="top">
                          <IconButton
                            color="primary"
                            onClick={() => setViewStyle("grid")}
                          >
                            <Apps />
                          </IconButton>
                        </Tooltip>
                      )}

                      <Tooltip title="Delete All" placement="bottom">
                        <IconButton color="error">
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  ) : null
                }
              />
            </Card>
          </Grid2>
        ) : (
          <></>
        )}
        {viewStyle == "grid" ? (
          <FileGridView files={files} />
        ) : (
          <FileListView files={files} />
        )}
      </Grid2>
    </Grid2>
  );
}

export default Move;
