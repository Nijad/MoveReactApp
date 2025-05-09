import { Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import Departments from "./pages/Departments/Departments";
import Extensions from "./pages/Extensions/Extensions";
import Configurations from "./pages/Configurations/Configurations";
import NoPage from "./pages/NoPage/NoPage";
import Index from "./pages/Index/Index";
import Move from "./pages/Move/Move";
import Terminal from "./pages/Terminal/Terminal";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Index />} />
        <Route path="Departments" element={<Departments />} />
        <Route path="Extensions" element={<Extensions />} />
        <Route path="Configurations" element={<Configurations />} />
        <Route path="Move" element={<Move />} />
        <Route path="Terminal" element={<Terminal />} />
        <Route path="*" element={<NoPage />} />
      </Route>
    </Routes>
  );
}

export default App;
