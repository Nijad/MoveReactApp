/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Controller, useForm } from "react-hook-form";
import {
  Box,
  Button,
  FormControlLabel,
  Grid2,
  Switch,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import DraggableDialog from "../DraggableDialog";

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
  const [open, setOpen] = useState({ open: false });
  const [title, setTitle] = useState("");
  const [msg, setMsg] = useState("");
  const [yesTitle, setYesTitle] = useState("");
  const [cancelTitle, setCancelTitle] = useState("Cancel");
  const [yesFunction, setYesFunction] = useState();
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
      if (isNewRec) {
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
              `https://localhost:54785/new?ext=${data.ext}`
            );
            enqueueSnackbar(`Extension ${data.ext} added successfuly.`, {
              variant: "success",
              anchorOrigin: { horizontal: "center", vertical: "top" },
              autoHideDuration: 5000,
            });
            //handleExtClick(data.ext);
          })
          .catch((err) => {
            enqueueSnackbar("Fetching extensions failed.", {
              variant: "error",
              anchorOrigin: { horizontal: "center", vertical: "top" },
              autoHideDuration: 5000,
            });
            console.log(err);
          });
      } else console.log("update data: ", data);
    } catch (error) {
      setError("root", {
        message: error.message,
      });
    }
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
    setOpen({ open: true });
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
          history.pushState(null, null, `https://localhost:54785/new`);

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
        >
          <TextField
            {...register("ext", { required: "Extension is required." })}
            size="small"
            fullWidth
            label="Extension"
            disabled={!isNewRec && !editable}
          />
        </Grid2>

        <Grid2 size={{ sm: 12, md: 6 }} display="flex">
          <TextField
            {...register("program")}
            size="small"
            fullWidth
            label="Program"
            disabled={!isNewRec && !editable}
          />
        </Grid2>

        <Grid2 size={{ sm: 12, md: 6 }} display="flex">
          <TextField
            {...register("note")}
            size="small"
            fullWidth
            label="Note"
            disabled={!isNewRec && !editable}
          />
        </Grid2>

        <Grid2 size={{ sm: 12, md: 6 }} display="flex">
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
