/* eslint-disable react/prop-types */
import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";

function PaperComponent(props) {
  const nodeRef = React.useRef(null);
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

export default function DraggableDialog({
  open,
  setOpen,
  title,
  msg,
  yesTitle,
  cancelTitle,
  yesFunction,
  fullWidth,
  maxWidth,
}) {
  const handleClose = () => {
    setOpen({ ...open, open: false });
  };

  const handleYes = () => {
    yesFunction(open.id);
    handleClose();
  };

  return (
    <Dialog
      open={open.open || false}
      onClose={handleClose}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
      fullWidth={fullWidth}
      maxWidth={maxWidth}
    >
      <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{msg}</DialogContentText>
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
