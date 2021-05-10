import React, { useState, useEffect } from 'react';
import Header from './Header';
import  { Redirect } from 'react-router-dom'
import ScheduleMonth from './ScheduleMonth';
import ScheduleWeek from './ScheduleWeek';

function Main(props){
  
  const [displaymode, setDisplayMode] = useState(props.type)

  return (
    <> 
      <Header/>
      <main className="main col-12 flex-grow-1 flex-column" style={{paddingTop:'3.5rem',paddingLeft:'0rem',paddingRight:'0rem',overflowX:'hidden'}}>
        { displaymode == 'week' ? <ScheduleWeek/> : null}
        { displaymode == 'month' ? <ScheduleMonth/> : null}
      </main>
    </>
  )
}

export default Main;