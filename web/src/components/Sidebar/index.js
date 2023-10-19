import { Link } from "react-router-dom";
import withRouter from '../../store/withRouter';
import logo from "../../assets/logo.png";
import { useLocation } from "react-router-dom";

const Sidebar = () => {
  let location = useLocation();
  return (
    <sidebar className="col-2 h-100">
      <img src={logo} className="img-fluid px-3 py-4" alt="logo" />
      <ul>
        <li> 
          <Link to="/schedules" className={location.pathname === '/schedules' ? 'active' : ''}>
            <span className="mdi mdi-calendar-check"></span>
            <text>Agendamentos</text>
          </Link>
        </li>
        <li>
          <Link to="/customers" className={location.pathname === '/customers' ? 'active' : ''}>
            <span className="mdi mdi-account-multiple"></span>
            <text>Clientes</text>
          </Link>
        </li>
      </ul>
    </sidebar>
  );
};

export default withRouter(Sidebar);
