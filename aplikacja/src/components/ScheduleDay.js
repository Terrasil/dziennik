import React, { SyntheticEvent ,useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useGlobalEvent } from "beautiful-react-hooks";
import { getMonthName, getWeekDayName } from "../functions"

function ScheduleDay() {

  const prepareCalendar = () => {
    // Dzisiejsza data
    let today = new Date() 
    // Pobieramy pierwszy dzień miesiaca
    let monthStart = new Date(today.getFullYear(), today.getMonth())
    // Pobieramy index pierwszego dnia miesiąca (odejmujemy 1 aby zaczynac od poniedziałku)
    let monthStartDayIndex = monthStart.getDay() - 1
    // will fill with sub arrays for each week
    let weeksArray = []
    let week = 1


    // Ustawiamy datę rozpoczęcia miesiąca
    var calendarStartDay = new Date(monthStart);
    // Ustawiamy datę na niezielę tygodnia poprzedzającego ten w którym jest dzień rozpoczynający nasz miesiąc
    calendarStartDay.setDate(monthStart.getDate() - monthStartDayIndex)

    // Budujemy tablicę tygodni a w nich numery dni miesiąca
    var dayCount = 0
    while (week < 7) {
      if(dayCount==0){
        weeksArray.push([])
      }
      weeksArray[week-1].push({number: calendarStartDay.getDate(), month: calendarStartDay.getMonth(),day: dayCount});
      dayCount++;
      calendarStartDay.setDate(calendarStartDay.getDate() + 1);
      if (dayCount == 7) {
        week++;
        dayCount = 0
      }
    }

    // Zwracamy przygotowaną tablicę
    return weeksArray
  }

  const [monthdays, setMonthDays] = useState(prepareCalendar())
  const [windowsize, setWindowSize] = useState({width:window.innerWidth, height:window.innerHeight})
  const onWindowResize = useGlobalEvent("resize")

  function Day(date, activities){
    let today = new Date() 
    // Ustawienie dzi poza zakresem berzącego miesiąca na półprzezroczyste
    let opacity = today.getMonth() == date.date.month ? 1 : 0.5
    return (
      <div style={{opacity:opacity}}>
        <div onClick={()=>{console.log('test1')}} className="rounded my-1 p-2 bg-primary text-white"><b>Test</b><br/><i>Imie nazwisko</i><br/><i>Imie nazwisko</i><br/><font size='2'>OD</font> 10:00 <font size='2'>DO</font> 12:00</div>
        <div onClick={()=>{console.log('test2')}} className="rounded my-1 p-2 bg-primary text-white"><b>Test</b><br/><i>Imie nazwisko</i><br/><i>Imie nazwisko</i><br/><font size='2'>OD</font> 10:00 <font size='2'>DO</font> 12:00</div>
        <div onClick={()=>{console.log('test3')}} className="rounded my-1 p-2 bg-primary text-white"><b>Test</b><br/><i>Imie nazwisko</i><br/><i>Imie nazwisko</i><br/><font size='2'>OD</font> 10:00 <font size='2'>DO</font> 12:00</div>
      </div>
    )
  } 
  function getWeekDayNameAndNumber(dayNumber){
    const daysNames = ['Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota','Niedziela']
    const daysNamesShort = ['Pn','Wt','Śr','Cz','Pt','Sb','Nd']
    return <>{monthdays[((0 | new Date().getDate() / 7)+1)][dayNumber].number} <font size="2">{(windowsize.width >= 872 ? daysNames[dayNumber] : daysNamesShort[dayNumber])}</font></>
  }

  function ScheduleMenu(){
    return(
      <div id='scheduleMenu' className="position-fixed w-100" style={{zIndex:'1001'}}>
        <div className="bg-primary text-white text-center row" style={{height:'6rem'}}><span className="col my-auto">{getMonthName()} {new Date().getFullYear()}<br/>{new Date().getDate()}</span></div>
      </div>
    )
  }

  // SyntheticEvent - ma TypeScryptową składnie ale jest tłumaczony na JavaScript
  onWindowResize((event: SyntheticEvent) => {
    setWindowSize({width:window.innerWidth, height:window.innerHeight})
  })


  /*

        <div className="bg-dark w-100 mx-auto text-white text-center row"><span className="col my-auto">Poniedziałek</span></div>
        <div className="bg-dark w-100 mx-auto text-white text-center row"><span className="col my-auto">Wtorek</span></div>
        <div className="bg-dark w-100 mx-auto text-white text-center row"><span className="col my-auto">Środa</span></div>
        <div className="bg-dark w-100 mx-auto text-white text-center row"><span className="col my-auto">Czwartek</span></div>
        <div className="bg-dark w-100 mx-auto text-white text-center row"><span className="col my-auto">Piątek</span></div>
        <div className="bg-danger w-100 mx-auto text-white text-center row"><span className="col my-auto">Sobota</span></div>
        <div className="bg-danger w-100 mx-auto text-white text-center row"><span className="col my-auto">Niedziela</span></div>
  */
  return (
    <>
      <ScheduleMenu/>
      <div className="bg-primary text-white text-center row" style={{height:'6rem'}}></div>
      <Container style={{
        minHeight:'calc(100% - 3rem)',
        minWidth:'100%',
        display: 'grid',
        padding:0,
        gridTemplateColumns: '1fr',
        gridTemplateRows: '1fr'
      }} fluid>
        <div style={{border:'1px solid #eee',padding:'0.25rem'}}><Day date={new Date().getDate()}/></div>
      </Container>
    </>
  );
}

export default ScheduleDay;
