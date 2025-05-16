function saveToken(token){
    localStorage.setItem("token",token);
}

function getToken(){
    return localStorage.getItem("token");
}

export {
    saveToken,
    getToken
}