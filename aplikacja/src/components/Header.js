import React from 'react';
import  { Redirect } from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap';
import ProfileAvatar from './../img/man.svg'

const Header = (props) => {

    // Wylogowanie użytkownika
    const logout = () =>{
        // Czyszczenie cookie
        // Usunięcie informacji o csrftokenie
        document.cookie = "csrftoken=; max-age=-1;";
        // Usunięcie informacji o sessionid
        document.cookie = "sessionid=; max-age=-1;";
        // Odświerzenie strony
        document.location.reload(true)
    }

    return (
        <Navbar collapseOnSelect expand="lg" bg="light" fixed="top" variant="light">
            <Navbar.Brand href="#home">
                <img
                    alt="profile-avatar-man"
                    src={ProfileAvatar}
                    width="30"
                    height="30"
                    className="d-inline-block align-top bg-primary rounded-circle mr-2"
                />
                { props.csrftoken === '' ? 'Nie zalogowano' : props.userdata ? props.userdata.username : 'Brk nazwy użytkownika' }
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" style={{border: 'none'}}/>
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto pb-3">
                </Nav>
                <Nav className="text-right">
                    <Nav.Link className="float-right text-danger" onClick={logout}>Wyloguj</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default Header;