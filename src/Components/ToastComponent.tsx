import { useState, useRef } from "react";
import "../static/ToastComponent.css";
interface Props{
    status:string,
    message:string,
}
export default function ToastComponent({ status, message }:Props) {
  const [showComponent, setShowComponent] = useState(true);

  const timeOutId = useRef(schedule());


  function closeToast() {
    console.log("Button ");
    console.log(timeOutId.current)
    clearTimeout(timeOutId.current);
    setShowComponent(false);
  }

  function schedule() {
    let id = setTimeout(() => {
      setShowComponent(false);
    }, 5000);
    console.log("id is ", id);
    return id;
  }
  console.log("Component ", showComponent, " messsage: ", message);

  return (
    <>
    {showComponent && (
      <div
        className={
          status == "success"
            ? "toast-container toast-container-success"
            : "toast-container toast-container-error"
        }
      >
        <p>{message}</p>
        <button className="close-btn" onClick={closeToast}>
          X
        </button>
      </div>
    )}
    </>
  )
}
