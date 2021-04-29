import React, { useState } from 'react';
import './App.css';
import Login from './components/login';
import Users from './components/users';

function App() {

  const [token, setToken] = useState('');

  const userLogin = (tok) => {
    setToken(tok);
  }

  return (
    <div className="App">
      <Login userLogin={userLogin}/>
      <Users token={token}/>
    </div>
  );
}

export default App;
