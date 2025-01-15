import { Route, Routes } from "react-router-dom";
import Layout from "./pages/layout";
import Departments from "./pages/Departments/Departments";
import Extensions from "./pages/Extensions/Extensions";
import Configurations from "./pages/Configurations/configurations";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          index
          element={
            <div>
              <h1>index</h1>
            </div>
          }
        />
        <Route path="Departments" element={<Departments />} />
        <Route path="Extensions" element={<Extensions />} />
        <Route path="Configurations" element={<Configurations />} />
        {/* <Route path="*" element={<NoPage />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
