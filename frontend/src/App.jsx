import { useState } from 'react'
import Register from './components/Register'
import { useAuth } from './auth/AuthContext'
import Login from './components/Login'


const App = () => {
const {isLoggedIn, BASE_API, user} = useAuth();
const [loginClick, setLoginClick] = useState(true);

const getAuth = async() => {
  const response = await fetch(`${BASE_API}/me`, {
    credentials: 'include',
  });
  const result = await response.json();
  if(response.ok) {
    alert(`${result.message}`);
    console.log(result.user);
  } else {
    alert(' error!! ')
  }
}


  return (
    <>
    {isLoggedIn ? (
      <div>
        <h1>User is logged in!!</h1>
        <h3>Name: {user.name || user.first_name}</h3>
        <h3>id: {user.id}</h3>
        <button onClick={() => getAuth()}>Get authenticated!</button>
      </div>
    ) : (
      <div>
        <h1>User is not currently logged in 😒</h1>
        <button onClick={() => getAuth()}>Get authenticated!</button>
      </div>
    )}
    <button onClick={()=>setLoginClick((prev) => !prev)}>{loginClick ? 'Need an account?' : 'Already have an account?'}</button>
    {
      loginClick ?
      <Login />
      :
    <Register />
    }
     
    </>
  )
}

export default App
