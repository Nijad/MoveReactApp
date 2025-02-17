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

function ExtForm({
  isNew,
  ext,
  program,
  note,
  enabled,
  setFilterList,
  setExt,
  extensionsList,
  setExtensionsList,
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
      .post("https://localhost:7203/api/Extensions", {
        ...data,
        Departments: [],
      })
      .then((res) => {
        setExt(data.ext);
        setIsNewRec(false);
        setEditable(false);
        setExtensionsList(res.data);
        setFilterList(res.data);

        history.pushState(
          null,
          null,
          `https://localhost:54785/Extensions?ext=${data.ext}`
        );
        enqueueSnackbar(`Extension ${data.ext} added successfuly.`, {
          variant: "success",
          anchorOrigin: { horizontal: "center", vertical: "top" },
          autoHideDuration: 5000,
        });
        //handleExtClick(data.ext);
      })
      .catch((err) => {
        enqueueSnackbar(`Adding new extension ${data.ext} failed.`, {
          variant: "error",
          anchorOrigin: { horizontal: "center", vertical: "top" },
          autoHideDuration: 5000,
        });
        console.log(err);
      });
  };

  const handleUpdateExtension = (data) => {
    axios
      .put(`https://localhost:7203/api/Extensions/${ext}`, {
        ...data,
        Departments: [],
      })
      .then((res) => {
        setEditable(false);

        enqueueSnackbar(`Extension ${ext} updated successfuly.`, {
          variant: "success",
          anchorOrigin: { horizontal: "center", vertical: "top" },
          autoHideDuration: 5000,
        });
        //handleExtClick(data.ext);
      })
      .catch((err) => {
        enqueueSnackbar(`Updating extension ${ext} failed.`, {
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
    setTitle("Delete Extension");
    setMsg(`Are you sure to delete ${ext}.`);
    setYesTitle("Delete");
    setCancelTitle("Cancel");
    setYesFunction(() => handleDelete);
    setOpen(true);
  };

  const handleOpenUpdateDialog = (data) => {
    setTitle("Update Extension");
    setMsg(`Are you sure to Update ${ext} information.`);
    setYesTitle("Update");
    setCancelTitle("Cancel");
    setYesFunction(() => handleUpdateExtension);
    setModalData(data);
    setOpen(true);
  };

  const handleDelete = () => {
    try {
      axios
        .delete(`https://localhost:7203/api/Extensions/${ext}`)
        .then((res) => {
          //setFilterList(res.data);
          setExtensionsList(extensionsList.filter((x) => x != ext));
          setFilterList(extensionsList.filter((x) => x != ext));
          setExt(undefined);
          history.pushState(null, null, `https://localhost:54785/Extensions`);

          enqueueSnackbar(`Extension ${ext} deleted successfuly.`, {
            variant: "success",
            anchorOrigin: { horizontal: "center", vertical: "top" },
            autoHideDuration: 5000,
          });
        })
        .catch((err) => {
          enqueueSnackbar("Deleteing extensions failed.", {
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
    if (isNewRec) setExt(undefined);
    reset();
    setEditable(false);
  };

  useEffect(() => {
    reset({ ext: ext, program: program, note: note, enabled: enabled });
    setIsNewRec(isNew);
  }, [isNew, ext, program, note, enabled, reset]);

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
            Extension
          </FormLabel>
          <TextField
            {...register("ext", { required: "Extension is required." })}
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
            Program
          </FormLabel>
          <TextField
            {...register("program")}
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
        {errors.ext && (
          <Box color="red" display="">
            {errors.ext.message}
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

export default ExtForm;
