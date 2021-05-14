import React, { useState } from 'react';
import  { Redirect } from 'react-router-dom'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image'
import Logo from '../../img/logo.png'
import { Alert, InputGroup, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft} from '@fortawesome/free-solid-svg-icons'
import Header from '../Header';

function SettingsChangeInstitutionData(props){

  const [ form, setForm ] = useState({})
  const [ errors, setErrors ] = useState({})
  const [ showmodal, setShowModal ] = useState(false)

  const receiveNameExist = async (name) => {
    const response = await fetch('http://localhost:8000/api/institutions-exist/?name='+name, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).catch( error => console.error(error))
    const data = await response.json()
    if(!data.length){
      // Nazwa nie jest zajęta
      return false
    }else{
      // Nazwa jest zajęta
      return true
    }
  }

  const register = async () => {
    // Przygotowanie informacji o tworzonym użytkowniku
    const registerData = {}
    registerData.username = form.username
    registerData.password = form.password
    registerData.first_name = ''
    registerData.last_name = ''
    registerData.email = form.email
    registerData.phone = form.phone
    registerData.role = 'institution'
    registerData.category = form.category
    registerData.profile = form.profile
    // Wykonanie zapytania - rejestracji
    const response = await fetch('http://localhost:8000/api/institutions-register/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(registerData) // Przygotowane dane
    }).catch( error => console.error(error))
    const data = await response.json()
    if(data?.email){
      // Nieudana rejestracja
      return 'Istnieje już instytucja z podanym adresem email.'
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
    const nameIsAvaiable = await receiveNameExist(form.username)
    const newErrors = await validation(nameIsAvaiable)
    setErrors(newErrors)
  }

  // Walidacja formularza
  const validation = async (nameExist) => {
    const { username, category, profile } = form
    const newErrors = {}

    let formValidated = true

    // Username errory
    // Za krótka nazwa instytucji
    //eslint-disable-next-line
    if(username?.length < 2){
      formValidated = false
      newErrors.username = 'Podano za krótką nazwę!'
    }
    // Nie podano nazwy
    if ( !username || username === '' ) {
      formValidated = false
      newErrors.username = 'Podaj nazwę!'
    }
    

    // Category errory
    // Nie wybrano kategorii
    if ( !category || category === '' ) {
      formValidated = false
      newErrors.category = 'Wybierz kategorię!'
    }

    // Profile errory
    // Nie wybrano kategorii
    if ( !profile || profile === '' ) {
      formValidated = false
      newErrors.profile = 'Podaj profil!'
    }

    // Podano błędny profil
    if ( !/^([a-zA-ZęółśążźćńĘÓŁŚĄŻŹĆŃ\.\s]){3,}$/g.test(profile) ) {
      formValidated = false
      newErrors.profile = 'Podano błędny profil! Profil nie może zawierać cyfr oraz znaków specjalnych (wyjątek ".")'
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
      }else if(nameExist){
        // Nazwa jest już ajęta
        newErrors.register = 'Podana nazwa jest już zajęta!'
      }else{
        // Nie wystąpił błąd
        // Pokazanie modal'u
        setShowModal(true)
      }
    }

    return newErrors
  }

  const redirect = () => {
    if (!!props.userdata) {
      console.log(props.userdata?.role)
      if(props.userdata?.role !== 'institution'){
        return <Redirect to='/settings' />
      }
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
      <Header csrftoken={props.csrftoken} userdata={ props.userdata}/>
      <div className="container h-100" style={{top: "3.5rem", minHeight: "calc(100%-3.5rem)"}}>
        <div className="row h-100 justify-content-center align-items-center">
          <Form className="col-md-6">
            <Form.Group>
              <Button className='w-100 text-left' onClick={()=>{window.location.href = '/settings'}}variant='light'><FontAwesomeIcon className='mr-1' icon={faChevronLeft} /> Wróć do ustawień</Button>
              <hr/>  
              <h5>Zmiana danych instytucji</h5>
              <hr class='horizontal-rule'/>  
            </Form.Group>
            <Form.Group>
              <Form.Label>Podaj nazwę</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control 
                  type='text' name="username"
                  onChange={ e => setField('username', e.target.value) }
                  value={props.userdata?.username}
                  isInvalid={ !!errors.username }
                />
                <Form.Control.Feedback type='invalid'>{ errors.username }</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label>Kategoria</Form.Label>
              <Form.Control as="select" custom 
                  type='select' name="category"
                  onChange={ e => setField('category', e.target.value) }
                  value={props.userdata?.categoty}
                  isInvalid={ !!errors.category }
                >
                <option disabled selected hidden>Wybierz z listy...</option>
								<option value="Szkoła języków obych">Szkoła języków obych</option>
								<option value="Klub sportowy">Klub sportowy</option>
								<option value="Korepetycje">Korepetycje</option>
								<option value="Inne zajęcia pozalekcyjne">Inne zajęcia pozalekcyjne</option>
              </Form.Control>
              <Form.Control.Feedback type='invalid'>{ errors.category }</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Podaj profil</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control 
                  type='text' name="profile"
                  onChange={ e => setField('profile', e.target.value) }
                  value={props.userdata?.profile}
                  isInvalid={ !!errors.profile }
                />
                <Form.Control.Feedback style={{color:'gray', display:'block'}}>Np. języka angielski, piłka nożna, tenis...</Form.Control.Feedback>
                <Form.Control.Feedback type='invalid'>{ errors.profile }</Form.Control.Feedback>
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

export default SettingsChangeInstitutionData;