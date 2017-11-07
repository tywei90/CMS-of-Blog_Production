
function get(name){
    var cookieName = encodeURIComponent(name);
    var cookieArr = document.cookie.split(';');
    var cookieValue = null;
    for(var i=0,len=cookieArr.length; i<len; i++){
        var index = cookieArr[i].indexOf(cookieName);
        if(index != -1){
            cookieValue = decodeURIComponent(cookieArr[i].split('=')[1]);
            break
        }
    }
    return cookieValue
}
function set(name, value, expires, path, domain, secure){
    let cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value)
    if (expires instanceof Date)
        cookieText += "; expires=" + expires.toGMTString()
    if (path) cookieText += "; path=" + path
    if (domain) cookieText += "; domain=" + domain
    if (secure) cookieText += "; secure"
    document.cookie = cookieText
}

function unset(name, path, domain, secure) {
    set(name, '', new Date(0), path, domain, secure);
}

export {
    get,set,unset
}