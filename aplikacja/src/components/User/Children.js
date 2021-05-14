import React, { useState, useEffect,useLayoutEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faEdit, faPaperPlane, faPlus, faSearch, faTrash, faUniversity} from '@fortawesome/free-solid-svg-icons'
import Header from './../Header';
import { Button, Form, InputGroup, Modal } from 'react-bootstrap';

function Children(props){
  
  const [maxChildInLine, setMaxChildInLine] = useState(3)
  const [childrenupdated, setChildrenUpdated] = useState(false)
  const [children, setChildren] = useState([])
  const [choosenchild, setChoosenChild] = useState(undefined)
  const [chooseninstitution, setChoosenInstitution] = useState(undefined)
  const [displayChildren, setDiplayChildren] = useState([])
  const [showmodal, setShowModal ] = useState(false)
  const [action, setAction ] = useState(undefined)
  const [search, setSearch ] = useState(undefined)

  const receiveChildren = async () => {
    // Wykonanie zapytania - pobieranie informacji o dzieciach / podopiecznych
    const response = await fetch('http://localhost:8000/api/users-children/?parent='+props.userdata.id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${props.csrftoken}` // Musimy podać nasz CSRFToken aby otrzymać odpowiedź
      }
    }).catch( error => console.error(error))
    const data = await response.json()
    return data || null
  }

  const deleteChild = async (child_id) => {
    // Wykonanie zapytania - pobieranie informacji o dzieciach / podopiecznych
    const response = await fetch('http://localhost:8000/api/users-delete-child/?child='+child_id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${props.csrftoken}` // Musimy podać nasz CSRFToken aby otrzymać odpowiedź
      }
    }).catch( error => console.error(error))
    const data = await response.json()
    return data || null
  }


  const prepareChildren = () => {
    var _children = children
    if(_children.length % maxChildInLine){
      var numberChildrenToAdd = (maxChildInLine - (_children.length % maxChildInLine)) 
      for(var x = 0; x < numberChildrenToAdd;x++){
        _children.push(undefined)
      }
    }
    var newChildrenList = _children
    .reduce((groups, curr) => {
      const arr = groups[groups.length - 1];
      arr.push(curr);
      if (arr.length === maxChildInLine) groups.push([]);
      return groups;
    }, [[]])
    .filter((chunk) => chunk.length)

    return newChildrenList
  }

  const updateChildrenList = async () => {
    if(!childrenupdated){
      if(props.userdata?.id){
        setChildren(await receiveChildren())
        setDiplayChildren(prepareChildren())
        setChildrenUpdated(true)
      }
    }
  }

  updateChildrenList()

  // Usuwanie dziecka

  const deleteMethod = async (child_id) => {
    const result = await deleteChild(child_id)
    setChildren(await receiveChildren())
    setAction('deleted')
  }

  const deleteChildModal = () => {
    return (
      <>
        <Modal.Header style={{border:'none'}} closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
              Czy chcesz usunąć dziecko?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{border:'none'}}>
          <h4 className='text-center text-bold'>{choosenchild[1]} {choosenchild[2]}</h4>
        </Modal.Body>
        <Modal.Footer style={{border:'none'}}>
          <Button onClick={()=>{deleteMethod(choosenchild[0])}}className="rounded-pill btn-danger"><FontAwesomeIcon className='mr-1' icon={faTrash} /> Usuń profil dziecka</Button>
        </Modal.Footer>
      </>
    )
  }

  // Po usunięciu
  const deletedChildModal = () => {
    return (
      <>
        <Modal.Header style={{border:'none'}} closeButton onHide={()=>{window.location.reload()}}>
          <Modal.Title id="contained-modal-title-vcenter">
            Usunięto profil dziecka
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{border:'none'}}>
          <h4 className='text-center text-bold'>{choosenchild[1]} {choosenchild[2]}</h4>
        </Modal.Body>
        <Modal.Footer style={{border:'none'}}>
          
        </Modal.Footer>
      </>
    )
  }

  // Przypisanie dziecka
  
  const [institutions, setInstitutions] = useState([])
  const [institutionsupdated, setInstitutionsUpdated] = useState(false)

  const institutionList = async () => {
    // Wykonanie zapytania - pobieranie informacji o dzieciach / podopiecznych
    const response = await fetch('http://localhost:8000/api/institutions/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${props.csrftoken}` // Musimy podać nasz CSRFToken aby otrzymać odpowiedź
      }
    }).catch( error => console.error(error))
    const data = await response.json()
    if(data.detail){
      return []
    }else{
      return data 
    }
  }
  const updateInstitutionList = async () => {
    if(!institutionsupdated){
      let receivedInstitutions = await institutionList()
      setInstitutions(Object.values(receivedInstitutions))
      setInstitutionsUpdated(true)
    }
  }
  updateInstitutionList()

  const createAssignment = async (child_id, institution_id) => {
    // Przygotowanie informacji o tworzonym użytkowniku
    const registerData = {}
    registerData.child_id = child_id[0]
    registerData.institution_id = institution_id.id
    // Wykonanie zapytania - rejestracji
    const response = await fetch('http://localhost:8000/api/institutions-assign-child/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${props.csrftoken}` // Musimy podać nasz CSRFToken aby otrzymać odpowiedź
      },
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

  // Zmiana widoku w modalu
  const toAssigementMethod = (child_id, institution_id) => {
    setChoosenInstitution(institution_id)
    setAction('assign-create')
  }

  // Stworzenie przypisanie w bazie
  const assignMethod = async (child_id, institution_id) => {
    const result = await createAssignment(child_id, institution_id)
  }

  // Modal to potwierdzenia wyboru i wykonania zapytania
  const createAssigmentModal = () => {
    return (
      <>
        <Modal.Header style={{border:'none'}} closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Wysyłanie zgłoszenia
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{border:'none'}}>
          Zgłoszenie <b>{choosenchild[1]} {choosenchild[2]}</b> do instytucji <b>{chooseninstitution.name}</b>
        </Modal.Body>
        <Modal.Body className='text-left' style={{border:'none'}}>
          <Button type="button" className="m-1 btn btn-primaty float-left" onClick={()=>{setAction('assign')}}><FontAwesomeIcon className='mr-1' icon={faChevronLeft} /> Wróć</Button>
          <Button type="button" className="m-1 btn btn-primaty float-right" onClick={()=>{setAction('assign-created')}}>Wyślij <FontAwesomeIcon className='mr-1' icon={faPaperPlane} /></Button>
        </Modal.Body>
      </>
    )
  }
  const createdAssigmentModal = () => {
    { assignMethod(choosenchild,chooseninstitution) }
    return (
      <>
        <Modal.Header style={{border:'none'}} closeButton onHide={()=>{window.location.reload() }}>
          <Modal.Title id="contained-modal-title-vcenter">
              Wysyłanie zgłoszenia
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{border:'none'}}>
          Zgłoszenie zostało wysłane!
        </Modal.Body>
        <Modal.Body className='text-left' style={{border:'none'}}>
        </Modal.Body>
      </>
    )
  }

  const assignChildModal = () => {
    return (
      <>
        <Modal.Header style={{border:'none'}} closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
              Lista dostępnych instytucji
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{border:'none'}}>
          <h6 className='text-center text-bold'>dla</h6><h4 className='text-center text-bold'> {choosenchild[1]} {choosenchild[2]}</h4>
          <div className="row mt-5 p-1">
            <div className="col-md-12 mx-auto">
                Wyszukaj instytucji:
                <div className="input-group shadow">
                  <Form.Control 
                    type='text' className="username"
                    onChange={ e => setSearch(e.target.value) }
                  />
                </div>
            </div>
          </div>
          <div style={{width:'calc(100% + 1rem)',maxHeight:'20rem',minHeight:'20rem', overflowY: 'scroll',marginRight:'-1rem'}}>
            {institutions?.map((institution) => {
              if(search !== undefined && search !== ''){
                if((institution.name).toLowerCase().includes(search.toLowerCase())){
                  return (<Button className="m-1 text-left" onClick={()=>{toAssigementMethod(choosenchild,institution)}} style={{width:'calc(100% - 1rem)'}}><FontAwesomeIcon className='mr-1' icon={faUniversity} /> {institution.name}</Button>)
                } 
              }else{
                return (<Button className="m-1 text-left" onClick={()=>{toAssigementMethod(choosenchild,institution)}} style={{width:'calc(100% - 1rem)'}}><FontAwesomeIcon className='mr-1' icon={faUniversity} /> {institution.name}</Button>)
              }
            })}
          </div>
        </Modal.Body>
      </>
    )
  }

  // Zmiana danych dziecka

  const [ form, setForm ] = useState({})
  const [ errors, setErrors ] = useState({})

  // Pobieranie informacji z formularza edycji profilu dziecka
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
  
  // Aktualizacja danych dziecka
  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = await validation(true)
    setErrors(newErrors)
  }

  const changeChildDataDefauld = (child) => {
    console.log(child)
    // Wartości domyślne
    var defaultValues = {}
    if(form.firstname === undefined){
      defaultValues.firstname = child.first_name
    }else{
      defaultValues.firstname = form.firstname
    }
    if(form.lastname === undefined){
      defaultValues.lastname = child.last_name
    }else{
      defaultValues.lastname = form.lastname
    }
    if(form.age === undefined){
      defaultValues.age = child.age
    }else{
      defaultValues.age = form.age
    }
    setForm(defaultValues)
    console.log(defaultValues)
  }


  const updateChildData = async () => {
    // Przygotowanie informacji o tworzonym użytkowniku
    const registerData = {}
    registerData.first_name = form.firstname
    registerData.last_name = form.lastname
    registerData.age = form.age
    registerData.child_id = choosenchild[0]
    console.log(registerData)
    // Wykonanie zapytania - rejestracji
    const response = await fetch('http://localhost:8000/api/users-update-child/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${props.csrftoken}` // Musimy podać nasz CSRFToken aby otrzymać odpowiedź
      },
      body: JSON.stringify(registerData) // Przygotowane dane
    }).catch( error => console.error(error))
    const data = await response.json()
    if(data.child_id){
      // Udana rejestracja
      return true
    }else{
      // Nieudana rejestracja
      return false
    }
  }

  // Walidacja formularza zmiany danych dziecka
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
    if( !/^([A-ZĘÓŁŚĄŻŹĆŃ]+[a-zA-ZęółśążźćńĘÓŁŚĄŻŹĆŃ][a-zA-ZęółśążźćńĘÓŁŚĄŻŹĆŃ\'\-\s]+){1,}$/.test(lastname)){
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

    if(formValidated){
      const result = await updateChildData()
      if(result){
        setAction('updated')
      }
    }

    return newErrors
  }

  const childUpdateModal = () => {
    return (
      <>
        <Modal.Header style={{border:'none'}} closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
              Zmiana danych dziecka
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{border:'none'}}>
        <Form className="col-md-12">
            <Form.Group>
              <h5>{choosenchild[1]} {choosenchild[2]}</h5>
              <hr className='horizontal-rule'/>  
            </Form.Group>
            <Form.Group>
              <Form.Label>Podaj imię dziecka</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control 
                  type='text' name="firstname"
                  onChange={ e => setField('firstname', e.target.value) }
                  defaultValue={choosenchild[1]}
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
                  defaultValue={choosenchild[2]}
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
                  defaultValue={choosenchild[3]}
                  isInvalid={ !!errors.age }
                />
                <Form.Control.Feedback type='invalid'>{ errors.age }</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Body className='text-left' style={{border:'none'}}>
          <Button className="rounded-pill col-6" type='submit' onClick={ handleSubmit }>Stwórz profil dziecka</Button>
        </Modal.Body>
      </>
    )
  }
  const childUpdatedModal = () => {
    return (
      <>
        <Modal.Header style={{border:'none'}} closeButton onHide={()=>{window.location.reload() }}>
          <Modal.Title id="contained-modal-title-vcenter">
            Zmiana danych dziecka
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{border:'none'}}>
          Dane zostały zmienione:
        </Modal.Body>
        <Modal.Body className='text-left' style={{border:'none'}}>
        </Modal.Body>
      </>
    )
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
        {action === 'delete' ? 
          deleteChildModal()
        : null}
        {action === 'deleted' ? 
          deletedChildModal()
        : null}
        {action === 'assign' ? 
          assignChildModal()
        : null}
        {action === 'assign-create' ? 
          createAssigmentModal()
        : null}
        {action === 'assign-created' ? 
          createdAssigmentModal()
        : null}
        {action === 'update' ? 
          childUpdateModal()
        : null}
        {action === 'updated' ? 
          childUpdatedModal()
        : null}
      </Modal>
    )
  }

  const click = (action, child) => {
    changeChildDataDefauld(child)
    setShowModal(true)
    setAction(action)
    setChoosenChild(Object.values(child))
  }

  return (
    <> 
      { modal() }
      <Header csrftoken={props.csrftoken} userdata={props.userdata}/>
      <main className="main col-12 flex-grow-1 flex-column" style={{paddingTop:'3.5rem',paddingLeft:'0rem',paddingRight:'0rem',overflowX:'hidden'}}>
        <div className="px-5 pt-5">
        {displayChildren?.map((group, i) => (
        <div className='card-deck' key={i}>
          {group?.map((child, i) => (
            <div className="card mb-4" style={child === undefined ? {visibility:'hidden'}:{}}>
              {child !== undefined ? <>
                <h5 className="card-header">{child.first_name} {child.last_name} <small>{child.age}</small></h5>
                <div className="card-body">
                  {Object.values(JSON.parse((child.assigments).replaceAll("'",'"'))).length ? null : 'Dziecko nie jest przypisane do żadnej instytucji'}
                  {Object.values(JSON.parse((child.assigments).replaceAll("'",'"'))).map((institution, i) => (
                    <button type="button" className="btn w-100 btn-light m-1 text-left">{institution.name} {institution.status === 'Pending' ? <i style={{fontSize:'0.9rem',color:'silver'}}>(Oczekuje na zaakceptowanie)</i>:  null}</button>
                  ))}
                </div>
                <div className="card-deck px-3">
                  <button type="button" onClick={()=>{click('update',child)}} className="btn btn-primary col-xl-4" style={{border:'0.5rem solid var(--light)',borderRadius:'1rem',boxShadow: 'inset 0 -1px 0 var(--light)'}}><FontAwesomeIcon className='mr-1' icon={faEdit} /> Edytuj</button>
                  <button type="button" onClick={()=>{click('assign',child)}} className="btn btn-primary col-xl-4" style={{border:'0.5rem solid var(--light)',borderRadius:'1rem',boxShadow: 'inset 0 -1px 0 var(--light)'}}><FontAwesomeIcon className='mr-1' icon={faPlus} /> Przypisz</button>
                  <button type="button" onClick={()=>{click('delete',child)}} className="btn btn-danger col-xl-4 float-right" style={{border:'0.5rem solid var(--light)',borderRadius:'1rem',boxShadow: 'inset 0 -1px 0 var(--light)'}}><FontAwesomeIcon className='mr-1' icon={faTrash} /> Usuń</button>
                </div>
              </> : null}
           </div>
          ))}
        </div>
      ))}
        </div>
      </main>
    </>
  )
}

export default Children;