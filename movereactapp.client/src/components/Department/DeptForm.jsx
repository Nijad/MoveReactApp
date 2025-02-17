/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Controller, useForm } from "react-hook-form";
import {
  Box,
  Button,
  FormControlLabel,
  FormLabel,
  Grid2,
  Switch,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import DraggableDialog from "../common/DraggableDialog";

function DeptForm({
  isNew,
  dept,
  enabled,
  note,
  localPath,
  netPath,
  setDept,
  setDepartmentsList,
  departmentsList,
  setFilterList,
}) {
  const [editable, setEditable] = useState(false);
  const [isNewRec, setIsNewRec] = useState(isNew);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [msg, setMsg] = useState("");
  const [yesTitle, setYesTitle] = useState("");
  const [cancelTitle, setCancelTitle] = useState("Cancel");
  const [yesFunction, setYesFunction] = useState();
  const [modalData, setModalData] = useState(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm({
    defaultValues: {
      enabled: enabled,
    },
  });

  const onSubmit = (data) => {
    try {
      //await new Promise((resolve) => setTimeout(resolve, 1000));
      //throw new Error("backend error");
      if (isNewRec) handleAddNewExtension(data);
      else handleOpenUpdateDialog(data);
    } catch (error) {
      setError("root", {
        message: error.message,
      });
    }
  };

  const handleAddNewExtension = (data) => {
    axios
      .post("https://localhost:7203/api/Departments", {
        ...data,
        Extensions: [],
      })
      .then((res) => {
        setDept(data.dept);
        setIsNewRec(false);
        setEditable(false);
        setDepartmentsList(res.data);
        setFilterList(res.data);

        history.pushState(
          null,
          null,
          `https://localhost:54785/departments?dept=${data.dept}`
        );
        enqueueSnackbar(`Extension ${data.dept} added successfuly.`, {
          variant: "success",
          anchorOrigin: { horizontal: "center", vertical: "top" },
          autoHideDuration: 5000,
        });
        //handleExtClick(data.ext);
      })
      .catch((err) => {
        enqueueSnackbar(`Adding new department ${data.dept} failed.`, {
          variant: "error",
          anchorOrigin: { horizontal: "center", vertical: "top" },
          autoHideDuration: 5000,
        });
        console.log(err);
      });
  };

  const handleUpdateExtension = (data) => {
    console.log(data);
    console.log({ ...data, Extensions: [] });

    axios
      .put(`https://localhost:7203/api/Departments/${dept}`, {
        ...data,
        Extensions: [],
      })
      .then((res) => {
        setEditable(false);

        enqueueSnackbar(`Department ${dept} updated successfuly.`, {
          variant: "success",
          anchorOrigin: { horizontal: "center", vertical: "top" },
          autoHideDuration: 5000,
        });
        //handleExtClick(data.ext);
      })
      .catch((err) => {
        enqueueSnackbar(`Updating department ${dept} failed.`, {
          variant: "error",
          anchorOrigin: { horizontal: "center", vertical: "top" },
          autoHideDuration: 5000,
        });
        console.log(err);
      });
  };

  const handleEdit = () => {
    setEditable(true);
  };

  const handleOpenDeleteDialog = () => {
    setTitle("Delete Department");
    setMsg(`Are you sure to delete ${dept}.`);
    setYesTitle("Delete");
    setCancelTitle("Cancel");
    setYesFunction(() => handleDelete);
    setOpen(true);
  };

  const handleOpenUpdateDialog = (data) => {
    setTitle("Update Department");
    setMsg(`Are you sure to Update ${dept} information.`);
    setYesTitle("Update");
    setCancelTitle("Cancel");
    setYesFunction(() => handleUpdateExtension);
    setModalData(data);
    setOpen(true);
  };

  const handleDelete = () => {
    try {
      axios
        .delete(`https://localhost:7203/api/Departments/${dept}`)
        .then((res) => {
          //setFilterList(res.data);
          setDepartmentsList(departmentsList.filter((x) => x != dept));
          setFilterList(departmentsList.filter((x) => x != dept));
          setDept(undefined);
          history.pushState(null, null, `https://localhost:54785/Departments`);

          enqueueSnackbar(`Extension ${dept} deleted successfuly.`, {
            variant: "success",
            anchorOrigin: { horizontal: "center", vertical: "top" },
            autoHideDuration: 5000,
          });
        })
        .catch((err) => {
          enqueueSnackbar("Deleteing departments failed.", {
            variant: "error",
            anchorOrigin: { horizontal: "center", vertical: "top" },
            autoHideDuration: 5000,
          });
          console.log(err);
        });
    } catch (error) {
      setError("root", {
        message: error.message,
      });
    }
  };

  const handleCancel = () => {
    if (isNewRec) setDept(undefined);
    reset();
    setEditable(false);
  };

  useEffect(() => {
    reset({
      dept: dept,
      netPath: netPath,
      localPath: localPath,
      note: note,
      enabled: enabled,
    });
    setIsNewRec(isNew);
  }, [isNew, dept, netPath, localPath, note, enabled, reset]);

  return (
    <form /*onSubmit={handleSubmit(onSubmit)}*/>
      <Grid2
        spacing={2}
        container
        columns={12}
        display="flex"
        alignItems="center"
        sx={{ justifyContent: "flex-start" }}
        border="1px solid lightGray"
        padding={2}
        borderRadius={1}
      >
        <Grid2
          size={{ sm: 12, md: 12 }}
          display="flex"
          container
          direction="column"
          spacing={0}
        >
          <FormLabel
            sx={
              !isNewRec && !editable
                ? { color: "darkgray" }
                : { color: "#1976d2" }
            }
          >
            Department
          </FormLabel>
          <TextField
            {...register("dept", { required: "Department is required." })}
            size="small"
            fullWidth
            disabled={!isNewRec && !editable}
          />
        </Grid2>

        <Grid2
          size={{ sm: 12, md: 6 }}
          display="flex"
          direction="column"
          spacing={0}
          container
        >
          <FormLabel
            sx={
              !isNewRec && !editable
                ? { color: "darkgray" }
                : { color: "#1976d2" }
            }
          >
            Local Path
          </FormLabel>
          <TextField
            {...register("localPath", { required: "Local path is required." })}
            size="small"
            fullWidth
            disabled={!isNewRec && !editable}
          />
        </Grid2>

        <Grid2
          size={{ sm: 12, md: 6 }}
          display="flex"
          container
          direction="column"
          spacing={0}
        >
          <FormLabel
            sx={
              !isNewRec && !editable
                ? { color: "darkgray" }
                : { color: "#1976d2" }
            }
          >
            Net Path
          </FormLabel>
          <TextField
            {...register("netPath", { required: "Net Path is required." })}
            size="small"
            fullWidth
            disabled={!isNewRec && !editable}
          />
        </Grid2>

        <Grid2
          size={{ sm: 12, md: 6 }}
          display="flex"
          container
          direction="column"
          spacing={0}
        >
          <FormLabel
            sx={
              !isNewRec && !editable
                ? { color: "darkgray" }
                : { color: "#1976d2" }
            }
          >
            Note
          </FormLabel>
          <TextField
            {...register("note")}
            size="small"
            fullWidth
            disabled={!isNewRec && !editable}
          />
        </Grid2>
        <Grid2
          size={{ sm: 12, md: 6 }}
          display="flex"
          container
          direction="column"
          spacing={0}
        >
          <FormLabel
            sx={
              !isNewRec && !editable
                ? { color: "darkgray" }
                : { color: "#1976d2" }
            }
          >
            Enabled
          </FormLabel>
          <Grid2>
            <Controller
              name="enabled"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      {...field}
                      checked={field.value}
                      inputProps={{ "aria-label": "controlled" }}
                      disabled={!isNewRec && !editable}
                    />
                  }
                  label="Enabled"
                />
              )}
            />

            {isNewRec || editable ? (
              <>
                <Button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmit(onSubmit)}
                >
                  {isSubmitting ? "Loading..." : isNewRec ? "Add" : "Update"}
                </Button>
                <Button type="button" onClick={() => handleCancel()}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button type="button" onClick={() => handleEdit()}>
                  Edit
                </Button>
                <Button type="button" onClick={() => handleOpenDeleteDialog()}>
                  Delete
                </Button>
              </>
            )}
          </Grid2>
        </Grid2>
        {errors.root && (
          <Box color="red" display="">
            {errors.root.message}
          </Box>
        )}
        {errors.dept && (
          <Box color="red" display="">
            {errors.dept.message}
          </Box>
        )}

        {errors.localPath && (
          <Box color="red" display="">
            {errors.localPath.message}
          </Box>
        )}

        {errors.netPath && (
          <Box color="red" display="">
            {errors.netPath.message}
          </Box>
        )}
      </Grid2>

      <DraggableDialog
        modalData={modalData}
        title={title}
        msg={msg}
        yesTitle={yesTitle}
        cancelTitle={cancelTitle}
        open={open}
        setOpen={setOpen}
        yesFunction={yesFunction}
        fullWidth={true}
        maxWidth="sm"
      />
    </form>
  );
}

export default DeptForm;
