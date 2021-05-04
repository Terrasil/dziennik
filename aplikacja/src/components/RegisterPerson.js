import React, { useState } from 'react';
import  { Redirect } from 'react-router-dom'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image'
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
    // Hasło zakrótkie (min. 8 znaków)
    else if(password.length < 8) {
      formValidated = false
      newErrors.password = 'Podano zakrótkie hasło!'
    }

    // Siła hasła
    newErrors.passwordstrength = 80
    if(newErrors.passwordstrength<50){
      formValidated = false
      newErrors.passwordstrengthlabel = 'Słabe'
      newErrors.passwordstrengthcolor = 'danger'
    }
    else if(newErrors.passwordstrength >= 50){
      newErrors.passwordstrengthlabel = 'Umiarkowane'
      newErrors.passwordstrengthcolor = 'warning'
    }
    else{
      newErrors.passwordstrengthlabel = 'Silne'
      newErrors.passwordstrengthcolor = 'success'
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

  return (
    <>
      <div className="container h-100">
        <div className="row h-100 justify-content-center align-items-center">
          <Form className="col-md-6">
            <Form.Group className="text-center pb-4 container-fluid">
              <div class="row align-items-start">
                <div class="col" style={{paddingTop:'1rem', paddingBottom:'1rem',borderBottom:'0.5rem solid dodgerblue'}}>
                  <FontAwesomeIcon style={{fontSize: 'min(25vw, 900%)'}} color="dodgerblue" icon={faUser} />
                </div>
                <div class="col" style={{paddingTop:'1rem', paddingBottom:'1rem',borderBottom:'0.5rem solid transparent'}}>
                  <FontAwesomeIcon style={{fontSize: 'min(25vw, 900%)'}} color="silver" icon={faUniversity} />
                </div>
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label>Podaj imię</Form.Label>
              <Form.Control 
                type='text' name="firstname"
                onChange={ e => setField('firstname', e.target.value) }
                isInvalid={ !!errors.firstname }
                isValid={ !errors.firstname }
              />
              <Form.Control.Feedback type='invalid'>{ errors.firstname }</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Podaj nazwisko</Form.Label>
              <Form.Control 
                type='text' name="lastname"
                onChange={ e => setField('lastname', e.target.value) }
                isInvalid={ !!errors.lastname }
              />
              <Form.Control.Feedback type='invalid'>{ errors.lastname }</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Adres Email</Form.Label>
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control 
                  type='email' name="email"
                  onChange={ e => setField('email', e.target.value) }
                  isInvalid={ !!errors.email }
                />
              </InputGroup>
              <Form.Control.Feedback type='invalid'>{ errors.email }</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Hasło</Form.Label>
              <Form.Control 
                type='password' name="password"
                onChange={ e => setField('password', e.target.value) }
                isInvalid={ !!errors.password }
              />
              <ProgressBar className="mt-1" animated variant={errors.passwordstrengthcolor} label={errors.passwordstrengthlabel} now={errors.passwordstrength | 0} />
              <Form.Control.Feedback type='invalid'>{ errors.password }</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Powtórz hasło</Form.Label>
              <Form.Control 
                type='password' name="repassword"
                onChange={ e => setField('repassword', e.target.value) }
                isInvalid={ !!errors.repassword }
              />
              <Form.Control.Feedback type='invalid'>{ errors.repassword }</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Numer telefonu <i style={{color:'gray'}}>(opcjonalnie)</i></Form.Label>
              <Form.Control 
                type='tel' name="phone"
                onChange={ e => setField('phone', e.target.value) }
                isInvalid={ !!errors.phone }
              />
              <Form.Control.Feedback type='invalid'>{ errors.phone }</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Alert variant={'danger'} show={ !!errors.register } type='invalid'>{ errors.register }</Alert>
            </Form.Group>
            <Form.Group className="text-center pt-4">
              <Button className="rounded-pill px-5" type='submit' onClick={ handleSubmit }>Dołącz za darmo</Button>
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
