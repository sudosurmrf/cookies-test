import { useState } from "react";
import { useAuth } from "../auth/AuthContext";


const Register = () => {
  const { BASE_API, isLoggedIn, setIsLoggedIn } = useAuth();
  const [userInfo, setUserInfo] = useState({
    email:"",
    password: "",
    firstName: "",
  });


  const registerUser = async() => {
    try{

      const response = await fetch(`${BASE_API}/register`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        credentials: "include",
        body: JSON.stringify(userInfo)
      });


      if(!response.ok) {
        throw new Error('cookies are not valid!!')
      };
      const result = await response.json();
      console.log(result);
      setIsLoggedIn(true);
    }catch(err){
      console.log(err);
    }
  }

  return (
    <>
    <input placeholder="email" value={userInfo.email} onChange={(e) => setUserInfo((prev) => ({...prev, email: e.target.value}))} />
    <input placeholder="password" type="password" value={userInfo.password} onChange={(e) => setUserInfo((prev) => ({...prev, password: e.target.value}))} />
    <input placeholder="first Name" value={userInfo.firstName} onChange={(e) => setUserInfo((prev) => ({...prev, firstName: e.target.value}))} />

    <button onClick={registerUser}>Register</button>
    </>
  )
}

export default Register