import React, { useState } from 'react';
import  { Redirect } from 'react-router-dom'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image'
import { Alert, InputGroup, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faUniversity } from '@fortawesome/free-solid-svg-icons'
import Header from '../Header';

function CreateEmployee(props) {
    const [ form, setForm ] = useState({})
    const [ errors, setErrors ] = useState({})
    const [ showmodal, setShowModal ] = useState(false)

    const create = async () => {
      // Przygotowanie informacji o tworzonym użytkowniku
      const registerData = {}
      registerData.first_name = form.firstname
      registerData.last_name = form.lastname
      registerData.email = form.email
      registerData.username = form.email
      registerData.specialization = form.specialization
      registerData.password = 'empty'
      registerData.phone = form.phone || ' '
      registerData.institution_id = props.userdata.id
      registerData.role = 'employee'
      // Wykonanie zapytania - rejestracji
      const response = await fetch('http://localhost:8000/api/employee-register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${props.csrftoken}` // Musimy podać nasz CSRFToken aby otrzymać odpowiedź
        },
        body: JSON.stringify(registerData) // Przygotowane dane
      }).catch( error => console.error(error))
      const data = await response.json()
      console.log(data)
      if(data.specialization === undefined){
        // Nieudana rejestracja
        return 'Nie udało się stworzyć profilu pracownika!'
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
    const newErrors = await validation(true)
    setErrors(newErrors)
  }

  // Walidacja formularza
  const validation = async (nameExist) => {
    const { firstname, lastname, email, phone, specialization } = form
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
    if( !/^([A-ZĘÓŁŚĄŻŹĆŃ]+[a-zA-ZęółśążźćńĘÓŁŚĄŻŹĆŃ][a-zA-ZęółśążźćńĘÓŁŚĄŻŹĆŃ\'\-\s]+){1,}$/.test(lastname)){
      formValidated = false
      newErrors.lastname = 'Podano błędne nazwisko! Powinno zaczynać się z wielkiej litery i nie zawierac cyfr.'
    }
    // Nie podano nazwiska
    if ( !lastname || lastname === '' ) {
      formValidated = false
      newErrors.lastname = 'Podaj nazwisko!'
    }

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

    // Specialization errory
    // Nie podano specjalizacji
    if ( !specialization || specialization === '' ) {
      formValidated = false
      newErrors.specialization = 'Podaj specjalizację'
    }

    // Specialization errory
    // Zły format specjalizacji
    //eslint-disable-next-line
    if( !/^[\-a-zA-ZęółśążźćńĘÓŁŚĄŻŹĆŃ\s\/.]{3,}$/.test(specialization)){
      formValidated = false
      newErrors.specialization = 'Podano błędną specjalizację! Specjalizacja powinna nie zawierać cyfr oraz znaków specjalnych.'
    }

    // Phone errory
    // Jeżeli podamy numer telefonu to nalezy sprawdzić jego format
    //eslint-disable-next-line
    if((phone && phone !== '' ) && !/^(?<!\w)(\(?(\+|00)?48\)?)?[ -]?\d{3}[ -]?\d{3}[ -]?\d{3}(?!\w)$/gm.test(phone)){
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

    // Tworzenie profilu pracownika
    newErrors.register = undefined
    if(formValidated){
      const createReceive = await create()
      if(createReceive !== undefined){
        // Wystąpił błąd
        // Ustawiamy error do wyświetlenia
        newErrors.register = createReceive
      }else{
        // Nie wystąpił błąd
        // Pokazanie modal'u
        setShowModal(true)
      }
    }

    return newErrors
  }
/*
  const redirect = () => {
    if (!!props.csrftoken) {
      return <Redirect to='/' />
    }
  }
*/
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
            Utworzono profil pracownika
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{border:'none'}}>
          <p>Wysłaliśmy wiadomość z linkiem aktywacyjnym oraz automatycznie wygenerowanym hasłem na podany adres email w celu weryfikacji.</p>
        </Modal.Body>
      </Modal>
    )
  }

  return (
    <>
      { modal() }
      <Header csrftoken={props.csrftoken} userdata={ props.userdata}/>
      <div className="container h-100" style={{top: "3.5rem", minHeight: "calc(100%-3.5rem)"}}>
        <div className="row h-100 justify-content-center align-items-center">
        <Form className="col-md-6">
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
              <Form.Label>Specjalizacja</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control 
                  type='specialization' name="specialization"
                  onChange={ e => setField('specialization', e.target.value) }
                  isInvalid={ !!errors.specialization }
                />
                <Form.Control.Feedback type='invalid'>{ errors.specialization }</Form.Control.Feedback>
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
              <Button className="rounded-pill col-6" type='submit' onClick={ handleSubmit }>Stwórz pracownika</Button>
            </Form.Group>
          </Form>
        </div>
      </div>
    </>
  )
}

export default CreateEmployee;
