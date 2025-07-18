import { useState } from "react";
import type { AlertColor } from "@mui/material";

type UseSnackbarReturn = {
  open: boolean;
  message: string;
  severity: AlertColor;
  showSnackbar: (msg: string, type?: AlertColor) => void;
  handleClose: () => void;
};

const useSnackbar = (): UseSnackbarReturn => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("success");

  const showSnackbar = (msg: string, type: AlertColor = "success") => {
    setMessage(msg);
    setSeverity(type);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return { open, message, severity, showSnackbar, handleClose };
};

export default useSnackbar;
