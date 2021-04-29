import React, { useState } from 'react';
import Login from './components/Login';
import Users from './components/Users';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

function App() {

  const [token, setToken] = useState('');

  const userLogin = (token) => {
    setToken(token);
  }

  return (
    <>
      <Login userLogin={userLogin}/>
      <Users token={token}/>
    </>
  );
}

export default App;
