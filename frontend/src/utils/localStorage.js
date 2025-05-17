function saveToken(token){
    localStorage.setItem("token",token);
}

function getToken(){
    return localStorage.getItem("token");
}

function deleteToken(){
    localStorage.clear();
    window.location.reload();
}

export {
    saveToken,
    getToken,
    deleteToken
}