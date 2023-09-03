import { useState,ReactNode } from "react";

import {useFetch} from "./FetchHook";
import ToastComponent from "./ToastComponent";
import "../static/MyAppointments.css";
import {AxiosInstance} from "axios"

interface Props{
    httpRequest:AxiosInstance
}
interface Appointment{
    _id:string,
    Subject?:string,
    AppointmentStartDate:string,
    AppointmentEndDate:string
}

export default function MyAppointments({ httpRequest }:Props) {
  const [status, Appointments, setAppointments] = useFetch(
    httpRequest,
    "/bookings/",
    "get",
    ""
  );
  const [toastComponents, setToastComponents] = useState<ReactNode>();

  function deleteAppointment(id:string) {
    httpRequest
      .delete(`/bookings/${id}`)
      .then(() => {
        setToastComponents(
          <ToastComponent
            key={Date.now()}
            status="success"
            message="Appointment Deleted Successfully"
          />
        );
        setAppointments(
          Appointments.filter((appointment:Appointment) => {
            if (appointment._id == id) return false;
            else return true;
          })
        );
      })
      .catch((err) => {
        console.log("Error Occured");
        setToastComponents(
          <ToastComponent
            key={Date.now()}
            status="error"
            message="Server Error.Please Try After Some Time"
          />
        );
      });
  }
  console.log(status, " ", Appointments);
  var options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  if (status == "Fetching" || status == "Idle") {
    return <p>Loading</p>
  } else if (status == "Failed") {
    return <p>Error</p>
  } else {
    return (
      <>
        <div className="page-info-heading">My Appointments</div>

        <table>
          <tr>
            <th>Subject</th>
            <th>Appointment Start Date</th>
            <th>Appointment End Date</th>
            <th></th>
          </tr>
          {Appointments.map((appointment:Appointment) => {
            return (
              <tr key="_id">
                <td>{appointment.Subject}</td>
                <td>
                  {new Date(appointment.AppointmentStartDate).toLocaleString(
                    "en-IN"
                  )}
                </td>
                <td>
                  {new Date(appointment.AppointmentEndDate).toLocaleString(
                    "en-IN"
                  )}
                </td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => deleteAppointment(appointment._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </table>
        {toastComponents}
      </>
    );
  }
}
