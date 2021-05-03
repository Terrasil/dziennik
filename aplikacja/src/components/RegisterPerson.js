import React, { useState } from 'react';
import  { Redirect } from 'react-router-dom'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image'
import Logo from '../img/logo.png'
import { Alert } from 'react-bootstrap';
/*
register = event => {
    fetch('http://localhost:8000/api/users/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(this.state.credentials)
    })
    .then( data => data.json())
    .then(
      data => {
        console.log(data.token);
      }
    )
    .catch( error => console.error(error))
  }
*/
function RegisterPerson(props){

  const [ form, setForm ] = useState({})
  const [ errors, setErrors ] = useState({})
  const [ receivetoken, setReceiveToken ] = useState({})
  const [ receiveuserdata, setReceiveUserData ] = useState({})

  // Pobieranie informacji o uzytkowniku z Django
  const userData = (token) => {
    // Adres email jest unikatowy dlatego szukamy danych o użytkowniku po 'email'
    fetch('http://localhost:8000/api/users/?email='+form.username, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}` // Musimy podać nasz CSRFToken aby otrzymać odpowiedź
      }
    })
    .then( data => data.json())
    .then(
      data => {
        // Jeżeli się nie powiedzie otrzymamy {detail: 'wiadomość o błędzie'}
        if(data.detail){
          // Nieudane otrzymanie danych o użytkowniku
          setReceiveUserData(false)
          // Zwracam pustą listę/tablicę
          return []
        }else{
          // Udane otrzymanie danych o użytkowniku
          setReceiveUserData(true)
          // Zwracam informacje o otrzymanym uzytkowniku (JSON)
          return data
        }
      }
    )
    .catch( error => console.error(error))
  }

  // Logowanie
  const login = (event) => {
    // Pobieramy CSRFToken z Django
    fetch('http://localhost:8000/auth/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(form) // Dane z formularza
    })
    .then( data => data.json())
    .then(
      data => {
        // Jeżeli się nie powiedzie otrzymamy {detail: 'wiadomość o błędzie'}
        if(data.detail){
          // Nieudane otrzymanie CSRFTokena
          setReceiveToken(false)
        }else{
          // Udane otrzymanie CSRFTokena
          setReceiveToken(true)
          // Zwracamy token do Aplikacji
          props.getCSRFToken(data.token);
          console.log('logowanie')
          // Zwracamy informacje o użytkowniku do Aplikacji
          props.getUserData(userData(data.token));
          // Zapisujemy odrazu nasz CSRFToken do cookies
          document.cookie = "csrftoken="+data.token
        }
      }
    )
    .catch( error => console.error(error))
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
  
  // Metoda wykonywania po przycisnięciu 'Zaloguj'
  const handleSubmit = e => {
    e.preventDefault()
    const newErrors = findFormErrors()
    // Ustawiamy powiadomienia o błędach w Form.Control.Feedback
    // Można się zalogować
    login()
    //if ( Object.keys(newErrors).length > 0 ) {
    //  setErrors(newErrors)
      // Wystpiły błędy
    //} else {
    //  setErrors(newErrors)
    //}
  }

  // Walidacja formularza
  const findFormErrors = () => {
    const { username, password } = form
    const newErrors = {}

    // Username errory
    // Nie podano email'a (username)
    if ( !username || username === '' ) newErrors.username = 'Podaj adres email!'
    // Zły format/pattern email'a
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) newErrors.username = 'Podano zły format! \'example@mail.com\''

    // Password errory
    // Nie podano hasła
    if ( !password || password === '' ) newErrors.password = 'Podaj hasło!'
    // Hasło zakrótkie (min. 8 znaków)
    else if(password.length < 8) newErrors.password = 'Podano zakrótkie hasło!'

    // Nieudane logowanie
    // Nie otrzymano csrftokena
    if ( !receivetoken ) newErrors.login = 'Nazwa użytkownika i hasło nie zgadzają się. Sprawdź jeszcze raz i spróbuj ponownie.'
    // Nie otrzymano informacji o użytkowniku
    if ( !receiveuserdata ) newErrors.login = 'Nazwa użytkownika lub hasło nie zgadzają się. Sprawdź jeszcze raz i spróbuj ponownie.'

    return newErrors
  }

  return (
    <>
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
              <Form.Check type="checkbox" label="Zapamiętaj mnie!"/>
            </Form.Group>
            <Form.Group className="text-center">
              <Button className="rounded-pill px-5" type='submit' onClick={ handleSubmit }>Zaloguj</Button>
            </Form.Group>
            <Form.Group className="text-center">
              Nie posiadasz konta? <a href="{%url 'signup'%}" id="signup">Zarejestruj się</a>
            </Form.Group>
          </Form>
        </div>
      </div>
    </>
  )
}

export default RegisterPerson;
