import React, { useState } from 'react';
import  { Redirect } from 'react-router-dom'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image'
import { Alert, InputGroup, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import Header from './Header';

function Settings(props) {
  return (
    <>
      <Header csrftoken={props.csrftoken} userdata={ props.userdata}/>
      <div className="container h-100" style={{top: "3.5rem", minHeight: "calc(100%-3.5rem)"}}>
        <div className="row h-100 justify-content-center align-items-center">
          <div className='col-md-6'>
            <h4>USTAWIENIA</h4>
            <hr class='horizontal-rule'/>
            { props.userdata?.role === 'institution' ?
              (<>
                <Button className='w-100 text-left' onClick={()=>{window.location.href = '/settings/change/data/institution'}} variant='light'><FontAwesomeIcon className='mr-1' icon={faChevronRight} /> Zmiana danych instytucji</Button>
              </>)
            : null
            }{ props.userdata?.role === 'user' || props.userdata?.role === 'employee' ?
              (<>
                <Button className='w-100 text-left' onClick={()=>{window.location.href = '/settings/change/data/person'}} variant='light'><FontAwesomeIcon className='mr-1' icon={faChevronRight} /> Zmiana danych użytkownika</Button>
              </>)
             : null
            }
              <hr class='horizontal-rule'/>
              <Button className='w-100 text-left' onClick={()=>{window.location.href = '/settings/change/email'}} variant='light'><FontAwesomeIcon className='mr-1' icon={faChevronRight} /> Zmiana adresu email</Button>
              <hr class='horizontal-rule'/>
              <Button className='w-100 text-left' onClick={()=>{window.location.href = '/settings/change/password'}} variant='light'><FontAwesomeIcon className='mr-1' icon={faChevronRight} /> Zmiana hasła</Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Settings;
