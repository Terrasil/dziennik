import React, { useState } from 'react';
import  { Redirect } from 'react-router-dom'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image'
import Logo from '../../img/logo.png'
import { Alert, InputGroup, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faUniversity } from '@fortawesome/free-solid-svg-icons'

function RegisterInstitution(props){

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
    const { username, email, password, repassword, phone, category, profile } = form
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

    // Phone errory
    // Jeżeli podamy numer telefonu to nalezy sprawdzić jego format
    //eslint-disable-next-line
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
                <div className="col" style={{paddingTop:'1rem', paddingBottom:'1rem',borderBottom:'0.5rem solid transparent'}}>
                  <a href="../register/person" id="signup"><FontAwesomeIcon style={{fontSize: 'min(25vw, 900%)'}} color="silver" icon={faUser} /></a>
                </div>
                <div className="col" style={{paddingTop:'1rem', paddingBottom:'1rem',borderBottom:'0.5rem solid dodgerblue'}}>
                  <FontAwesomeIcon style={{fontSize: 'min(25vw, 900%)'}} color="dodgerblue" icon={faUniversity} />
                </div>
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label>Podaj nazwę</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control 
                  type='text' name="username"
                  onChange={ e => setField('username', e.target.value) }
                  isInvalid={ !!errors.username }
                />
                <Form.Control.Feedback type='invalid'>{ errors.username }</Form.Control.Feedback>
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
              <Form.Label>Kategoria</Form.Label>
              <Form.Control as="select" custom 
                  type='select' name="category"
                  onChange={ e => setField('category', e.target.value) }
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

export default RegisterInstitution;