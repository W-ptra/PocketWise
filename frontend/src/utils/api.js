const API_URL = import.meta.env.VITE_APP_API_URL;

async function getRequest(endpoint=null,token=null){
    return await makeApiRequest(endpoint,"GET",token);
}

async function postRequest(endpoint=null,token=null,payload=null,isFormData=false){
    return await makeApiRequest(endpoint,"POST",token,payload,isFormData);
}

async function putRequest(endpoint=null,token=null,payload=null){
    return await makeApiRequest(endpoint,"PUT",token,payload);
}

async function deleteRequest(endpoint=null,token=null,payload=null){
    return await makeApiRequest(endpoint,"DELETE",token,payload);
}

async function makeApiRequest(endpoint=null,method=null, token=null, payload=null,isFormData=false){
    const url = `${API_URL}/${endpoint}`;
     console.log(endpoint)
      console.log(method)
    console.log(token)
    console.log(isFormData)
    let requestOption = {
        method
    }

    if(token){
        requestOption.headers = {};
        requestOption.headers["Authorization"] = `Bearer ${token}`
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
    if(!requestOption.headers)
        requestOption.headers = {}
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