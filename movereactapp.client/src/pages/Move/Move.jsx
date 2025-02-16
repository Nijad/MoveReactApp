/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { Grid2 } from "@mui/material";
import FolderTree, { testData } from "react-folder-tree";

function Move() {
  const treeState = {
    name: "root",
    isOpen: false,
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
  const onTreeStateChange = (state, event) => console.log(state, event);
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
        size={{ md: 30, lg: 25, xl: 20 }}
        bgcolor="#1976d2"
        color="white"
        padding={2}
        fontSize="1.1em"
        sx={{ overflowX: "auto" }}
      >
        <FolderTree
          showCheckbox={false}
          data={treeState}
          onChange={onTreeStateChange}
          readOnly
          onNameClick={(d) => {
            console.log(d.nodeData);
          }}
        />
      </Grid2>
      <Grid2 size="grow" container direction="column" margin={2} spacing={2}>
        Files will display here
      </Grid2>
    </Grid2>
  );
}

export default Move;
