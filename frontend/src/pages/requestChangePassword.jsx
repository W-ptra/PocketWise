import { useState,useEffect } from "react";
import { isInputsInvalid, redirectIfLogout } from "../utils/validation";
import { postRequest } from "../utils/api";

function RequestChangePassword(){
    const [ email,setEmail ] = useState("");
    const [ isSubmit,setIsSubmit ] = useState(false);

    redirectIfLogout();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
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

    const requestResetLink = async () => {
        setErroMessage("");
        handleIsSubmitChange();

        const isInputInvalid = isInputsInvalid(
            email
        );

        if(isInputInvalid){
            setErroMessage("Input can't empty");
            return
        }
        try{
            const respond = await postRequest("api/auth/request-reset-password",null,{
                email
            });
    
            if(respond.error){
                setErroMessage(respond.error);
                return
            }
    
            setLinkMessage(respond.message)
        }
        catch(err){
            console.log(err);
            setErroMessage("something went wrong");
        }
        handleIsSubmitChange();
        setEmail("");
    }

    const setErroMessage = (message) => {
        document.getElementById("errorMessage").innerText = message;
    }

    const setLinkMessage = (message) => {
        document.getElementById("linkMessage").innerText = message;
    }

    return (
        <div
            className="flex justify-center fixed top-0 bottom-0 left-0 right-0 mt-[10vh]"
        >
            <div
                className="bg-white flex flex-col justify-center p-10 m-5 gap-y-3 rounded h-[15rem] pb-12"
            >
                <div className="flex justify-center">
                    <h1 className="text-[#00AB6B] font-bold text-[1.5rem]">
                        Forget Password
                    </h1>
                </div>
                <div className="flex justify-center">
                    <input 
                        className="bg-[#F0F0F0] p-1 pl-4 border-2 w-[20rem] border-white  outline-none rounded-md" 
                        type="text" placeholder="Email"
                        onChange={handleEmailChange}
                        value={email}        
                    />
                </div>
                <p 
                    id="errorMessage" className="text-red-500 text-center"
                >
                </p>
                <div className="flex justify-center">
                    <button
                        className="bg-[#00AB6B] text-white font-bold w-full py-1 rounded hover:bg-[#00CF81] cursor-pointer"
                        onClick={requestResetLink}
                        id="buttonSubmit"
                    >
                        Send reset link
                    </button>
                </div>
                <p 
                    id="linkMessage" className="text-black text-center"
                >
                </p>
            </div>
        </div>
    )
}

export default RequestChangePassword;