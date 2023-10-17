import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./styles.css";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

import Schedules from './pages/Schedules';
import Customers from './pages/Customers';

const AllRoutes = () => {
  return (
    <>
      <Header />
      <div className="container-fluid h-100">
        <div className="row h-100">
          <Router>
            <Sidebar />
            <Routes>
              <Route path="/schedules" element={<Schedules/>}/>
              <Route path="/customers" element={<Customers/>}/>
            </Routes>
          </Router>
        </div>
      </div>
    </>
  );
};

export default AllRoutes;
