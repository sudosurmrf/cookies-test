import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const BASE_API = 'http://localhost:3000/api'

  useEffect(() => {
    const authMe = async () => {
      const response = await fetch(`${BASE_API}/me`, {
        credentials: 'include',
      });
      if(!response.ok) return;
      
      setIsLoggedIn(true);
    }
    authMe();
  },[])

  return (
    <>
    <AuthContext.Provider value={{ BASE_API, isLoggedIn, setIsLoggedIn}}>
      {children}
      </AuthContext.Provider>   
    </>
  )
}

export const useAuth = () => {

  const ctx = useContext(AuthContext);
  if(ctx === undefined) {
    throw new Error('useAuth must be used inside of the provider')
  }
  return ctx
}