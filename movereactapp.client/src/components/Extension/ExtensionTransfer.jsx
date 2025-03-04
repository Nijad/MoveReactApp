/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import * as React from "react";
import {
  ListItem,
  Grid2,
  List,
  Card,
  CardHeader,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Button,
  Divider,
  Stack,
} from "@mui/material";
import DirectionMenu from "./DirectionMenu";

function not(a, b) {
  return a.filter((value) => !b.includes(value));
}

function intersection(a, b) {
  return a.filter((value) => b.includes(value));
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

export default function ExtensionTransfer({ choisesList, chosenList }) {
  const [checked, setChecked] = React.useState([]);
  const [left, setLeft] = React.useState(choisesList);
  const [right, setRight] = React.useState(chosenList);
  const [listHeigh, setListHeigh] = React.useState();
  const [direction, setDirection] = React.useState();
  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);

    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (title, items) => {
    return (
      <Card sx={{ width: "100%" }}>
        <CardHeader
          sx={{ px: 2, py: 1 }}
          avatar={
            <Checkbox
              onClick={handleToggleAll(items)}
              checked={
                numberOfChecked(items) === items?.length && items?.length !== 0
              }
              indeterminate={
                numberOfChecked(items) !== items?.length &&
                numberOfChecked(items) !== 0
              }
              disabled={items?.length === 0}
              inputProps={{
                "aria-label": "all items selected",
              }}
            />
          }
          title={title}
          subheader={`${numberOfChecked(items)}/${items?.length} selected`}
        />
        <Divider />
        <List
          className="list"
          sx={{
            height: `calc(100vh - ${listHeigh + 50}px)`,
            bgcolor: "background.paper",
            overflow: "auto",
          }}
          dense
          component="div"
          role="list"
        >
          {items.map((value, index) => {
            const labelId = `transfer-list-all-item-${value}-label`;
            return (
              <ListItemButton
                key={index}
                role="listitem"
                onClick={handleToggle(value)}
              >
                <ListItemIcon>
                  <Checkbox
                    checked={checked.includes(value)}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{
                      "aria-labelledby": labelId,
                    }}
                  />
                </ListItemIcon>
                <ListItem>
                  <ListItemText
                    id={labelId}
                    primary={`${value?.department ? value?.department : value}`}
                  />
                  <Stack direction="row" alignItems="center">
                    <DirectionMenu
                      direction={value?.direction ? value?.direction : "IN/OUT"}
                      setDirection={setDirection}
                    />
                  </Stack>
                </ListItem>
              </ListItemButton>
            );
          })}
        </List>
      </Card>
    );
  };

  React.useEffect(() => {
    const list = document.getElementsByClassName("list");
    const y = list[0]?.getBoundingClientRect().y;
    setListHeigh(y);
  }, []);

  return (
    <Grid2 container spacing={2} size="grow">
      <Grid2 item size="grow">
        {customList("Unmapped", left)}
      </Grid2>
      <Grid2 item display="flex" alignSelf="center">
        <Grid2 container direction="column">
          <Button
            sx={{ height: "35px", width: "100px", my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            Map &gt;&gt;
          </Button>
          <Button
            sx={{ height: "35px", width: "100px", my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;&lt; Unmap
          </Button>
        </Grid2>
      </Grid2>
      <Grid2 item size="grow">
        {customList("Mapped", right)}
      </Grid2>
    </Grid2>
  );
}
