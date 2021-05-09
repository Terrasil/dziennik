import React, { useState, useEffect } from 'react';
import Header from './Header';
import  { Redirect } from 'react-router-dom'
import Schedule from './Schedule';

function Main(props){
  
  // Odsyła do logowania jeżeli nie jest ustawiony csrftoken

  return (
    <> 
      <Header/>
      <main className="main col-12 flex-grow-1 flex-column" style={{paddingTop:'3.5rem',paddingLeft:'0rem',paddingRight:'0rem',overflowX:'hidden'}}>
        <Schedule/>
      </main>
    </>
  )
}

export default Main;