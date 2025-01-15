import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/Departments">Departments</Link>
          </li>
          <li>
            <Link to="/Extensions">Extensions</Link>
          </li>
          <li>
            <Link to="/Configurations">Configurations</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  );
};

export default Layout;
