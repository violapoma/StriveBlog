import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";

function GoogleCallback() {
  const navigate = useNavigate();
  const {login} = useAuthContext(); 
  const [params] = useSearchParams();

  useEffect(() => {
  
    const jwt = params.get("jwt");
    if (jwt) {
      login(jwt);
    } else {
      navigate("/login");
    }
  }, [params, navigate, login]);

  return <p>Logging in with Google...</p>;
}

export default GoogleCallback;
