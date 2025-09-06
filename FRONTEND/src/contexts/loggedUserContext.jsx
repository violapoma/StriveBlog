import { createContext, useContext, useState } from "react";

const loggedUserContext = createContext(); 

export function LoggedUserContext({children}){
  const [loggedUser, setLoggedUser] = useState(); 

  return (
    <loggedUserContext.Provider value={{loggedUser, setLoggedUser}}>
      {children}
    </loggedUserContext.Provider>
  );
}

export function useLoggedUsetContext(){
  return useContext(loggedUserContext);
}