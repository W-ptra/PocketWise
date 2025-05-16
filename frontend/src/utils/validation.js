import { getToken } from "./localStorage";

function isInputsInvalid(...inputs) {
  return inputs.some(input => {
    return input === null || input === undefined || input.toString().trim() === "";
  });
}

function isPasswordAndConfirmPasswordNotMatch(
  password,confirmPassword
){
    return password !== confirmPassword
}

function redirectIfLogin(){
  const token = getToken();

  if(token === null || token === undefined || token === "" || token.length === 0){
    window.location.href = "/login";
    return;
  }
}

function redirectIfLogout(){
  const token = getToken();

  if(token){
    window.location.href = "/dashboard";
    return;
  }
}

export {
  isPasswordAndConfirmPasswordNotMatch,
  isInputsInvalid,
  redirectIfLogin,
  redirectIfLogout
}