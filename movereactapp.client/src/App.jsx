import { Route, Routes } from "react-router-dom";
import Layout from "./pages/layout";
import Departments from "./pages/Departments/Departments";
import Extensions from "./pages/Extensions/Extensions";
import Configurations from "./pages/Configurations/configurations";
import NoPage from "./pages/NoPage/NoPage";
import Index from "./pages/Index/Index";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Index />} />
        <Route path="Departments" element={<Departments />} />
        <Route path="Extensions" element={<Extensions />} />
        <Route path="Configurations" element={<Configurations />} />
        <Route path="*" element={<NoPage />} />
      </Route>
    </Routes>
  );
}

export default App;
