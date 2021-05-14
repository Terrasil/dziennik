import React, { useState } from 'react';
import  { Redirect } from 'react-router-dom'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image'
import Logo from '../../img/logo.png'
import { Alert, InputGroup, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft} from '@fortawesome/free-solid-svg-icons'
import Header from './../Header';

function SettingsChangePassword(props){

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
    const { password, repassword } = form
    const newErrors = {}

    let formValidated = true


    // Password errory
    // Nie podano hasła
    if ( !password || password === '' ) {
      formValidated = false
      newErrors.password = ['Podaj hasło!']
    }
    else{
      const passwordRegexValidations = []
      // Hasło zakrótkie (min. 8 znaków)
      if(password.length < 8) {
        passwordRegexValidations.push('Hasło musi zkładać się z 8-u znaków!')
      }
      // Brak wielkiej litery
      //eslint-disable-next-line
      if(!/\w*[A-ZĘÓŁŚĄŻŹĆŃ]\w*/g.test(password)) {
        passwordRegexValidations.push('Hasło musi zawierać przynajmniej jedną dużą literę!')
      }
      // Brak cyfry
      //eslint-disable-next-line
      if(!/\w*[0-9]\w*/g.test(password)) {
        passwordRegexValidations.push('Hasło musi zawierać przynajmniej jedną cyfrę!')
      }
      // Jeżeli cokolwiek dodano do passwordRegexValidations - ustawiamy jako error
      if(passwordRegexValidations.length > 0){
        formValidated = false
        newErrors.password = passwordRegexValidations
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
      { modal() }
      <Header csrftoken={props.csrftoken} userdata={ props.userdata}/>
      <div className="container h-100" style={{top: "3.5rem", minHeight: "calc(100%-3.5rem)"}}>
        <div className="row h-100 justify-content-center align-items-center">
          <Form className="col-md-6">
            <Form.Group>
              <Button className='w-100 text-left' onClick={()=>{window.location.href = '/settings'}}variant='light'><FontAwesomeIcon className='mr-1' icon={faChevronLeft} /> Wróć do ustawień</Button>
              <hr/>  
              <h5>Zmiana hasła</h5>
              <hr class='horizontal-rule'/> 
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
                <Form.Control.Feedback style={{color:'gray', display:'block'}}>Hasło musi składać się z 8-miu znaków i zawierac wielką literę oraz cyfrę.</Form.Control.Feedback>
                {
                  errors.password?.map((suberror,index) => (
                    <Form.Control.Feedback key={index} type='invalid'>{ suberror }</Form.Control.Feedback>
                  ))  
                }
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

export default SettingsChangePassword;