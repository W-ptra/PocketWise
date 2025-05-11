const { validateAndDecodeToken } = require("../utils/jwt")

const publicPaths = [
    "/api/auth",
]

function authentication(request,h){
    const path = request.path;

    if(publicPaths.some(public => path.startsWith(public))){
        return h.continue;
    }

    let token = request.headers['authorization'];
    if (!token || !token.startsWith('Bearer ')) 
        return h.response({ error: "Missing authorization token" }).code(401).takeover();
    
    token = token.replace("Bearer ","");
    const user = validateAndDecodeToken(token);
    if(!user)
        return h.response({ error: "Authorization token is invalid or expired" }).code(401).takeover();
    request.user = user;

    return h.continue;
}

module.exports = {
    authentication
}