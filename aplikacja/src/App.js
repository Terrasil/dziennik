import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Login from './components/Login';
import Users from './components/Users';
import Main from './components/Main';
import RegisterPerson from './components/RegisterPerson'
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

  const loadLocalStorage = () => {
    const localStoredCSRFToken = localStorage.getItem('csrftoken')
    setCSRFToken(localStoredCSRFToken)
    const localStoredUserData = localStorage.getItem('userdata')
    setUserData(localStoredUserData)
  }

  // Ustawianie wartośći do useState otrzymane z innych komponentów
  const getCSRFToken = (_csrftoken) => {
    setCSRFToken(_csrftoken)
  }
  const getSessionID = (_sessionid) => {
    setSessionID(_sessionid)
  }
  const getUserData = (_userdata) => {
    setUserData(_userdata)
    console.table(_userdata)
  }

  // Wykonujemy odczyt cookie - wykonuje się jednokrotnie
  useEffect(() => {
    loadCookies()
    loadLocalStorage()
  }, []);

  return (
    <Router>
      <Switch>
        <Route path="/login">
            <Login csrftoken={csrftoken} getCSRFToken={getCSRFToken} getUserData={getUserData}/>
        </Route>
        <Route exact path="/">
            <Main/>
        </Route>
        <Route path="/register/person">
            <RegisterPerson csrftoken={csrftoken}/>
        </Route>
        <Route path="/register">
          <Redirect to='/register/person'/>
        </Route>
        <Route path="/userslist">
            <Users/>
        </Route>
      </Switch>
    </Router>
  )
}
export default App;
