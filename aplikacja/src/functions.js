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

export { getCookie }