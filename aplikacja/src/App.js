import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Login from './components/Login';
import Activate from './components/Activate';
import Main from './components/Main';
import RegisterPerson from './components/User/RegisterPerson'
import RegisterInstitution from './components/Institution/RegisterInstitution'
import CreateActivity from './components/Institution/CreateActivity'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import CreateEmployee from './components/Institution/CreateEmployee';
import CreateChild from './components/User/CreateChild';
import Settings from './components/Settings';
import Children from './components/User/Children';
import SettingsChangeInstitutionData from './components/Institution/SettingsChangeInstitutionData';
import SettingsChangeEmail from './components/User/SettingsChangeEmail';
import SettingsChangePassword from './components/User/SettingsChangePassword';
import SettingsChangePersonData from './components/User/SettingsChangePersonData';

function App(){

  const [csrftoken, setCSRFToken] = useState(undefined);
  const [userdata, setUserData] = useState(undefined);
  
  // Odczytywanie wartości z cookie
  const getCookie = (name) => {
    var str = document.cookie
    str = str.split('; ');
    var result = {};
    for (var i = 0; i < str.length; i++) {
        var cur = str[i].split('=');
        result[cur[0]] = cur[1];
    }
    return result[name] ? result[name] : ''
  }

  // Ponowne pobieranie informacji o uzytkowniku z Django
  const updateUserDate= async (token) => {
    const response = await fetch('http://localhost:8000/api/users/?token='+token, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}` // Musimy podać nasz CSRFToken aby otrzymać odpowiedź
      }
    }).catch( error => console.error(error))
    const data = await response.json()
    if(!!data.detail){
      // Nieudane otrzymanie danych o użytkowniku
      // Zwracamy nic
      return {
        userdata:undefined, 
        received:false
      }
    }else{
      // Udane otrzymanie danych o użytkowniku
      window.localStorage.setItem( 'userdata', JSON.stringify(data).toString() )
      // Zwracam informacje o otrzymanym uzytkowniku (JSON)
      return {
        //userdata:JSON.stringify(data).toString(), 
        userdata:data, 
        received:true
      }
    }
  }
  // Ustawianie - o ile istnieją - wartość z csrftoken oraz sessionid
  const loadCookies = () => {
    setCSRFToken(getCookie('csrftoken'))
  }

  const loadLocalStorage = () => {
    const localStoredCSRFToken = localStorage.getItem('csrftoken')
    setCSRFToken(localStoredCSRFToken)
    if(localStoredCSRFToken!==undefined){
      updateUserDate(localStoredCSRFToken)
    }
    const localStoredUserData = JSON.parse(localStorage.getItem('userdata')) ? JSON.parse(localStorage.getItem('userdata'))[0] : undefined
    setUserData(localStoredUserData)
  }

  // Ustawianie wartośći do useState otrzymane z innych komponentów
  const getCSRFToken = (_csrftoken) => {
    setCSRFToken(_csrftoken)
  }
  const getUserData = (_userdata) => {
    setUserData(_userdata[0])
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
            <Login csrftoken={csrftoken} userdata={userdata} getCSRFToken={getCSRFToken} getUserData={getUserData}/>
        </Route>
        <Route path="/register/person">
            <RegisterPerson csrftoken={csrftoken}/>
        </Route>
        <Route path="/register/institution">
            <RegisterInstitution csrftoken={csrftoken}/>
        </Route>
        <Route path="/register">
          <Redirect to='/register/person'/>
        </Route>
        <Route path="/activate/:code">
            <Activate csrftoken={csrftoken}/>
        </Route>
        <Route path="/create/activity">
            <CreateActivity userdata={userdata} csrftoken={csrftoken}/>
        </Route>
        <Route path="/create/employee">
            <CreateEmployee userdata={userdata} csrftoken={csrftoken}/>
        </Route>
        <Route path="/create/child">
            <CreateChild userdata={userdata} csrftoken={csrftoken}/>
        </Route>
        <Route path="/children">
            <Children userdata={userdata} csrftoken={csrftoken}/>
        </Route>
        <Route path="/settings/change/data/institution">
            <SettingsChangeInstitutionData userdata={userdata} csrftoken={csrftoken}/>
        </Route>
        <Route path="/settings/change/data/person">
            <SettingsChangePersonData userdata={userdata} csrftoken={csrftoken}/>
        </Route>
        <Route path="/settings/change/email">
            <SettingsChangeEmail userdata={userdata} csrftoken={csrftoken}/>
        </Route>
        <Route path="/settings/change/password">
            <SettingsChangePassword userdata={userdata} csrftoken={csrftoken}/>
        </Route>
        <Route path="/settings">
            <Settings userdata={userdata} csrftoken={csrftoken}/>
        </Route>

        <Route path="/">
            <Main userdata={userdata} csrftoken={csrftoken} type='week'/>
        </Route>

      </Switch>
    </Router>
  )
}
export default App;
