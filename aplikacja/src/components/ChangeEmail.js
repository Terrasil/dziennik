import React, { useEffect, useState } from 'react';
import  {useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons'

function Activate(props){

  const { code } = useParams();

  const [activationstatus, setActivationStatus] = useState(undefined)

  const receiveUserActivation = async (code) => {
    const response = await fetch('http://localhost:8000/api/users-activation/?code='+code, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).catch( error => console.error(error))
    const data = await response.json()
    if(!data.length){
      // Nieudane otrzymanie danych o aktywowaniu użytkownika
      return false
    }else{
      // Udane otrzymanie danych o aktywowaniu użytkownika
      return data[0].is_active
    }
  }

  const activate = async () => {
    const activateResult = await receiveUserActivation(code)
    setActivationStatus(activateResult)
  }

  useEffect(()=>{
    activate()
  },[])
  
  return (
    <>
      <div className="container h-100">
        <div className="row h-100 justify-content-center align-items-center">
          <div className="col-md-6 text-center">
              { activationstatus === undefined ? 
                <>
                <FontAwesomeIcon style={{fontSize: 'min(25vw, 900%)'}} className="text-info m-5" icon={faEllipsisH} /><br/>
                <font size="5" className="text-info">Weryfikowanie kodu aktywacyjnego</font>
                </> : 
                activationstatus ? 
                  <>
                    <FontAwesomeIcon style={{fontSize: 'min(25vw, 900%)'}} className="text-success m-5" icon={faCheckCircle} /><br/>
                    <font size="5" className="text-success">Twoje konto zostało aktywowane</font>
                  </> : 
                  <>
                    <FontAwesomeIcon style={{fontSize: 'min(25vw, 900%)'}} className="text-danger m-5" icon={faTimesCircle} /><br/>
                    <font size="5" className="text-danger">Podano błędny kod aktywacyjny</font>
                  </>
              }
              <br/>
              <a className={ activationstatus===undefined ? "btn btn-secondary rounded-pill col-4 m-5" : "btn btn-primary rounded-pill col-4 m-5" } href='../' role="button" variant={ activationstatus===undefined?'dark': 'primary'} type='submit'>OK</a>
          </div>
        </div>
      </div>
    </>
  )
}

export default Activate;
