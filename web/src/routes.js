import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./styles.css";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

import Schedules from './pages/Schedules';
import Customers from './pages/Customers';
import Colaborators from './pages/Colaborators';
import Specialties from './pages/Specialties';
import TimeTables from './pages/TimeTables';
import Home from './pages/Home';

const AllRoutes = () => {
  return (
    <>
      <Header />
      <div className="container-fluid h-100">
        <div className="row h-100">
          <Router>
            <Sidebar />
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/schedules" element={<Schedules/>}/>
              <Route path="/customers" element={<Customers/>}/>
              <Route path="/colaborators" element={<Colaborators/>}/>
              <Route path="/specialties" element={<Specialties/>}/>
              <Route path="/timeTables" element={<TimeTables/>}/>
            </Routes>
          </Router>
        </div>
      </div>
    </>
  );
};

export default AllRoutes;
