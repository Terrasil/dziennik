import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from './components/Login';
import Users from './components/Users';
import Main from './components/Main';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

function App(){

  const [csrftoken, setCSRFToken] = useState(undefined);
  const [sessionid, setSessionID] = useState(undefined);
  const [userdata, setUserData] = useState(undefined);
  
  // Odczytywanie wartości z cookie
  const getCookie = (name) => {
    var str = document.cookie
    str = str.split(', ');
    var result = {};
    for (var i = 0; i < str.length; i++) {
        var cur = str[i].split('=');
        result[cur[0]] = cur[1];
    }
    return result[name] ? result[name] : ''
  }

  // Ustawianie - o ile istnieją - wartość z csrftoken oraz sessionid
  const loadCookies = () => {
    setCSRFToken(getCookie('csrftoken'))
    setSessionID(getCookie('sessionid'))
  }

  // Ustawianie wartośći do useState otrzymane z innych komponentów
  const getCSRFToken = (csrftoken) => {
    setCSRFToken(csrftoken)
  }
  const getSessionID = (sessionid) => {
    setSessionID(sessionid)
  }
  const getUserData = (userdata) => {
    setUserData(userdata)
  }

  // Wykonujemy odczyt cookie - wykonuje się jednokrotnie
  useEffect(() => {
    loadCookies()
  }, []);

  return (
    <Router>
      <Switch>
        <Route exact path="/">
            <Main csrftoken={csrftoken} userdata={userdata}/>
        </Route>
        <Route path="/login">
            <Login csrftoken={csrftoken} getCSRFToken={getCSRFToken} getUserData={getUserData}/>
        </Route>
        <Route path="/userslist">
            <Users csrftoken={csrftoken}/>
        </Route>
      </Switch>
    </Router>
  )
}
export default App;
