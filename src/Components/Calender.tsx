import React from "react";
import "./Calender.css";



interface slot{
    start:string,end:string
}
interface Appointmentgroup{
    _id:string,
    slotTimes:slot[]
}
interface Props{
    year:number,
    month:number,
    date:number|null,
    setMonth:(month:number)=>void,
    setDate:(date:number|null,event?:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>void,
    setYear:(year:number)=>void,
    slots:Map<string,Appointmentgroup>
}
export default function Calender({
  year,
  month,
  setYear,
  setMonth,
  setDate,
  date,
  slots,
}:Props) {
  function lowerYear(event:React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();
    event.stopPropagation();
    console.log(event);
    //event.preventDefault();
    setYear(year - 1);
    setDate(null);
  }
  function lowerMonth(event:React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();
    event.stopPropagation();
    if (month < 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
    setDate(null)
  }
  function higherYear(event:React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();
    event.stopPropagation();
    setYear(year + 1);
    setDate(null)

  }
  function higherMonth(event:React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();
    event.stopPropagation();
    if (month > 12) {
      setMonth(1);
      setYear(year + 1);
    } else setMonth(month + 1);
    setDate(null)

  }
  function getMonthFromInteger(month:number) {
    if (month === 0) return "Jan";
    else if (month === 1) return "Feb";
    else if (month === 2) return "Mar";
    else if (month === 3) return "Apr";
    else if (month === 4) return "May";
    else if (month === 5) return "Jun";
    else if (month === 6) return "Jul";
    else if (month === 7) return "Aug";
    else if (month === 8) return "Sep";
    else if (month === 9) return "Oct";
    else if (month === 10) return "Nov";
    else if (month === 11) return "Dec";
    else return "Dec";
  }

  function getAllTimes():number[][] {
    let arr = [];
    let strt = 8,
      ed = 20;
    while (strt < ed) {
    let a= [Math.floor(strt), (strt - Math.floor(strt)) * 60];
      arr.push(a);
      strt += 0.25;
    }
    return arr;
  }
  const allTimes = getAllTimes();
  function isDateAvailable(cur_date:number) {
    let key = year + "-" + month + "-" + cur_date;
    if (slots && !slots.has(key)) return "date-available";
    for (let i = 0; i < allTimes.length; i++) {
      let cur = allTimes[i][0] * 60 + allTimes[i][1];
      let slotsOnDate=slots.get(key);
      if(slotsOnDate!==undefined){
      let len=slotsOnDate.slotTimes.length;
      
          for (let j = 0; j < len; j++) {
              let slot=slotsOnDate.slotTimes[j];
              console.log(slot);
              let st =
            new Date(slot.start).getMinutes() * 60 + new Date(slot.start).getHours();
          let ed = new Date(slot.end).getMinutes() * 60 + new Date(slot.end).getHours();
          if ((cur > st && cur >= ed) || (cur < st && cur < ed))  return "date-available";
  
          }

    }
    return "nothing";
  }
}

  let todayDate = new Date();
  let weekDayOf1stMonth = new Date(year, month, 1).getDay();
  let numberofDaysInMonth = new Date(year, month + 1, 0).getDate();
  let daysJSX = [];
  todayDate.setMinutes(0);
  todayDate.setHours(0);
  todayDate.setSeconds(0);
  for (let i = 1; i <= numberofDaysInMonth; i++) {
    if (i === 1) {
      daysJSX.push(
        <div
          style={{
            gridColumnStart: weekDayOf1stMonth,
          }}
        >
          <button
            onClick={(event) => {
              console.log(i);
              event.preventDefault();
              event.stopPropagation();
              setDate(i,event);
            }}
            className={
              (new Date(year, month, i) >= todayDate ? isDateAvailable(i):"") +
              (date === i ? " date-button date-selected" : " date-button")
            }
            disabled={new Date(year, month, i) < todayDate}
          >
            {i}
          </button>
        </div>
      );
    } else {
      daysJSX.push(
        <div>
          <button
            className={
              (new Date(year, month, i) >= todayDate ? isDateAvailable(i):"") +
              (date === i ? " date-button date-selected" : " date-button")
            }
            disabled={new Date(year, month, i) < todayDate}
            onClick={(event) => {
              console.log(i);

              event.preventDefault();
              event.stopPropagation();
              setDate(i,event);
            }}
            style={{
              textAlign: "center",
              outline: "none",
              border: "none",
            }}
          >
            {i}
          </button>
        </div>
      );
    }
}
  return (
    <>
      <div className="calender">
        <div className="controller">
          <button onClick={lowerYear}>&#60;&#60;</button>
          <button onClick={lowerMonth}>&#60;</button>
          <div className="header-desc">
            {getMonthFromInteger(month)} {year}
          </div>
          <button onClick={higherMonth}>&#62;</button>
          <button onClick={higherYear}>&#62;&#62;</button>
        </div>
        <div className="week-days">
          <div className="week-names">Mon</div>
          <div className="week-names">Tue</div>
          <div className="week-names">Wen</div>
          <div className="week-names">Thu</div>
          <div className="week-names">Fri</div>
          <div className="week-names">Sat</div>
          <div className="week-names">Sun</div>
          {daysJSX}
        </div>
      </div>
    </>
  );
}