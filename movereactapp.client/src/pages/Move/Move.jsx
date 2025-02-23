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
import { Delete, List, Apps, Refresh } from "@mui/icons-material";
import FileListView from "../../components/Move/FileListView";

function Move() {
  const [tree, setTree] = useState({});
  const [files, setFiles] = useState({});
  const [displayDirectory, setDisplayDirectory] = useState("\\\\");
  const [nodeData, setNodeData] = useState({});
  const [viewStyle, setViewStyle] = useState("grid");

  useEffect(() => {
    axios
      .get("https://localhost:7203/api/Move")
      .then((res) => {
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

  const onTreeStateChange = (state, event) => {
    if (event?.path !== null) {
      const nodeData = getNodeData(event.path);
      if (nodeData !== undefined) {
        setData(nodeData);
        if (nodeData?.directory !== null) getFiles(nodeData?.directory);
      }
    }
  };

  const getNodeData = (treeNodePath) => {
    var treeCopy = { ...tree };
    treeNodePath.forEach((element) => {
      treeCopy = { ...treeCopy.children[element] };
    });
    return treeCopy;
  };

  const handleClick = (data) => {
    setData(data.nodeData);
    getFiles(data.nodeData.directory);
  };

  const setData = (nodeData) => {
    setNodeData(nodeData);
    setDisplayDirectory(nodeData.displayDirectory);
  };

  const getFiles = (directory) => {
    if (directory != null)
      axios
        .post(`https://localhost:7203/api/Move/GetFiles`, {
          directory: `${directory}`,
        })
        .then((res) => {
          setFiles(res);
        })
        .catch((err) => {
          enqueueSnackbar("Fetching files failed.", {
            variant: "error",
            anchorOrigin: { horizontal: "center", vertical: "top" },
            autoHideDuration: 5000,
          });
          console.log(err);
        });
    else setFiles([]);
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
                  files?.data?.length > 0 ? (
                    <Stack direction="row">
                      <Tooltip title="Refresh" placement="bottom">
                        <IconButton
                          color="info"
                          onClick={() => getFiles(nodeData?.directory)}
                        >
                          <Refresh />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete All" placement="bottom">
                        <IconButton color="error">
                          <Delete />
                        </IconButton>
                      </Tooltip>
                      {viewStyle == "grid" ? (
                        <Tooltip title="List View" placement="bottom">
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
          <FileGridView
            files={files?.data}
            destination={nodeData?.destination}
            canMove={nodeData?.canMove}
          />
        ) : (
          <FileListView
            files={files?.data}
            destination={nodeData?.destination}
            canMove={nodeData?.canMove}
          />
        )}
      </Grid2>
    </Grid2>
  );
}

export default Move;
