/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormLabel,
  Paper,
  TextField,
} from "@mui/material";
import { useRef } from "react";
import Draggable from "react-draggable";

function PaperComponent(props) {
  const nodeRef = useRef(null);

  return (
    <Draggable
      nodeRef={nodeRef}
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} ref={nodeRef} />
    </Draggable>
  );
}
function DraggableInputDialog({
  open,
  setOpen,
  title,
  fieldName,
  msg,
  yesTitle,
  cancelTitle,
  yesFunction,
  fullWidth,
  maxWidth,
  modalData,
  setReason,
}) {
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setReason(event.target.value);
  };

  const handleYes = () => {
    if (modalData != null) yesFunction(modalData);
    else yesFunction();
    handleClose();
  };
  return (
    <Dialog
      open={open || false}
      onClose={handleClose}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-input-dialog-title"
      fullWidth={fullWidth}
      maxWidth={maxWidth}
    >
      <DialogTitle style={{ cursor: "move" }} id="draggable-input-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{msg}</DialogContentText>
        <TextField size="small" fullWidth onChange={(e) => handleChange(e)} />
        <FormLabel color="error" size="small">
          {fieldName} field required
        </FormLabel>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          {cancelTitle}
        </Button>
        <Button onClick={handleYes}>{yesTitle}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DraggableInputDialog;
