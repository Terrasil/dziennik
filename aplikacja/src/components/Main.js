import React, { useState, useEffect } from 'react';
import Header from './Header';
import  { Redirect } from 'react-router-dom'
import ScheduleMonth from './ScheduleMonth';
import ScheduleWeek from './ScheduleWeek';
import ScheduleDay from './ScheduleDay';

function Main(props){
  
  const [displaymode, setDisplayMode] = useState(props.type)

  const changeDisplayMode = (displayMode) => {
    setDisplayMode(displayMode)
  }

  return (
    <> 
      <Header csrftoken={props.csrftoken} userdata={props.userdata}/>
      <main className="main col-12 flex-grow-1 flex-column" style={{paddingTop:'3.5rem',paddingLeft:'0rem',paddingRight:'0rem',overflowX:'hidden'}}>
        { displaymode == 'day' ? <ScheduleDay changeDisplayMode={changeDisplayMode}/> : null }
        { displaymode == 'week' ? <ScheduleWeek changeDisplayMode={changeDisplayMode}/> : null }
        { displaymode == 'month' ? <ScheduleMonth changeDisplayMode={changeDisplayMode}/> : null }
      </main>
    </>
  )
}

export default Main;