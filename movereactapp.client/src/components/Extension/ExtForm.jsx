/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useController, useForm } from "react-hook-form";
import {
  Box,
  Button,
  FormControlLabel,
  Grid2,
  Switch,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

function ExtForm({ isNew, ext, program, note, enabled }) {
  const [editable, setEditable] = useState(false);
  // const [defaultValues, setDefaultValues] = useState({
  //   extension: "",
  //   program: "",
  //   note: "",
  //   enabled: false,
  // });
  // const defaultValues = {
  //   extension: ext,
  //   program: program,
  //   note: note,
  //   enabled: enabled,
  // };

  //useEffect(() => {}, [ext]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      //throw new Error("backend error");

      console.log(data);
    } catch (error) {
      setError("root", {
        message: error.message,
      });
    }
  };

  const handleEdit = () => {
    setEditable(true);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
            disabled={!isNew && !editable}
            value={ext}
          />
        </Grid2>
        <Grid2 size={{ sm: 12, md: 6 }} display="flex">
          <TextField
            {...register("program")}
            size="small"
            fullWidth
            label="Program"
            disabled={!isNew && !editable}
            value={program}
          />
        </Grid2>

        <Grid2 size={{ sm: 12, md: 6 }} display="flex">
          <TextField
            {...register("note")}
            size="small"
            fullWidth
            label="Note"
            disabled={!isNew && !editable}
            value={note}
          />
        </Grid2>

        <Grid2 size={{ sm: 12, md: 6 }} display="flex">
          <FormControlLabel
            control={
              <Switch
                checked={enabled}
                {...register("enabled")}
                inputProps={{ "aria-label": "controlled" }}
                disabled={!isNew && !editable}
              />
            }
            label="Enabled"
          />
          {isNew || editable ? (
            <>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Loading..." : isNew ? "Add" : "Update"}
              </Button>
              <Button type="reset">Cancel</Button>
            </>
          ) : (
            <Button type="button" onClick={() => handleEdit()}>
              Edit
            </Button>
          )}
        </Grid2>

        {errors.root && (
          <Box color="red" display="">
            {errors.root.message}
          </Box>
        )}
        {errors.extension && (
          <Box color="red" display="">
            {errors.extension.message}
          </Box>
        )}
      </Grid2>
    </form>
  );
}

export default ExtForm;
