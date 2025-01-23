/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { Typography, Box, Button, Grid2 } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import DraggableDialog from "../../components/DraggableDialog";
import { useSnackbar } from "notistack";

function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;
  const handleClick = () => {
    const id = -Math.random();
    setRows((oldRows) => [
      ...oldRows,
      { id, ext: "", program: "", note: "", enabled: "", isNew: true },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "ext" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add Extension
      </Button>
    </GridToolbarContainer>
  );
}
function Extensions() {
  const { enqueueSnackbar } = useSnackbar();
  const [extensions, setExtensions] = useState([]);
  const [rows, setRows] = useState(extensions);
  const [rowModesModel, setRowModesModel] = useState({});
  const [ext, setExt] = useState();
  const [open, setOpen] = useState(false);

  const columns = [
    {
      field: "id",
      headerName: "Id",
      width: 80,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "ext",
      headerName: "Extension",
      width: 120,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "program",
      headerName: "Program",
      width: 120,
      align: "center",
      headerAlign: "center",
      editable: true,
    },
    {
      field: "note",
      headerName: "Note",
      width: 240,
      editable: true,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "enabled",
      headerName: "Enabled",
      width: 120,
      editable: true,
      align: "center",
      headerAlign: "center",
      type: "boolean",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 120,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={"save" + id}
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={"cancel" + id}
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            key={"edit" + id}
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key={"delete" + id}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleOpenDialog(id)}
            //onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  useEffect(() => {
    axios
      .get("https://localhost:7203/api/Extensions")
      .then((res) => {
        setExtensions(res.data);
        setRows(res.data);
      })
      .catch((err) => {
        enqueueSnackbar("Fetching extensions failed.", {
          variant: "error",
          anchorOrigin: { horizontal: "center", vertical: "top" },
          autoHideDuration: 5000,
        });
        console.log(err);
      });
  }, []);

  const handleOpenDialog = (id) => {
    const row = rows.find((r) => r.id == id);
    setExt(row.ext);
    setOpen({ id: id, open: true });
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.Edit },
    });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View },
    });
  };

  const handleDeleteClick = (id) => {
    const deletedRow = rows.find((row) => row.id === id);
    axios
      .delete("https://localhost:7203/api/Extensions/" + deletedRow.ext)
      .then((/*res*/) => {
        setRows(rows.filter((row) => row.id !== id));
        enqueueSnackbar("Extension " + ext + " deleted successfuly.", {
          variant: "success",
          anchorOrigin: { horizontal: "center", vertical: "top" },
          autoHideDuration: 5000,
        });
      })
      .catch((err) => {
        enqueueSnackbar("Deleting " + ext + " failed.", {
          variant: "error",
          anchorOrigin: { horizontal: "center", vertical: "top" },
          autoHideDuration: 5000,
        });
        console.log(err);
      });
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    //here send data to server
    newRow.id < 0
      ? axios
          .post(
            "https://localhost:7203/api/Extensions",
            {
              id: newRow.id,
              ext: newRow.ext,
              program: newRow.program,
              note: newRow.note,
              enabled: newRow.enabled == "" ? false : true,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => {
            enqueueSnackbar("Extension " + newRow.ext + " added successfuly.", {
              variant: "success",
              anchorOrigin: { horizontal: "center", vertical: "top" },
              autoHideDuration: 5000,
            });
            setRows(res.data);
          })
          .catch((err) => {
            enqueueSnackbar("Adding " + ext + " failed.", {
              variant: "error",
              anchorOrigin: { horizontal: "center", vertical: "top" },
              autoHideDuration: 5000,
            });
            const editedRow = rows.find((row) => row.id === newRow.id);
            if (editedRow.isNew)
              setRows(rows.filter((row) => row.id !== newRow.id));
            console.log(err);
          })
      : axios
          .put(
            "https://localhost:7203/api/Extensions/" + ext,
            {
              id: newRow.id,
              ext: newRow.ext,
              program: newRow.program,
              note: newRow.note,
              enabled: newRow.enabled == "" ? false : true,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => {
            enqueueSnackbar(
              "Extension " + newRow.ext + " updated successfuly.",
              {
                variant: "success",
                anchorOrigin: { horizontal: "center", vertical: "top" },
                autoHideDuration: 5000,
              }
            );
            setRows(res.data);
          })
          .catch((err) => {
            enqueueSnackbar("Updating " + ext + " failed.", {
              variant: "error",
              anchorOrigin: { horizontal: "center", vertical: "top" },
              autoHideDuration: 5000,
            });
            setRows(rows);
            console.log(err);
          });
    return updatedRow;
  };

  const handleClick = (newRow) => {
    setExt(newRow.row.ext);
  };

  const handleProcessRowUpdateError = (error) => {
    console.log(error);
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  return (
    <div>
      <DraggableDialog
        title="Delete Extension"
        msg={`Are you sure to delete ${ext} extension?`}
        yesTitle="Delete"
        cancelTitle="Cancel"
        open={open}
        setOpen={setOpen}
        yesFunction={handleDeleteClick}
        fullWidth={true}
        maxWidth="sm"
      />
      <Typography variant="h4">Extensions Page</Typography>
      <Grid2 container spacing={2}>
        <Grid2 size={12}>
          <Box
            sx={{
              height: 500,
              width: "100%",
              "& .actions": {
                color: "text.secondary",
              },
              "& .textPrimary": {
                color: "text.primary",
              },
            }}
          >
            <DataGrid
              rows={rows}
              columns={columns}
              editMode="row"
              rowModesModel={rowModesModel}
              onRowModesModelChange={handleRowModesModelChange}
              onProcessRowUpdateError={handleProcessRowUpdateError}
              onRowEditStop={handleRowEditStop}
              processRowUpdate={processRowUpdate}
              slots={{ toolbar: EditToolbar }}
              slotProps={{
                toolbar: { setRows, setRowModesModel },
              }}
              onRowClick={handleClick}
              pageSizeOptions={[5, 10, 25, 100, { value: -1, label: "All" }]}
            />
          </Box>
        </Grid2>
        {/* <Grid2 size={6}>
          <Box
            sx={{
              height: 500,
              width: "100%",
              "& .actions": {
                color: "text.secondary",
              },
              "& .textPrimary": {
                color: "text.primary",
              },
            }}
          >
            <DataGrid
              rows={rows}
              columns={columns}
              editMode="row"
              rowModesModel={rowModesModel}
              onRowModesModelChange={handleRowModesModelChange}
              onProcessRowUpdateError={handleProcessRowUpdateError}
              onRowEditStop={handleRowEditStop}
              processRowUpdate={processRowUpdate}
              slots={{ toolbar: EditToolbar }}
              slotProps={{
                toolbar: { setRows, setRowModesModel },
              }}
              onRowClick={handleClick}
            />
          </Box>
        </Grid2> */}
      </Grid2>
    </div>
  );
}

export default Extensions;
