import React, { useState } from 'react';
import  { Redirect } from 'react-router-dom'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image'
import Logo from '../../img/logo.png'
import { Alert, InputGroup, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faUniversity } from '@fortawesome/free-solid-svg-icons'

function RegisterPerson(props){

  const [ form, setForm ] = useState({})
  const [ errors, setErrors ] = useState({})
  const [ showmodal, setShowModal ] = useState(false)

  const register = async () => {
    // Przygotowanie informacji o tworzonym użytkowniku
    const registerData = {}
    registerData.username = form.email
    registerData.password = form.password
    registerData.first_name = form.firstname
    registerData.last_name = form.lastname
    registerData.email = form.email
    registerData.phone = form.phone
    registerData.role = 'user'
    // Wykonanie zapytania - rejestracji
    const response = await fetch('http://localhost:8000/api/users-register/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(registerData) // Przygotowane dane
    }).catch( error => console.error(error))
    const data = await response.json()
    if(data?.email){
      // Nieudana rejestracja
      return 'Istnieje już użytkownik z podanym adresem email.'
    }else{
      // Udana rejestracja
      return undefined
    }
  }

  // Pobieranie informacji z formularza rejestracji
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
  
  // Metoda wykonywania po przycisnięciu 'Dołącz za darmo'
  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = await validation()
    setErrors(newErrors)
  }

  // Walidacja formularza
  const validation = async () => {
    const { email} = form
    const newErrors = {}

    let formValidated = true

    // Email errory
    // Zły format/pattern email'a
    //eslint-disable-next-line
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      formValidated = false
      newErrors.email = 'Podano zły format! \'example@mail.com\''
    }
    // Nie podano email'a
    if ( !email || email === '' ) {
      formValidated = false
      newErrors.email = 'Podaj adres email!'
    }

    // Rejestracja
    newErrors.register = undefined
    if(formValidated){
      // Zwracanie odpowiedzi z zapytania do api
      const registerReceive = await register()
      if(registerReceive !== undefined){
        // Wystąpił błąd
        // Ustawiamy error do wyświetlenia
        newErrors.register = registerReceive
      }else{
        // Nie wystąpił błąd
        // Pokazanie modal'u
        setShowModal(true)
      }
    }

    return newErrors
  }

  const redirect = () => {
    if (!!props.csrftoken) {
      return <Redirect to='/' />
    }
  }

  const modal = () => {
    return (
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        show={showmodal}
        onHide={() => setShowModal(false)}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header style={{border:'none'}} closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Dziękujemy za rejestrację
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{border:'none'}}>
          <p>Wysłaliśmy wiadomość z linkiem aktywacyjnym na podany adres email w celu weryfikacji.</p>
        </Modal.Body>
        <Modal.Footer className="align-left" style={{border:'none'}}>
          <a href="../../login" style={{float:'right'}} id="signup"><Button className="rounded-pill">Wróć do panelu logowania</Button></a>
        </Modal.Footer>
      </Modal>
    )
  }
  
  // Logo nad formularzem
  //<Form.Group className="text-center pb-4 container-fluid">
  //  <Image src={Logo} style={{width:'50%', padding:'1rem'}}/>
  //</Form.Group>

  return (
    <>
      { redirect() }
      { modal() }
      <div className="container h-100">
        <div className="row h-100 justify-content-center align-items-center">
          <Form className="col-md-6">
            <Form.Group className="text-center pb-4 container-fluid">
              <div className="row align-items-start">
                <div className="col" style={{paddingTop:'1rem', paddingBottom:'1rem',borderBottom:'0.5rem solid dodgerblue'}}>
                  <FontAwesomeIcon style={{fontSize: 'min(25vw, 900%)'}} color="dodgerblue" icon={faUser} />
                </div>
                <div className="col" style={{paddingTop:'1rem', paddingBottom:'1rem',borderBottom:'0.5rem solid transparent'}}>
                  <a href="../register/institution" id="signup"><FontAwesomeIcon style={{fontSize: 'min(25vw, 900%)'}} color="silver" icon={faUniversity} /></a>
                </div>
              </div>
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
              <Alert variant={'danger'} show={ !!errors.register } type='invalid'>{ errors.register }</Alert>
            </Form.Group>
            <Form.Group className="text-center pt-4">
              <Button className="rounded-pill col-6" type='submit' onClick={ handleSubmit }>Zatwierdź zmiany</Button>
            </Form.Group>
          </Form>
        </div>
      </div>
    </>
  )
}

export default RegisterPerson;