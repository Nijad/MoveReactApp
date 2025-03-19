/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import axios from "axios";
import { Box, Button } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridRowModes,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import DraggableDialog from "../../components/common/DraggableDialog";
import { appUrl } from "../../../URL";

function EditToolbar(props) {
  const { setRows, setRowModesModel, page, pageSize, rows } = props;

  const handleClick = () => {
    const id = -Math.random();
    console.log("page no:", page);

    let i = 0;
    if (pageSize < 0) i = rows.length;
    else if (rows?.length == (page + 1) * pageSize)
      i = (page + 1) * pageSize - 1;
    else if (page == Math.floor(rows?.length / pageSize)) i = rows.length;
    else i = (page + 1) * pageSize - 1;

    const left = rows.slice(0, i);
    const right = rows.slice(i);

    setRows(
      left.concat(
        {
          id,
          extension: "",
          direction: "",
          isNew: true,
        },
        right
      )
    );

    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "extension" },
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

function Datagrid({ department, extensionsList }) {
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [ext, setExt] = useState();
  const [open, setOpen] = useState(false);
  const [contentHeigh, setContentHeigh] = useState();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(0);
  const [modalData, setModalData] = useState(null);

  const columns = [
    // {
    //   field: "id",
    //   headerName: "Id",
    //   width: 80,
    //   editable: true,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      field: "ext",
      headerName: "Extension",
      width: 220,
      editable: true,
      align: "center",
      headerAlign: "center",
      type: "singleSelect",
      valueOptions: extensionsList,
      flex: 2,
    },
    {
      field: "direction",
      headerName: "Direction",
      width: 220,
      editable: true,
      align: "center",
      headerAlign: "center",
      type: "singleSelect",
      flex: 2,
      valueOptions: [
        { key: "IN", label: "IN" },
        { key: "OUT", label: "OUT" },
        { key: "IN/OUT", label: "IN/OUT" },
      ],
      valueFormatter: (value) => {
        return value.key;
      },
      getOptionValue: (value) => value.key,
      getOptionLabel: (value) => value.label,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 220,
      cellClassName: "actions",
      flex: 1,
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
            key={"go" + id}
            icon={<ArrowOutwardIcon />}
            label="go"
            className="textPrimary"
            onClick={() => handleGoExtension(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key={"edit" + id}
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={() => handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key={"delete" + id}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleOpenDialog(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  useEffect(() => {
    if (pageSize == 0) setPageSize(100);
    axios
      .get(appUrl + `Departments/${department}`, {
        withCredentials: true,
      })
      .then((res) => {
        setRows(res.data.extensions);
      })
      .catch((err) => {
        enqueueSnackbar("Fetching extensions failed.", {
          variant: "error",
          anchorOrigin: { horizontal: "center", vertical: "top" },
          autoHideDuration: 5000,
        });
        console.log(err);
      });

    const content = document.getElementById("content");
    const y = content?.getBoundingClientRect().y;
    setContentHeigh(y);
  }, [enqueueSnackbar, department]);

  const handleGoExtension = (id) => {
    const row = rows.find((r) => r.id == id);
    window.open(`https://localhost:54785/extensions?ext=${row.ext}`, "_self");
  };

  const handleOpenDialog = (id) => {
    const row = rows.find((r) => r.id == id);
    setExt(row.ext);
    setOpen(true);
    setModalData(id);
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => {
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
    let formData = new FormData();
    formData.append("ext", deletedRow.ext);
    formData.append("dept", department);
    axios
      .post(appUrl + `ExtDept/Delete`, formData, {
        withCredentials: true,
      })
      .then((/*res*/) => {
        setRows(rows.filter((row) => row.id !== id));
        enqueueSnackbar(
          `Unmap ${department} and ${deletedRow.extension} successfuly`,
          {
            variant: "success",
            anchorOrigin: { horizontal: "center", vertical: "top" },
            autoHideDuration: 5000,
          }
        );
      })
      .catch((err) => {
        enqueueSnackbar(
          `Unmapping ${department} and ${deletedRow.ext} failed.`,
          {
            variant: "error",
            anchorOrigin: { horizontal: "center", vertical: "top" },
            autoHideDuration: 5000,
          }
        );
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

  const processRowUpdate = (newRow, originalRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    //here send data to server
    if (newRow.id < 0) {
      let formData = new FormData();
      formData.append("id", newRow.id);
      formData.append("ext", newRow.ext);
      formData.append("department", department);
      formData.append("direction", newRow.direction);

      axios
        .post(appUrl + `ExtDept/dept`, formData, {
          withCredentials: true,
        })
        .then((res) => {
          enqueueSnackbar(
            `Department ${department} and extension ${newRow.extension} mapped successfuly.`,
            {
              variant: "success",
              anchorOrigin: { horizontal: "center", vertical: "top" },
              autoHideDuration: 5000,
            }
          );
          setRows(res.data);
        })
        .catch((err) => {
          enqueueSnackbar(
            `Mapping ${department} and ${newRow.extension} failed.`,
            {
              variant: "error",
              anchorOrigin: { horizontal: "center", vertical: "top" },
              autoHideDuration: 5000,
            }
          );
          const editedRow = rows.find((row) => row.id === newRow.id);
          if (editedRow.isNew)
            setRows(rows.filter((row) => row.id !== newRow.id));
          console.log(err);
        });
    } else if (newRow.ext == originalRow.ext) {
      let formData = new FormData();
      formData.append("ext", newRow.ext);
      formData.append("dept", department);
      formData.append("direction", newRow.direction);
      //formData.append("from", "dept");

      axios
        .post(appUrl + `ExtDept/Update`, formData, {
          withCredentials: true,
        })
        .then((res) => {
          enqueueSnackbar(
            `Department ${department} mapped extension ${originalRow.ext} updated successfuly.`,
            {
              variant: "success",
              anchorOrigin: { horizontal: "center", vertical: "top" },
              autoHideDuration: 5000,
            }
          );
        })
        .catch((err) => {
          enqueueSnackbar(
            `updating mapped ${department} and ${originalRow.ext} failed.`,
            {
              variant: "error",
              anchorOrigin: { horizontal: "center", vertical: "top" },
              autoHideDuration: 5000,
            }
          );
          setRows(rows);
          console.log(err);
        });
    } else {
      enqueueSnackbar(
        `It is not allowed to edit extension name. You can only add and delete extension.`,
        {
          variant: "error",
          anchorOrigin: { horizontal: "center", vertical: "top" },
          autoHideDuration: 5000,
        }
      );
      setRows(rows);
    }

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

  const handlePageChange = (newPage) => {
    setPage(newPage.page);
    setPageSize(newPage.pageSize);
  };

  return (
    <div>
      <DraggableDialog
        title="Unmapping Department"
        msg={`Are you sure to unmap ${department} and ${ext}?`}
        yesTitle="Delete"
        cancelTitle="Cancel"
        open={open}
        setOpen={setOpen}
        yesFunction={handleDeleteClick}
        fullWidth={true}
        maxWidth="sm"
        modalData={modalData}
      />

      <Box
        id="content"
        sx={{
          height: `calc(100vh - ${contentHeigh + 16}px)`,
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
          onPaginationModelChange={(params) => handlePageChange(params)}
          processRowUpdate={processRowUpdate}
          slots={{ toolbar: EditToolbar }}
          slotProps={{
            toolbar: {
              setRows,
              setRowModesModel,
              page,
              pageSize,
              rows,
            },
          }}
          onRowClick={handleClick}
          pageSizeOptions={[5, 10, 25, 100, { value: -1, label: "All" }]}
          sx={{ fontSize: { lg: "1em", xl: "1.1em" } }}
          hideFooterSelectedRowCount={true}
        />
      </Box>
    </div>
  );
}

export default Datagrid;
