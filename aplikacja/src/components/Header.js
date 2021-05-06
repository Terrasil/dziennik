import React, { useState, useEffect } from 'react';
import  { Redirect } from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap';
import ProfileAvatar from './../img/man.svg'

function Header(props){

    const _csrftoken = localStorage.getItem('csrftoken') || undefined
    const _userdata = JSON.parse(localStorage.getItem('userdata')) ? JSON.parse(localStorage.getItem('userdata'))[0] : undefined
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
        if (_csrftoken === undefined) {
            return <Redirect to='/login' />
        }
    }

    useEffect(()=>{
        //console.log(_userdata)
    }, [])

    return (
        <>
            { redirect() }
            <Navbar collapseOnSelect expand="lg" bg="light" fixed="top" variant="light">
                <Navbar.Brand>
                    <img
                        alt="profile-avatar-man"
                        src={ProfileAvatar}
                        width="30"
                        height="30"
                        className="d-inline-block align-top bg-primary rounded-circle mr-2"
                    />
                    { _csrftoken === undefined ? 'Nie zalogowano' : _userdata ? _userdata.username : 'Brak nazwy użytkownika' }
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
        </>
    )
}

export default Header;