import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

function Schedule() {
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
            weeksArray[week-1].push(calendarStartDay.getDate());
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

    return (
        <>
            <Container className="flex-grow-1" style={{
                height:'100%',
                display: 'grid',
                paddingTop:'1rem',
                paddingBottom:'1rem',
                gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr',
                gridTemplateRows: '3rem 1fr 1fr 1fr 1fr 1fr 1fr '
            }} fluid>
                <div className="bg-primary text-white">Poniedziałek</div>
                <div className="bg-primary text-white">Wtorek</div>
                <div className="bg-primary text-white">Środa</div>
                <div className="bg-primary text-white">Czwartek</div>
                <div className="bg-primary text-white">Piątek</div>
                <div className="bg-primary text-white">Sobota</div>
                <div className="bg-primary text-white">Niedziela</div>
                {
                    monthdays?.map((week) => {
                        return week.map((day, index) => {
                            return(<div key={index}>{day}</div>)
                        })
                    })
                } 
            </Container>
        </>
    );
}

export default Schedule;
