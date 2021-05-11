// Odczytywanie wartości z cookie
const getCookie = (name) => {
  var str = document.cookie
  str = str.split('; ');
  var result = {};
  for (var i = 0; i < str.length; i++) {
    var cur = str[i].split('=');
    result[cur[0]] = cur[1];
  }
  return result[name] ? result[name] : ''
}

// Podanie nazwy miesiąca
function getMonthName(){
  const monthNumber = new Date().getMonth()
  const monthNames = ['Styczeń','Luty','Marzec','Kiwiecień','Maj','Czerwiec','Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień']
  return monthNames[monthNumber] || 'Błędny miesiąć'
}

// Podanie nazwy dnia tygodnia zaleznie od szerokości okna
function getWeekDayName(width,dayNumber){
  const daysNames = ['Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota','Niedziela']
  const daysNamesShort = ['Pn','Wt','Śr','Cz','Pt','Sb','Nd']
  return width >= 768 ? daysNames[dayNumber] : daysNamesShort[dayNumber]
}

// Zwracanie wartości rem w pixelach
function convertRemToPixels(rem) {    
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export { 
    getCookie,
    getMonthName,
    getWeekDayName,
    convertRemToPixels
}