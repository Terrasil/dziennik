import React, { useEffect, useState, useLayoutEffect  } from 'react';
import  { Redirect } from 'react-router-dom'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image'
import { Alert, InputGroup, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faUniversity } from '@fortawesome/free-solid-svg-icons'
import Header from '../Header';

function CreateActivity(props) {
  const [ form, setForm ] = useState({})
  const [ errors, setErrors ] = useState({})
  const [ showmodal, setShowModal ] = useState(false)
    
  const [csrftoken, setCSRFToken] = useState(props.csrftoken);
  const [userdata, setUserData] = useState(props.userdata);
  

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
    const { activityname, date, starttime, endtime, periodicity, employee, child} = form
    const newErrors = {}

    let formValidated = true

    // Activityname errory
    // Zły format activityname
    //eslint-disable-next-line
    if( !/^[A-ZĘÓŁŚĄŻŹĆŃ]+[a-zA-ZęółśążźćńĘÓŁŚĄŻŹĆŃ]{3,}$/.test(activityname)){
      formValidated = false
      newErrors.activityname = 'Podano błędną nazwę! Nazwa powinna zaczynać się z wielkiej litery i nie zawierać cyfr.'
    }
    // Nie podano activityname
    if ( !activityname || activityname === '' ) {
      formValidated = false
      newErrors.activityname = 'Podaj nazwę!'
    }
    
    // Date errory
    // Zły format daty
    //eslint-disable-next-line
    if( !/^(?:20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))$/.test(date)){
        formValidated = false
        newErrors.date = 'Podano błędną datę! Data musi być podana w formacie RRRR-MM-DD.'
      }
      // Nie podano daty
      if ( !date || date === '' ) {
        formValidated = false
        newErrors.date = 'Podaj datę!'
      }

      var tempdate = new Date()
      var today = new Date(tempdate.getFullYear(),tempdate.getMonth(),tempdate.getDate())

      // Sprawdzanie daty
      // Data wcześniejsza
      if(Date.parse(date) < Date.parse(today)){
        formValidated = false
        newErrors.date = 'Podano błędną datę! Data musi być conajmniej dzisiejsza.'
      }

    // Starttime errory
    // Zły format godziny
    //eslint-disable-next-line
    if( !/^(?:0[1-9]|1[0-9]|2[0-4]):(?:[0-5])[0-9]$/.test(starttime)){
        formValidated = false
        newErrors.starttime = 'Podano błędną godzinę rozpoczęcia! Godzina musi być podana w formacie HH:MM.'
      }
      // Nie podano godziny rozpoczecia
      if ( !starttime || starttime === '' ) {
        formValidated = false
        newErrors.starttime = 'Podaj godzinę rozpoczęcia!'
      }

    // Endtime errory
    // Zły format godziny
    //eslint-disable-next-line
    if( !/^(?:0[1-9]|1[0-9]|2[0-4]):(?:[0-5])[0-9]$/.test(endtime)){
        formValidated = false
        newErrors.endtime = 'Podano błędną godzinę zakończenia! Godzina musi być podana w formacie HH:MM.'
      }
      // Nie podano godziny zakończenia
      if ( !endtime || endtime === '' ) {
        formValidated = false
        newErrors.endtime = 'Podaj godzinę zakończenia!'
      }
    // godzina zakończenia wcześniejsza niż godzina rozpoczęcia
    if ( starttime > endtime ) {
        formValidated = false
        newErrors.endtime = 'Podano błędną godzinę zakończenia! Godzina musi być późniejsza od godziny rozpoczęcia.'
        }

    // Periodicity errory
    // Nie podano cykliczności
    if ( !periodicity || periodicity === '' ) {
      formValidated = false
      newErrors.periodicity = 'Podaj cykliczność!'
    }

    // Employee errory
    // Nie podano cykliczności
    if ( !employee || employee === '' ) {
        formValidated = false
        newErrors.employee = 'Wybierz pracownika!'
      }

    // Child errory
    // Nie podano cykliczności
    if ( !child || child === '' ) {
        formValidated = false
        newErrors.child = 'Wybierz uczestników zajęć!'
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
  
  const redirect = () => {
    if (!!props.userdata) {
      console.log(props.userdata?.role)
      if(props.userdata?.role !== 'institution'){
        return <Redirect to='/settings' />
      }
    }
  }
  
  return (
    <>
      { redirect() }
      { modal() }
      <Header csrftoken={props.csrftoken} userdata={props.userdata}/>
      <div className="container h-100" style={{top: "3.5rem", minHeight: "calc(100%-3.5rem)"}}>
        <div className="row h-100 justify-content-center align-items-center">
          <Form className="col-md-6">
            <Form.Group>
              <h5>TWORZENIE ZAJĘĆ</h5>
              <hr class='horizontal-rule'/>  
            </Form.Group>
            <Form.Group>
              <Form.Label>Podaj nazwę zajęć</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control 
                  type='text' name="activityname"
                  onChange={ e => setField('activityname', e.target.value) }
                  isInvalid={ !!errors.activityname }
                />
                <Form.Control.Feedback type='invalid'>{ errors.activityname }</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label>Podaj datę zajęć</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control 
                  type='text' name="date"
                  onChange={ e => setField('date', e.target.value) }
                  isInvalid={ !!errors.date }
                />
                <Form.Control.Feedback type='invalid'>{ errors.date }</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label>Podaj godzinę rozpoczęcia zajęć </Form.Label>
              <InputGroup className="mb-3">
                <Form.Control 
                  type='text' name="starttime"
                  onChange={ e => setField('starttime', e.target.value) }
                  isInvalid={ !!errors.starttime }
                />
                <Form.Control.Feedback type='invalid'>{ errors.starttime }</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label>Podaj godzinę zakończenia zajęć </Form.Label>
              <InputGroup className="mb-3">
                <Form.Control 
                  type='text' name="endtime"
                  onChange={ e => setField('endtime', e.target.value) }
                  isInvalid={ !!errors.endtime }
                />
                <Form.Control.Feedback type='invalid'>{ errors.endtime }</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label>Podaj cykliczność zajęć</Form.Label>
              <Form.Control as="select" custom 
                  type='select' name="periodicity"
                  onChange={ e => setField('periodicity', e.target.value) }
                  isInvalid={ !!errors.periodicity }
                >
                <option disabled selected hidden>Wybierz z listy...</option>
                <option value="Brak">Brak</option>
                <option value="Codziennie">Codziennie</option>
                <option value="Co tydzień">Co tydzień</option>
                <option value="Co dwa tygodnie">Co dwa tygodnie</option>
                <option value="Co miesiąc">Co miesiąc</option>
              </Form.Control>
              <Form.Control.Feedback type='invalid'>{ errors.periodicity }</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Wybierz pracownika</Form.Label>
              <Form.Control as="select" custom 
                  type='select' name="employee"
                  onChange={ e => setField('employee', e.target.value) }
                  isInvalid={ !!errors.employee }
                >
                <option disabled selected hidden>Wybierz z listy...</option>
                <option value="Brak">Brak</option>
                <option value="Codziennie">Codziennie</option>
                <option value="Co tydzień">Co tydzień</option>
                <option value="Co dwa tygodnie">Co dwa tygodnie</option>
                <option value="Co miesiąc">Co miesiąc</option>
              </Form.Control>
              <Form.Control.Feedback type='invalid'>{ errors.employee }</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Wybierz uczestników</Form.Label>
              <Form.Control as="select" custom 
                  type='tel' name="child"
                  onChange={ e => setField('child', e.target.value) }
                  isInvalid={ !!errors.child }
                >
                <option disabled selected hidden>Wybierz z listy...</option>
                <option value="Brak">Brak</option>
                <option value="Codziennie">Codziennie</option>
                <option value="Co tydzień">Co tydzień</option>
                <option value="Co dwa tygodnie">Co dwa tygodnie</option>
                <option value="Co miesiąc">Co miesiąc</option>
              </Form.Control>
              <Form.Control.Feedback type='invalid'>{ errors.child }</Form.Control.Feedback>
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

export default CreateActivity;
