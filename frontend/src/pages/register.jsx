import { isInputsInvalid,isPasswordAndConfirmPasswordNotMatch, redirectIfLogout } from "../utils/validation";
import { useState,useEffect } from "react";
import { postRequest } from "../utils/api";

const googleOauthRedirectLink = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${
  import.meta.env.VITE_APP_GOOGLE_OAUTH_CLIENT_ID
}&redirect_uri=${encodeURIComponent(
  "http://localhost:3000/api/auth/google/callback"
)}&response_type=code&scope=openid%20email%20profile&access_type=offline&prompt=select_account`;

function Register(){
    const [ name,setName ] = useState("");
    const [ email,setEmail ] = useState("");
    const [ password,setPassword ] = useState("");
    const [ confirmPassword,setConfirmPassword ] = useState("");
    const [ isSubmit,setIsSubmit ] = useState(false);

    redirectIfLogout();

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleIsSubmitChange = () => {
        setIsSubmit((isSubmit) => !isSubmit);
    };

    useEffect(() => {
        const button = document.getElementById("buttonSubmit");

        if(isSubmit){
            button.disabled = true;
            return;
        }

        button.disabled = false;
    }, [isSubmit]);

    const redirectToGoogleOauth = () => {
        window.location.href = googleOauthRedirectLink;
        return;
    }

    const register = async () => {
        setErroMessage("");
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        handleIsSubmitChange();

        const isInputInvalid = isInputsInvalid(
            name,
            email,
            password,
            confirmPassword
        );

        if(isInputInvalid){
            setErroMessage("Input can't empty");
            handleIsSubmitChange();
            return
        }

        const isPasswordAndConfirmNotValid = isPasswordAndConfirmPasswordNotMatch(
            password,
            confirmPassword
        )

        if(isPasswordAndConfirmNotValid){
            setErroMessage("Password and confirm password not match");
            handleIsSubmitChange();
            return
        }
        try{
            const respond = await postRequest("api/auth/register",null,{
                name,
                email,
                password
            })
    
            if(respond.error){
                setErroMessage(respond.error);
                handleIsSubmitChange();
                return
            }
    
            window.location.href = "/login";
        }
        catch(err){
            console.log(err);
            setErroMessage("something went wrong");
        }
        handleIsSubmitChange();
    }

    const setErroMessage = (message) => {
        document.getElementById("errorMessage").innerText = message;
    }

    return (
        <div
            className="flex justify-center fixed top-0 bottom-0 left-0 right-0 mt-[10vh]"
        >
            <div
                className="bg-white flex flex-col justify-center p-10 m-5 gap-y-3 rounded h-[30rem]"
            >
                <div className="flex justify-center">
                    <h1 className="text-[#00AB6B] font-bold text-[1.5rem]">
                        PocketWise
                    </h1>
                </div>
                <div className="flex justify-center">
                    <input 
                        className="bg-[#F0F0F0] p-1 pl-4 border-2 w-[20rem] border-white  outline-none rounded-md" 
                        type="text" placeholder="Name"
                        onChange={handleNameChange}
                        value={name}
                    />
                </div>
                <div className="flex justify-center">
                    <input 
                        className="bg-[#F0F0F0] p-1 pl-4 border-2 w-[20rem] border-white  outline-none rounded-md" 
                        type="text" placeholder="Email"
                        onChange={handleEmailChange}
                        value={email}    
                    />
                </div>
                <div className="flex justify-center">
                    <input 
                        className="bg-[#F0F0F0] p-1 pl-4 border-2 w-[20rem] border-white  outline-none rounded-md" 
                        type="password" placeholder="Password"
                        onChange={handlePasswordChange}
                        value={password}
                    />
                </div>
                <div className="flex justify-center">
                    <input 
                        className="bg-[#F0F0F0] p-1 pl-4 border-2 w-[20rem] border-white  outline-none rounded-md" 
                        type="password" placeholder="Confirm password"
                        onChange={handleConfirmPasswordChange}
                        value={confirmPassword}    
                    />
                </div>
                
                <p 
                    id="errorMessage" className="text-red-500 text-center"
                >
                </p>

                <div className="flex justify-center">
                    <button
                        className="bg-[#00AB6B] text-white font-bold w-full py-1 rounded hover:bg-[#00CF81] cursor-pointer"
                        onClick={register}
                        id="buttonSubmit"
                    >
                        Register
                    </button>
                </div>
                <div className="flex justify-between text-[#00AB6B] font-bold text-[0.9rem]">
                    <a href="/login">
                        <p>Sign in</p>
                    </a>
                    
                </div>
                <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 border-[0.05rem] border-t border-gray-300">

                    </div>
                        <div>
                            <p className="text-[#B9B9B9] text-sm whitespace-nowrap">
                            Or continue with
                            </p>
                        </div>
                    <div className="flex-1 border-[0.05rem] border-t border-gray-300">
                        
                    </div>
                </div>
                <div className="flex justify-center">
                    <button
                        className="bg-[#F0F0F0] text-black font-bold w-full py-1.5 rounded cursor-pointer flex justify-center items-center"
                        onClick={redirectToGoogleOauth}
                    >
                        <img className="w-10 h-6" src="/logo/google.png" alt="" />
                        <p>Google</p>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Register;