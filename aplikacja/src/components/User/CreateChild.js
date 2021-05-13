import React, { useState } from 'react';
import  { Redirect } from 'react-router-dom'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image'
import { Alert, InputGroup, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faUniversity } from '@fortawesome/free-solid-svg-icons'
import Header from '../Header';

function CreateChild(props) {
    const [ form, setForm ] = useState({})
    const [ errors, setErrors ] = useState({})
    const [ showmodal, setShowModal ] = useState(false)

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
    const newErrors = await validation(true)
    setErrors(newErrors)
  }

  // Walidacja formularza
  const validation = async (nameExist) => {
    const { firstname, lastname, age, } = form
    const newErrors = {}

    let formValidated = true

    // FirstName errory
    // Zły format nazwiska
    //eslint-disable-next-line
    if( !/^[A-ZĘÓŁŚĄŻŹĆŃ]+[a-zA-ZęółśążźćńĘÓŁŚĄŻŹĆŃ]{3,}$/.test(firstname)){
      formValidated = false
      newErrors.firstname = 'Podano błędne imie! Powinno zaczynać się z wielkiej litery i nie zawierac cyfr.'
    }
    // Nie podano imienia
    if ( !firstname || firstname === '' ) {
      formValidated = false
      newErrors.firstname = 'Podaj imię!'
    }
    
    // LastName errory
    // Zły format nazwiska
    //eslint-disable-next-line
    if( !/^([A-ZĘÓŁŚĄŻŹĆŃ]+[a-zA-ZęółśążźćńĘÓŁŚĄŻŹĆŃ][a-zA-ZęółśążźćńĘÓŁŚĄŻŹĆŃ\'\-]+([\ a-zA-ZęółśążźćńĘÓŁŚĄŻŹĆŃ][a-zA-ZęółśążźćńĘÓŁŚĄŻŹĆŃ\'\-]+)*).{1,}/.test(lastname)){
      formValidated = false
      newErrors.lastname = 'Podano błędne nazwisko! Powinno zaczynać się z wielkiej litery i nie zawierac cyfr.'
    }
    // Nie podano nazwiska
    if ( !lastname || lastname === '' ) {
      formValidated = false
      newErrors.lastname = 'Podaj nazwisko!'
    }

    // Age errory
    // Zły format wieku
    //eslint-disable-next-line
    if( !/^[0-9]{1,2}/.test(age)){
        formValidated = false
        newErrors.age = 'Podano błędny wiek! Wiek powinienin zawierać wyłącznie cyfry.'
      }

      // Prawidłowy zakres wieku
      if ( age < 1 || age > 99){
        formValidated = false
        newErrors.age = 'Podano zły zakres wieku!'
      }

      // Nie podano wieku
      if ( !age || age === '' ) {
        formValidated = false
        newErrors.age = 'Podaj wiek!'
      }

    // Rejestracja
    newErrors.register = undefined
    if(formValidated){
        setShowModal(true)
    }

    return newErrors
  }

  const modal = () => {
    return (
      <Modal
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
      { modal() }
      <Header csrftoken={props.csrftoken} userdata={ props.userdata}/>
      <div className="container h-100" style={{top: "3.5rem", minHeight: "calc(100%-3.5rem)"}}>
        <div className="row h-100 justify-content-center align-items-center">
        <Form className="col-md-6">
            <Form.Group>
              <Form.Label>Podaj imię dziecka</Form.Label>
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
              <Form.Label>Podaj nazwisko dziecka</Form.Label>
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
              <Form.Label>Podaj Wiek dziecka</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control 
                  type='number' name="age"
                  onChange={ e => setField('age', e.target.value) }
                  isInvalid={ !!errors.age }
                />
                <Form.Control.Feedback type='invalid'>{ errors.age }</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Alert variant={'danger'} show={ !!errors.register } type='invalid'>{ errors.register }</Alert>
            </Form.Group>
            <Form.Group className="text-center pt-4">
              <Button className="rounded-pill col-6" type='submit' onClick={ handleSubmit }>Stwórz pracownika</Button>
            </Form.Group>
          </Form>
        </div>
      </div>
    </>
  )
}

export default CreateChild;
