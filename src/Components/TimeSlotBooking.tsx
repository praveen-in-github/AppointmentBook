import "../static/TimeSlotBooking.css";


interface slotType{
    start:string,end:string
}
interface Appointmentgroup{
    _id:string,
    slotTimes:slotType[]
}
interface Props{
  date:number|null,
  month:number,
  year:number,
    
    slots:Map<string,Appointmentgroup>,
    appointmentStartTime:string,
    setAppointmentStartTime:React.Dispatch<React.SetStateAction<string>>
}

export default function TimeSlotBooking({
  date,month,year,
  
  slots,
  appointmentStartTime,
  setAppointmentStartTime,
}:Props) {






  console.log("date is "+date);
  const startTimeData = intializeOnce();

  function intializeOnce() {

    let startTimes = [];
    let strt = 8;
    let allTimes:string[] = [];
    while (strt < 20) {
    let minute = (strt - Math.floor(strt)) * 60;
      allTimes.push(
        (Math.floor(strt) === 12 ? 12 : Math.floor(strt % 12)) +
          ":" +
          (Math.floor(minute / 10).toString() + (minute % 10).toString()) +
          (strt / 12 > 1 || Math.floor(strt) === 12 ? "PM" : "AM")
      );
      strt = strt + 0.25;
    }
    if(date === null){
      console.log("Responding from here");
      return allTimes;
    }
    let selectedDate=new Date(year,month,date);
    let mnth = selectedDate.getMonth() + 1;
  
    let key =
      selectedDate.getFullYear() +
      "-" +
      (Math.floor(mnth / 10) !== 0 ? mnth : "0" + mnth) +
      "-" +
      (Math.floor(selectedDate.getDate() / 10) !== 0 ? selectedDate.getDate() : "0" + selectedDate.getDate());
    console.log(slots, " ", key);
    let existingSlots:slotType[]|undefined;
    existingSlots = slots.get(key)?.slotTimes;
    
    console.log(existingSlots);

    for (let j = 0; j < allTimes.length; j++) {
      let slotIsAvailable = true;
      if (existingSlots) {
        for (let i = 0; i < existingSlots.length; i++) {
          let slot = existingSlots[i];
          let start = new Date(slot.start);
          let close = new Date(slot.end);
          if (
            start.getFullYear() === selectedDate.getFullYear() &&
            start.getDate() === selectedDate.getDate() &&
            start.getMonth() === selectedDate.getMonth()
          ) {
            let time:string[] = [];
            if (allTimes[j].search("AM") !== -1) {
              time = allTimes[j].replace("AM", "").split(":");
            } else {
              time = allTimes[j].replace("PM", "").split(":");
              if (parseInt(time[0]) !== 12) {
              
                time[0] = (12 + parseInt(time[0])).toString();
              }
            }
            let allMinutes = parseInt(time[0]) * 60 + parseInt(time[1]);
            let user30Minutes = allMinutes + 30;
            let user60Minutes = allMinutes + 30;
            let slotStartMinutes = start.getHours() * 60 + start.getMinutes();
            let slotEndMinutes = close.getHours() * 60 + close.getMinutes();
            if (
              (allMinutes < slotStartMinutes &&
                (user30Minutes <= slotStartMinutes ||
                  user60Minutes <= slotStartMinutes)) ||
              allMinutes >= slotEndMinutes
            ) {
            } else {
              slotIsAvailable = false;
              break;
            }
          }
        }
      }
      if (slotIsAvailable) {
        startTimes.push(allTimes[j]);
      }
    }
    return startTimes;
  }


  return (
    <div className={(date==null?"disable ":" ")+"time-container"}>
      <div className="time-element-group ">
        {startTimeData.map((startTime) => {
          return (
            <button
              className={
                appointmentStartTime === startTime
                  ? "time-btn time-btn-selected"
                  : "time-btn"
              }
              disabled={date == null}
              onClick={(event)=>{
                event.preventDefault();
                event.stopPropagation();setAppointmentStartTime(startTime)
            }}
              key={startTime}
              
            >
              {startTime}
            </button>
          );
        })}
      </div>
    </div>
  );
}
