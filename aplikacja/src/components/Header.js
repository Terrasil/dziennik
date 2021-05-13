import React, { useState, useEffect, useLayoutEffect } from 'react';
import  { Redirect } from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap';
import ProfileAvatar from './../img/man.svg'

function Header(props){

  const [redirectchcked, setRedirectChecked] = useState(false)

  var toRedirect = false

  //const [userdata, setUserData] = useState(eval(props.userdata) || [])
  // Wylogowanie użytkownika
  const logout = () =>{
    // Czyszczenie cookie
    // Usunięcie informacji o csrftokenie
    document.cookie = "csrftoken=; max-age=-1;";
    localStorage.removeItem('csrftoken');
    // Usunięcie informacji o zapamiętaniu
    document.cookie = "rememberme=; max-age=-1;";
    // Usunięcie informacji o użytkowniku
    localStorage.removeItem('userdata');
    // Upewnienie się że wszystko wyczyszczono
    localStorage.clear()
    // Odświerzenie strony
    window.location.reload()
  }

  const redirect = () => {
    if (props.csrftoken === undefined || props.userdata === undefined) {
      if(redirectchcked){
        return <Redirect to='/login' />
      }
    }
  }

  useLayoutEffect(()=>{
    setRedirectChecked(true)
  },[])

  return (
    <>
      {redirect()}
      <Navbar collapseOnSelect expand="lg" bg="light" fixed="top" variant="light">
        <Navbar.Brand
          href="/"
        >
          <img
            alt="profile-avatar-man"
            src={ProfileAvatar}
            width="30"
            height="30"
            className="d-inline-block align-top bg-primary rounded-circle mr-2"
          />
          { props.csrftoken === undefined ? 'Nie zalogowano' : props.userdata ? props.userdata.username : 'Brak nazwy użytkownika' }
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" style={{border: 'none'}}/>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto pb-3">
          </Nav>
          <Nav className="text-right">
            { props.userdata?.role === 'user' ? ( <>
              <Nav.Link className="float-right" href="/create/child">Stwórz profil dziecka</Nav.Link>
            </>) : null }
            { props.userdata?.role === 'institution' ? ( <>
              <Nav.Link className="float-right" href="/create/activity">Stwórz zajęcia</Nav.Link>
              <Nav.Link className="float-right" href="/create/employee">Stwórz profil pracownika</Nav.Link>
            </>) : null }
            { props.userdata?.role === 'emplyee' ? ( <>
            </>) : null }
            { props.userdata?.role === 'admin' ? ( <>
              <Nav.Link className="float-right" >Panel administratora</Nav.Link>
            </>) : null }
            <Nav.Link className="float-right text-danger" onClick={logout}>Wyloguj</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  )
}

export default Header;