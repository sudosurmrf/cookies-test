import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

const Login = () => {

  const { setIsLoggedIn, BASE_API, setUser } = useAuth();
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const logMeIn = async () => {
    const response = await fetch(`${BASE_API}/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userInfo),
    });

    if (!response.ok) {
      throw new Error('problems logging in');
    };
    const result = await response.json();
    console.log(result);
    setIsLoggedIn(true);
    setUser(result.user);
  }

  return (
    <>
      <input placeholder='email' value={userInfo.email} onChange={(e) => setUserInfo((prev) => ({ ...prev, email: e.target.value }))} />
      <input placeholder='password' type='password' value={userInfo.password} onChange={(e) => setUserInfo((prev) => ({ ...prev, password: e.target.value }))} />
      <button onClick={logMeIn}>Log in!</button>
    </>
  )
}

export default Login;