import React, { useState } from 'react';
import  { Redirect } from 'react-router-dom'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image'
import Logo from '../img/logo.png'
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
const Login = (props) => {

  const [ form, setForm ] = useState({})
  const [ errors, setErrors ] = useState({})

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
          // Zwracam pustą listę/tablicę
          return []
        }else{
          // Udane otrzymanie danych o użytkowniku
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
        }else{
          // Udane otrzymanie CSRFTokena
          // Zwracamy token do Aplikacji
          props.getCSRFToken(data.token);
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
    if ( Object.keys(newErrors).length > 0 ) {
      setErrors(newErrors)
      // Wystpiły błędy
      return false
    } else {
      // Można się zalogować
      login()
      return true
    }
  }

  // Walidacja formularza
  const findFormErrors = () => {
    const { username, password } = form
    const newErrors = {}

    // Username errory
    if ( !username || username === '' ) newErrors.username = 'Podaj adres email!'
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) newErrors.username = 'Podano zły format! \'example@mail.com\''

    // Password errory
    if ( !password || password === '' ) newErrors.password = 'Podaj hasło!'
    else if(password.length < 8) newErrors.password = 'Podano zakrótkie hasło!'

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

export default Login;
