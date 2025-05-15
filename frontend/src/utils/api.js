const API_URL = import.meta.env.VITE_APP_API_URL;

async function getRequest(endpoint,token){
    return await makeApiRequest(endpoint,"GET",token);
}

async function postRequest(endpoint,token,payload,isFormData){
    return await makeApiRequest(endpoint,"POST",token,payload,isFormData);
}

async function putRequest(endpoint,token,payload){
    return await makeApiRequest(endpoint,"PUT",token,payload);
}

async function deleteRequest(endpoint,token,payload){
    return await makeApiRequest(endpoint,"DELETE",token,payload);
}

async function makeApiRequest(endpoint,method, token=null, payload=null,isFormData=false){
    const url = `${API_URL}/${endpoint}`;
    
    const headers = {
        "Content-Type": "application/json",
    }

    if(token)
        headers["Authorization"] = `Bearer ${token}`

    let requestOption = {
        method,
        headers,
    }

    if(payload)
        requestOption = setRequestBody(requestOption,payload,isFormData)

    try{

        const request = await fetch(url,requestOption);
        return await request.json();
    } 
    catch(err){

        return {
            error: true,
            message: err.message || "Network error",
        };
    }
}

function setRequestBody(requestOption,payload,isFormData=false){
    if(isFormData){
        requestOption.body = payload;
        return requestOption
    }
        
    requestOption.headers["Content-Type"] = "application/json";
    requestOption.body = JSON.stringify(payload);
    return requestOption;
}

export {
    getRequest,
    postRequest,
    putRequest,
    deleteRequest
}