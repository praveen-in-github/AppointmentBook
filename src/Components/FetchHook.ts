import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios,{AxiosInstance,AxiosResponse,AxiosError} from 'axios'
import React from "react";

interface Appointment{
    _id:string,
    AppointmentStartDate:string,
    AppointmentEndDate:string
}

interface Appointmentgroup{
    _id:string,
    slotTimes:[{
        start:string,end:string
    }]
}

const useFetchAggregate = (httpRequest:AxiosInstance, url:string, HTTPmethod:string, bodyData?:string):[string,Appointmentgroup[],React.Dispatch<React.SetStateAction<Appointmentgroup[]>>] => {
    const [status, setStatus] = useState("Idle");
    const [data, setData] = useState<Appointmentgroup[]>([]);
    const navigate = useNavigate();
  
    useEffect(() => {
      if (!url) return;
      const fetchData = async () => {
        try {
          console.log("URL Requested is " + url);
          setStatus("Fetching");
          let res:AxiosResponse;
          if (HTTPmethod == "get") {
            res = await httpRequest.get(url);
          } else{
            res = await httpRequest.post(url, bodyData);
          }
          console.log(res.data);
          setData(res.data);
          setStatus("Fetched");
        } catch (error) {
          setStatus("Failed");
          if (axios.isAxiosError(error)) {
              console.log('error message: ', error.message);
              if(error.response){
              if (error.response.status == 401) {
                  navigate("/login");
                }
              }
              // 👇️ error: AxiosError<any, any>
              return error.message;
            } else {
              console.log('unexpected error: ', error);
            }
  
        }
      };
      fetchData();
    }, [HTTPmethod, httpRequest, bodyData, url]);
    return [status, data, setData];
  };

const useFetch = (httpRequest:AxiosInstance, url:string, HTTPmethod:string, bodyData:string):[string,Appointment[],React.Dispatch<React.SetStateAction<Appointment[]>>] => {
  const [status, setStatus] = useState("Idle");
  const [data, setData] = useState<Appointment[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!url) return;
    const fetchData = async () => {
      try {
        console.log("URL Requested is " + url);
        setStatus("Fetching");
        let res:AxiosResponse;
        if (HTTPmethod == "get") {
          res = await httpRequest.get(url);
        } else{
          res = await httpRequest.post(url, bodyData);
        }
        console.log(res.data);
        setData(res.data);
        setStatus("Fetched");
      } catch (error) {
        setStatus("Failed");
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.message);
            if(error.response){
            if (error.response.status == 401) {
                navigate("/login");
              }
            }
            // 👇️ error: AxiosError<any, any>
            return error.message;
          } else {
            console.log('unexpected error: ', error);
          }

      }
    };
    fetchData();
  }, [HTTPmethod, httpRequest, bodyData, url]);
  return [status, data, setData];
};


export {useFetch,useFetchAggregate}