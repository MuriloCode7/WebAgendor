import { Link } from "react-router-dom";
import withRouter from "../../store/withRouter";
import logo from "../../assets/logo.png";
import { useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  return (
    <aside className="col-2 h-100">
      <Link to="/">
        <img src={logo} className="img-fluid px-3 py-4" alt="logo" />
      </Link>
      <ul>
        <li>
          <Link
            to="/schedules"
            className={location.pathname === "/schedules" ? "active" : ""}
          >
            <span className="mdi mdi-calendar-check"></span>
            Agendamentos
          </Link>
        </li>
        <li>
          <Link
            to="/customers"
            className={location.pathname === "/customers" ? "active" : ""}
          >
            <span className="mdi mdi-account-multiple"></span>
            Clientes
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default withRouter(Sidebar);
