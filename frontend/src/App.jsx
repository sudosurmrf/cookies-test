import { useState } from 'react'
import Register from './components/Register'
import { useAuth } from './auth/AuthContext'


const App = () => {
const {isLoggedIn, BASE_API} = useAuth();

const getAuth = async() => {
  const response = await fetch(`${BASE_API}/me`, {
    credentials: 'include',
  });
  const result = await response.json();
  if(response.ok) {
    alert(`${result.message}`);
  } else {
    alert(' error!! ')
  }
}


  return (
    <>
    {isLoggedIn ? (
      <div>
        <h1>User is logged in!!</h1>
        <button onClick={() => getAuth()}>Get authenticated!</button>
      </div>
    ) : (
      <div>
        <h1>User is not currently logged in 😒</h1>
        <button onClick={() => getAuth()}>Get authenticated!</button>
      </div>
    )}
    <Register />
     
    </>
  )
}

export default App
