import React, { useState } from 'react';
import  { Redirect } from 'react-router-dom'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image'
import Logo from '../img/logo.png'
import { Alert, InputGroup, ProgressBar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faUniversity } from '@fortawesome/free-solid-svg-icons'

function RegisterPerson(props){

  const [ form, setForm ] = useState({})
  const [ errors, setErrors ] = useState({})

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
    const newErrors = validation()
    setErrors(newErrors)
  }

  // Walidacja formularza
  const validation = () => {
    const { firstname, lastname, email, password, repassword, phone } = form
    const newErrors = {}

    let formValidated = true

    // FirstName errory
    // Nie podano imienia
    if ( !firstname || firstname === '' ) {
      formValidated = false
      newErrors.firstname = 'Podaj imię!'
    }
    
    // LastName errory
    // Nie podano nazwiska
    if ( !lastname || lastname === '' ) {
      formValidated = false
      newErrors.lastname = 'Podaj nazwisko!'
    }
    // Zły format nazwiska
    if( !/^([a-zA-ZęółśążźćńĘÓŁŚĄŻŹĆŃ][a-zA-ZęółśążźćńĘÓŁŚĄŻŹĆŃ\'\-]+([\ a-zA-ZęółśążźćńĘÓŁŚĄŻŹĆŃ][a-zA-ZęółśążźćńĘÓŁŚĄŻŹĆŃ\'\-]+)*).{1,}/.test(lastname)){
      formValidated = false
      newErrors.lastname = 'Podano błędne nazwisko!'
    }

    // Email errory
    // Nie podano email'a
    if ( !email || email === '' ) {
      formValidated = false
      newErrors.email = 'Podaj adres email!'
    }
    // Zły format/pattern email'a
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      formValidated = false
      newErrors.email = 'Podano zły format! \'example@mail.com\''
    }

    // Password errory
    // Nie podano hasła
    if ( !password || password === '' ) {
      formValidated = false
      newErrors.password = 'Podaj hasło!'
    }
    //const moderate = /(?=.*[A-Z])(?=.*[a-z]).{5,}|(?=.*[\d])(?=.*[a-z]).{5,}|(?=.*[\d])(?=.*[A-Z])(?=.*[a-z]).{5,}/g;
  //const strong = /(?=.*[A-Z])(?=.*[a-z])(?=.*[\d]).{7,}|(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=.*[\d]).{7,}/g; //znak
  //const extraStrong = /(?=.*[A-Z])(?=.*[a-z])(?=.*[\d])(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?]).{9,}/g; //znak
    else{
      newErrors.password = ''
      // Hasło zakrótkie (min. 8 znaków)
      if(password.length < 8) {
        formValidated = false
        newErrors.password += `Hasło musi zkładać się z 8-u znaków!\n\n`
      }
      // Brak wielkiej litery
      if(!/^(?=.*?[A-ZĘÓŁŚĄŻŹĆŃ])$/.test(password)) {
        formValidated = false
        newErrors.password += `Hasło musi zawierać dużą literę!\n\n`
      }
    }

    // RePassword errory
    // Hasła się nie zgadzają
    if ( password !== repassword ) {
      formValidated = false
      newErrors.repassword = 'Hasła się nie zgadzają!'
    }
    // Nie powtórzono hasła
    if ( !repassword || repassword === '' ) {
      formValidated = false
      newErrors.repassword = 'Powtórz hasło!'
    }

    // Phone errory
    // Jeżeli podamy numer telefonu to nalezy sprawdzić jego format
    if((phone && phone !== '' ) && !/^(\+{0,})(\d{0,})([(]{1}\d{1,3}[)]{0,}){0,}(\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}(\s){0,}$/gm.test(phone)){
      // Obsługiwane formaty:
      // (123) 456-7890
      // (123)456-7890
      // 123-456-7890
      // 1234567890
      // +31636363634
      // +3(123) 123-12-12
      // +3(123)123-12-12
      // +3(123)1231212
      // +3(123) 12312123
      // +3(123) 123 12 12
      // 075-63546725
      // +7910 120 54 54
      // 910 120 54 54
      // 8 999 999 99 99
      formValidated = false
      newErrors.phone = 'Zły format telefonu!'
    }

    if(formValidated){
      // register()
    }

    return newErrors
  }

  const redirect = () => {
    if (!!props.csrftoken) {
      return <Redirect to='/' />
    }
  }
  
  // Logo nad formularzem
  //<Form.Group className="text-center pb-4 container-fluid">
  //  <Image src={Logo} style={{width:'50%', padding:'1rem'}}/>
  //</Form.Group>

  return (
    <>
      { redirect() }
      <div className="container h-100">
        <div className="row h-100 justify-content-center align-items-center">
          <Form className="col-md-6">
            <Form.Group className="text-center pb-4 container-fluid">
              <div className="row align-items-start">
                <div className="col" style={{paddingTop:'1rem', paddingBottom:'1rem',borderBottom:'0.5rem solid dodgerblue'}}>
                  <FontAwesomeIcon style={{fontSize: 'min(25vw, 900%)'}} color="dodgerblue" icon={faUser} />
                </div>
                <div className="col" style={{paddingTop:'1rem', paddingBottom:'1rem',borderBottom:'0.5rem solid transparent'}}>
                  <a href="../login" id="signup"><FontAwesomeIcon style={{fontSize: 'min(25vw, 900%)'}} color="silver" icon={faUniversity} /></a>
                </div>
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label>Podaj imię</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control 
                  type='text' name="firstname"
                  onChange={ e => setField('firstname', e.target.value) }
                  isInvalid={ !!errors.firstname }
                />
                <Form.Control.Feedback type='invalid'>{ errors.firstname }</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label>Podaj nazwisko</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control 
                  type='text' name="lastname"
                  onChange={ e => setField('lastname', e.target.value) }
                  isInvalid={ !!errors.lastname }
                />
                <Form.Control.Feedback type='invalid'>{ errors.lastname }</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label>Adres Email</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control 
                  type='email' name="email"
                  onChange={ e => setField('email', e.target.value) }
                  isInvalid={ !!errors.email }
                />
                <Form.Control.Feedback type='invalid'>{ errors.email }</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label>Hasło</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control 
                  type='password' name="password"
                  onChange={ e => setField('password', e.target.value) }
                  isInvalid={ !!errors.password }
                  data-toggle="password"
                />
                <Form.Control.Feedback type='invalid'>{ errors.password }</Form.Control.Feedback>
                <Form.Control.Feedback type='invalid'>{ errors.password }</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label>Powtórz hasło</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control 
                  type='password' name="repassword"
                  onChange={ e => setField('repassword', e.target.value) }
                  isInvalid={ !!errors.repassword }
                  data-toggle="repassword"
                />
                <Form.Control.Feedback type='invalid'>{ errors.repassword }</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label>Numer telefonu <i style={{color:'gray'}}>(opcjonalnie)</i></Form.Label>
              <InputGroup className="mb-3">
                <Form.Control 
                  type='tel' name="phone"
                  onChange={ e => setField('phone', e.target.value) }
                  isInvalid={ !!errors.phone }
                />
                <Form.Control.Feedback type='invalid'>{ errors.phone }</Form.Control.Feedback>
             </InputGroup>
            </Form.Group>
            <Form.Group>
              <Alert variant={'danger'} show={ !!errors.register } type='invalid'>{ errors.register }</Alert>
            </Form.Group>
            <Form.Group className="text-center pt-4">
              <Button className="rounded-pill col-6" type='submit' onClick={ handleSubmit }>Dołącz za darmo</Button>
            </Form.Group>
            <Form.Group className="text-center">
              Posiadasz juz konto? <a href="../../login" id="signup">Zaloguj się</a>
            </Form.Group>
          </Form>
        </div>
      </div>
    </>
  )
}

export default RegisterPerson;
