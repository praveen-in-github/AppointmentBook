import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";
interface Props{
    loggedIn:boolean,
    children:ReactNode
}
export default function ProtectedComponent({ loggedIn, children }:Props) {
    const navigate = useNavigate();

    if (loggedIn) return <>{children}</>
     else {
      navigate("/login");
      return (<></>)
     }
}
