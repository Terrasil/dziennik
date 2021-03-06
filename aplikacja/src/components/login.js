import React, { useEffect, useState } from 'react';
import  { Redirect } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image'
import Logo from '../img/logo.png'
import { Alert } from 'react-bootstrap';
import { getCookie } from '../functions'

function Login(props){

  const [ form, setForm ] = useState({})
  const [ errors, setErrors ] = useState({})
  const [ rememberme, setRememberMe ] = useState(getCookie('rememberme'))

  // Pobieranie CSRFToken'a z Django
  const receiveToken = async () => {
    const response = await fetch('http://localhost:8000/auth/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(form) // Dane z formularza
    }).catch( error => console.error(error))
    const data = await response.json()
    if(!!data.non_field_errors){
      // Nieudane otrzymanie CSRFTokena
      // Zwracamy brak tokena
      return {
        token:undefined, 
        received:false
      }
    }else{
      // Udane otrzymanie CSRFTokena
      // Zapisujemy odrazu nasz CSRFToken do cookies oraz local storage
      document.cookie = "csrftoken="+data.token
      window.localStorage.setItem( 'csrftoken', data.token )
      // Zwracamy token
      return {
        token:data.token, 
        received:true
      }
    }
  }

  // Pobieranie informacji o uzytkowniku z Django
  const receiveUserData = async (token) => {
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
  const receiveUserActive = async (email) => {
    const response = await fetch('http://localhost:8000/api/users-activated/?email='+email, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).catch( error => console.error(error))
    const data = await response.json()
    if(!data.length){
      // Nieudane otrzymanie danych o aktywacji użytkownika
      return {
        activated:false,
        received:false
      }
    }else{
      // Udane otrzymanie danych o aktywacji użytkownika
      return {
        activated:data[0].is_active,
        received:true
      }
    }
  }
  

  // Logowanie
  const login = async (token) => {
    // Tymczasowy kontener
    let _receivedToken = {}
    if(token === undefined){
      // Jeżeli nie podano tokenu jako argumenu
      // Zwracamy token do Aplikacji
      _receivedToken = await receiveToken()
    }else{
      // Podano token jako argument więc ustawiamy go
      _receivedToken = {token: token, received: undefined}
    }

    const receivedToken = _receivedToken

    // Zwracamy informacje o użytkowniku do Aplikacji
    const receivedUserData = await receiveUserData(receivedToken.token)

    // Weryfikacja akywacji konta użytkownika
    const receivedActivated = await receiveUserActive(form.username)

    return {
      fetchToken: receivedToken,
      fetchUserData: receivedUserData,
      fetchUserActivated: receivedActivated
    }
  }
  
  // Metoda wykonywania po przycisnięciu 'Zaloguj'
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors(errors)

    // Logowanie
    const loginResult = await login(undefined)

    // Zapamiętywanie użytkownika
    document.cookie = "rememberme="+rememberme+";max-age="+Number.MAX_SAFE_INTEGER
    
    // Przekazanie tokenu do aplikacji
    props.getCSRFToken(loginResult.fetchToken.token) 

    // Przekazanie danych użytkownika do aplikacji
    props.getUserData(loginResult.fetchUserData.userdata)
  
    // Ponowna weryfikacja błędów
    const newErrors = await validation(loginResult)
    setErrors(newErrors)
  }

  // Pobieranie informacji z formularza logowania
  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value
    })
    // Aktualizacja listy błędów
    if ( !!errors[field] ) setErrors({
      ...errors,
      [field]: null
    })
  }

  // Ustawienie automatycznego logowania 
  const rememberMe = (e) => {
    setRememberMe(e.target.checked)
  }

  // Walidacja formularza
  const validation = async (login) => {
    const { username, password } = form
    const newErrors = {}

    let formValidated = true

    // Username errory
    // Nie podano email'a (username)
    if ( !username || username === '' ) {
      formValidated = false
      newErrors.username = 'Podaj adres email!'
    }
    // Zły format/pattern email'a - /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    //eslint-disable-next-line
    else if(!/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(username)) {
      formValidated = false 
      newErrors.username = 'Podano zły format! \'example@mail.com\''
    }

    // Password errory
    // Nie podano hasła
    if ( !password || password === '' ){
      formValidated = false  
      newErrors.password = 'Podaj hasło!'
    }
    // Hasło zakrótkie (min. 8 znaków)
    else if(password.length < 8){
      formValidated = false  
      newErrors.password = 'Podano zakrótkie hasło!'
    }

    // Nieudane logowanie
    // Sprawdzenie poprawnego uzupełniena formularza
    if (formValidated){
      // Konto użytkownika nie jest aktywne
      if ( login.fetchUserActivated.activated !== true && login.fetchUserActivated.received ){ newErrors.login = 'Twoje konto nie zostało jeszcze aktywowane!' }
      // Nie otrzymano csrftokena lub nie otrzymano informacji o użytkowniku
      else if ( !login.fetchToken.received  && !login.fetchUserData.received ){ newErrors.login = 'Nazwa użytkownika lub hasło nie zgadzają się. Sprawdź jeszcze raz i spróbuj ponownie.' }
    }

    return newErrors
  }

  const redirect = () => {
    if (props.csrftoken && props.userdata) {
      return <Redirect to='/' />
    }
  }

  useEffect(()=>{
    if(getCookie('rememberme') === 'true'){
      // Automatyczne logowanie
      const loginResult = login(getCookie('csrftoken'))
      
      // Ponowna weryfikacja błędów
      const newErrors = validation(loginResult)
      setErrors(newErrors)
    }
  },[])
  
  return (
    <>
      { redirect() }
      <div className="container h-100">
        <div className="row h-100 justify-content-center align-items-center">
          <Form className="col-md-6">
            <Form.Group className="text-center">
              <Image src={Logo} style={{border: 'none'}} thumbnail />
            </Form.Group>
            <Form.Group>
              <Form.Label>Adres Email</Form.Label>
              <Form.Control 
                type='text' name="username"
                onChange={ e => setField('username', e.target.value) }
                isInvalid={ !!errors.username }
              />
              <Form.Control.Feedback type='invalid'>{ errors.username }</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Hasło</Form.Label>
              <Form.Control 
                type='password' name="password"
                onChange={ e => setField('password', e.target.value) }
                isInvalid={ !!errors.password }
              />
              <Form.Control.Feedback type='invalid'>{ errors.password }</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Alert variant={'danger'} show={ !!errors.login } type='invalid'>{ errors.login }</Alert>
            </Form.Group>
            <Form.Group>
              <Form.Check type="checkbox" label="Zapamiętaj mnie!" onChange={ e => rememberMe(e) }/>
            </Form.Group>
            <Form.Group className="text-center">
              <Button className="rounded-pill col-6" type='submit' onClick={ handleSubmit }>Zaloguj</Button>
            </Form.Group>
            <Form.Group className="text-center">
              Nie posiadasz konta? <a href="../register" id="signup">Zarejestruj się</a>
            </Form.Group>
          </Form>
        </div>
      </div>
    </>
  )
}

export default Login;
