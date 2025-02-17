/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { useEffect, useState } from "react";
import { Grid2 } from "@mui/material";
import axios from "axios";
import FolderTree from "react-folder-tree";
import { enqueueSnackbar } from "notistack";

function Move() {
  const [tree, setTree] = useState({});
  const [files, setFiles] = useState([]);
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
    console.log("directory: ", data.nodeData.directory);

    if (data.nodeData.directory != null)
      axios
        .post(`https://localhost:7203/api/Move/GetFiles`, {
          directory: `${data.nodeData.directory}`,
        })
        .then((res) => {
          console.log(res.data);

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
        Files will display here
      </Grid2>
    </Grid2>
  );
}

export default Move;
