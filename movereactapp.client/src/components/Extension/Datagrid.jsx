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
          department: "",
          direction: "",
          isNew: true,
        },
        right
      )
    );

    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "department" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add Department
      </Button>
    </GridToolbarContainer>
  );
}

function Datagrid({ extension, departmentsList }) {
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const [dept, setDept] = useState();
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
      field: "department",
      headerName: "Deptartment",
      width: 220,
      editable: true,
      align: "center",
      headerAlign: "center",
      type: "singleSelect",
      valueOptions: departmentsList,
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
            onClick={() => handleGoDepartment(id)}
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
      .get(appUrl + `Extensions/${extension}`, {
        withCredentials: true,
      })
      .then((res) => {
        setRows(res.data.departments);
      })
      .catch((err) => {
        enqueueSnackbar(err.response.data.msg, {
          variant: "error",
          anchorOrigin: { horizontal: "center", vertical: "top" },
          autoHideDuration: 5000,
        });
        console.log(err);
      });

    const content = document.getElementById("content");
    const y = content?.getBoundingClientRect().y;
    setContentHeigh(y);
  }, [enqueueSnackbar, extension]);

  const handleGoDepartment = (id) => {
    const row = rows.find((r) => r.id == id);
    window.open(
      `https://localhost:54785/departments?dept=${row.department}`,
      "_self"
    );
  };

  const handleOpenDialog = (id) => {
    const row = rows.find((r) => r.id == id);
    setDept(row.department);
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
    const deleteFormData = new FormData();
    deleteFormData.append("ext", extension);
    deleteFormData.append("dept", deletedRow.department);
    axios
      .post(appUrl + `ExtDept/Delete`, deleteFormData, {
        withCredentials: true,
      })
      .then((/*res*/) => {
        setRows(rows.filter((row) => row.id !== id));
        enqueueSnackbar(
          `Unmap ${extension} and ${deletedRow.department} successfuly`,
          {
            variant: "success",
            anchorOrigin: { horizontal: "center", vertical: "top" },
            autoHideDuration: 5000,
          }
        );
      })
      .catch((err) => {
        enqueueSnackbar(err.response.data.msg, {
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

  const processRowUpdate = (newRow, originalRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    //here send data to server
    if (newRow.id < 0) {
      console.log("add ext dept :", {
        Id: newRow.id,
        Ext: extension,
        Department: newRow.department,
        Direction: newRow.direction,
      });

      let formData = new FormData();
      formData.append("id", newRow.id);
      formData.append("ext", extension);
      formData.append("department", newRow.department);
      formData.append("direction", newRow.direction);

      axios
        .post(appUrl + `ExtDept/ext`, formData, {
          withCredentials: true,
        })
        .then((res) => {
          enqueueSnackbar(
            `Extension ${extension} and department ${newRow.department} mapped successfuly.`,
            {
              variant: "success",
              anchorOrigin: { horizontal: "center", vertical: "top" },
              autoHideDuration: 5000,
            }
          );
          setRows(res.data);
        })
        .catch((err) => {
          if (err.response.status == 403)
            enqueueSnackbar(
              "You do not have the permission to map the department with the extension",
              {
                variant: "error",
                anchorOrigin: { horizontal: "center", vertical: "top" },
                autoHideDuration: 5000,
              }
            );
          else
            enqueueSnackbar(err.response.data.msg, {
              variant: "error",
              anchorOrigin: { horizontal: "center", vertical: "top" },
              autoHideDuration: 5000,
            });
          const editedRow = rows.find((row) => row.id === newRow.id);
          if (editedRow.isNew)
            setRows(rows.filter((row) => row.id !== newRow.id));
          console.log(err.response.data.msg);
        });
    } else if (newRow.department == originalRow.department) {
      let putFormData = new FormData();
      putFormData.append("ext", extension);
      putFormData.append("dept", originalRow.department);
      putFormData.append("direction", newRow.direction);
      axios
        .post(appUrl + `ExtDept/Update`, putFormData, {
          withCredentials: true,
        })
        .then((res) => {
          enqueueSnackbar(
            `Extension ${extension} mapped department ${originalRow.department} updated successfuly.`,
            {
              variant: "success",
              anchorOrigin: { horizontal: "center", vertical: "top" },
              autoHideDuration: 5000,
            }
          );
        })
        .catch((err) => {
          if (err.response.status == 403)
            enqueueSnackbar(
              "You do not have the permission to update mapping the department with the extension",
              {
                variant: "error",
                anchorOrigin: { horizontal: "center", vertical: "top" },
                autoHideDuration: 5000,
              }
            );
          else
            enqueueSnackbar(err.response.data.msg, {
              variant: "error",
              anchorOrigin: { horizontal: "center", vertical: "top" },
              autoHideDuration: 5000,
            });
          setRows(rows);
          console.log(err);
        });
    } else {
      enqueueSnackbar(
        `It is not allowed to edit department name. You can only add and delete departmens.`,
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
    setDept(newRow.row.department);
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
        msg={`Are you sure to unmap ${extension} and ${dept}?`}
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
