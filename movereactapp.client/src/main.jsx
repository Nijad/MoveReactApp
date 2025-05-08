import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { SnackbarProvider } from "notistack";
import { DataProvider } from "./DataContext";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <SnackbarProvider maxSnack={3}>
        <DataProvider pollInterval={3000}>
          <App />
        </DataProvider>
      </SnackbarProvider>
    </LocalizationProvider>
  </BrowserRouter>
);
