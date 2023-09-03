import { useState, useMemo ,ReactNode,ChangeEvent} from "react";
import Calender from "./Calender";
import "../static/AppointmentBooking.css";
import TimeSlotBooking from "./TimeSlotBooking";
import ToastComponent from "./ToastComponent";
import {useFetchAggregate} from "./FetchHook";
import {AxiosInstance} from "axios"

interface Props{
    httpRequest:AxiosInstance
}
interface slot{
    start:string,end:string
}
interface Appointmentgroup{
    _id:string,
    slotTimes:slot[]
}
export default function Appointment({ httpRequest }:Props) {
  //let errorMessage;
  let curr_date = new Date();

  let cur_year = curr_date.getFullYear();
  let cur_month = curr_date.getMonth();

  const [year, setYear] = useState(cur_year);
  const [month, setMonth] = useState(cur_month);
  const [date, setDate] = useState<number|null>(null);
  const [duration, setDuration] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState();
  const [showOptions, setShowOptions] = useState(false);

  const [subject, setSubject] = useState<string>();


  // Managing State of Time Slo Booking COmponent
  const [appointmentStartTime, setAppointmentStartTime] = useState<string>('');

  const [toastComponents, setToastComponents] = useState<ReactNode>();

  
  function dateAltered(date:number|null,event?:React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if(event){
    event.preventDefault();
  }
    setAppointmentStartTime("");
    setDate(date);
  }
  function monthAltered(month:number){
    setMonth(month);    setAppointmentStartTime("");

  }
  function yearAltered(year:number){
    setYear(year);setAppointmentStartTime("");
  }

  function formSubmitHandler(event:React.MouseEvent<HTMLInputElement, MouseEvent>) {
    let hs:number, ms:number;
    event.preventDefault();
    if(date == null) return ;
    if (appointmentStartTime.search("AM") !== -1) {
      let time = appointmentStartTime.replace("AM", "").trim().split(":");

      hs = parseInt(time[0]);
      ms = parseInt(time[1]);
    }
    else {
      let time = appointmentStartTime.replace("PM", "").trim().split(":");

      if (parseInt(time[0]) === 12) {
        hs = parseInt(time[0]);
      } else {
        hs = parseInt(time[0]) + 12;
      }
      ms = parseInt(time[1]);
    }
    let appointmentDuration;
    if (duration && duration.search("hr") !== -1) {
      appointmentDuration = parseInt(duration.trim().replace("hr", "")) * 60;
    } else {
      appointmentDuration = parseInt(duration.trim().replace("mins", ""));
    }
    let data = {
      Subject: subject,
      AppointmentStartDate: new Date(year, month, date, hs, ms),
      AppointmentEndDate: new Date(
        year,
        month,
        date,
        hs,
        ms + appointmentDuration
      ),
    };
    httpRequest
      .post(`/bookings/create`, data)
      .then((res) => {
        console.log(res);
        setToastComponents(
          <ToastComponent
            key={Date.now()}
            status="success"
            message="Booking Created!!"
          />
        );
      })
      .catch((err) => {
        console.log(err);
        setToastComponents(
          <ToastComponent
            key={Date.now()}
            status="error"
            message="Server Error.Failed to Create Booking"
          />
        );
      });
  }

  function durationChanged(value:string) {
    setDuration(value);
  }
  let currentSelectData = new Date(year, month);
  console.log(currentSelectData.toString());
  const [status, slots] = useFetchAggregate(
    httpRequest,
    "/bookings/filter/" + currentSelectData.toString(),
    "get"
  );



  const slotsMap = useMemo(() => {
    let slotsMap = new Map<string,Appointmentgroup>();
    if (slots) {
      slots.map((doc) => {
        slotsMap.set(doc["_id"], doc);
      });
    }
    return slotsMap;
  }, [slots]);
  console.log("Slots are ", slots);
  return (
    <div>
      <div className="page-info-heading">Book Appointment Form</div>
      <form className="form-wrapper">
        <div className="form-element">
          <div className="form-label ">
            <label>Subject</label>
          </div>
          <div className="form-input">
            <input
              type="text"
              value={subject}
              onChange={(event:ChangeEvent<HTMLInputElement>) => setSubject(event.target.value)}
            />
          </div>
        </div>

        <div className="form-element form-element-date">
          <div>
            <div className="form-label form-label-mand">
              <label className="form-label-content">
                Select Appointment Date
              </label>
            </div>
            {<p className="error-msg">{errorMessage}</p>}
            <div className="date-booking">
              <Calender
                year={year}
                setDate={dateAltered}
                date={date}
                month={month}
                setYear={yearAltered}
                setMonth={monthAltered}
                slots={slotsMap}
              />
            </div>
          </div>
          {status == "Fetched" && (
            <div>
              <div className="form-label form-label-mand">
                <label className="form-label-content">
                  Select Appointment slot
                </label>
              </div>
              <TimeSlotBooking
              year={year} month={month} date={date}
                slots={slotsMap}
                appointmentStartTime={appointmentStartTime}
                setAppointmentStartTime={setAppointmentStartTime}
              />
            </div>
          )}
          {status == "Fetching" || status == "Idle" ? (
            <p>Loading</p>
          ) : status == "Failed" ? (
            <p>Couldnt Connect to Server</p>
          ) : (
            ""
          )}
        </div>

        <div className="form-element">
          <div className="form-label form-label-mand">
            <label className="form-label-content">Duration</label>
          </div>
          <div className="form-input">
            <div
              className="selection-box"
              onClick={() => {
                if (!showOptions) setShowOptions(true);
                else setShowOptions(false);
              }}
            >
              <div className="filter-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                  />
                </svg>
              </div>

              {duration ? duration : "None"}
            </div>
            {showOptions && (
              <div className="selection-options">
                <button
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    durationChanged(30 + " mins");
                    setShowOptions(false);
                  }}
                >
                  30 mins
                </button>
                <button
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    durationChanged(1 + " hr");
                    setShowOptions(false);
                  }}
                >
                  1 hr
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="submit-btn">
          <input type="submit" onClick={formSubmitHandler}></input>
        </div>
      </form>
      {toastComponents}
    </div>
  );
}
