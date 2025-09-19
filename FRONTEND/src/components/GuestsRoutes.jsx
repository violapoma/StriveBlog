import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";

function GuestsRoutes(){
  const {token} = useAuthContext(); 
  
  return token ? <Navigate to='/' replace/> :<Outlet />
}
export default GuestsRoutes;