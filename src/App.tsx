import Appointment from "./Components/AppointmentBooking";
import LoginComponent from "./Components/LoginComponent";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBarComponent from "./Components/NavBarComponent";
import axios from "axios";
import MyAppointments from "./Components/MyAppointments";
import { useRef, useState } from "react";

import ProtectedComponent from "./Components/ProtectedComponent";


export default function App() {
  const httpRequest = useRef(
    axios.create({
      baseURL: "https://appointmentbookserver.onrender.com",
      withCredentials: true,
    })
  );
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  return (
    <Router>
      <NavBarComponent httpRequest={httpRequest.current} setLoggedIn={setLoggedIn} loggedIn={loggedIn}/>
      <Routes>
        <Route
          path="/login"
          element={
            <LoginComponent
              setLoggedIn={setLoggedIn}
              httpRequest={httpRequest.current}
            />
          }
        ></Route>
        <Route
          path="/bookAppointment"
          element={
            <ProtectedComponent loggedIn={loggedIn}><Appointment httpRequest={httpRequest.current} /></ProtectedComponent>}
        ></Route>
        <Route
          path="/myAppointments"
          element={
            <ProtectedComponent loggedIn={loggedIn}>
          <MyAppointments httpRequest={httpRequest.current} /></ProtectedComponent>}
        ></Route>
        <Route
          path="*"
          element={
            <ProtectedComponent loggedIn={loggedIn}><Appointment httpRequest={httpRequest.current} /></ProtectedComponent>}
        ></Route>      

      </Routes>
    </Router>
  );
}
