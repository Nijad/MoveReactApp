import { Route, Routes } from "react-router-dom";
import Layout from "./pages/layout";
import Departments from "./pages/Departments/Departments";
import Extensions from "./pages/Extensions/Extensions";
import Configurations from "./pages/Configurations/configurations";
import NoPage from "./pages/NoPage/NoPage";
import Index from "./pages/Index/Index";
import Extensions_new from "./pages/Extensions/Extensions_new";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Index />} />
        <Route path="Departments" element={<Departments />} />
        <Route path="Extensions" element={<Extensions />} />
        <Route path="Configurations" element={<Configurations />} />
        <Route path="new" element={<Extensions_new />} />
        <Route path="*" element={<NoPage />} />
      </Route>
    </Routes>
  );
}

export default App;
