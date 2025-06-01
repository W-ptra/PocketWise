import { useEffect } from "react";
import { saveToken } from "../utils/localStorage";

function HandleGoogleOauthCallback(){

  useEffect(() => {

    const queryString = window.location.search;
    
    const params = new URLSearchParams(queryString);
    const token = params.get('token');

    saveToken(token);

    console.log(token);
    window.location.href = "/dashboard";
  }, []);

    return (
        <div>You will be redirect to dashboard in a momment</div>
    )
}

export default HandleGoogleOauthCallback;