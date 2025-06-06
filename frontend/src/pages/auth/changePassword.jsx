import { useState,useEffect } from "react";
import { useParams } from 'react-router-dom';
import { isInputsInvalid,isPasswordAndConfirmPasswordNotMatch, redirectIfLogout } from "~utils/validation";
import { putRequest } from "~utils/api";

function ChangePassword(){
    const [ password,setPassword ] = useState("");
    const [ confirmPassword,setConfirmPassword ] = useState("");
    const [ isSubmit,setIsSubmit ] = useState(false);

    redirectIfLogout();

    const { id } = useParams();

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

    const changePassword = async () => {
        setErroMessage("");
        handleIsSubmitChange();
        setPassword("");
        setConfirmPassword("");
        handleIsSubmitChange();

        const isInputInvalid = isInputsInvalid(
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
            const respond = await putRequest(`api/auth/reset-password/${id}`,null,{
                password
            });

            if(respond.error){
                setErroMessage(respond.error);
                handleIsSubmitChange();
                return
            }

            setMessage(respond.message);

            window.location.href = "/login";
        }
        catch(err){
            console.log(err);
            setErroMessage("something went wrong");
        }
    }

    const setErroMessage = (message) => {
        document.getElementById("errorMessage").innerText = message;
    }

    const setMessage = (message) => {
        document.getElementById("message").innerText = message;
    }

    return (
        <div
            className="flex justify-center fixed top-0 bottom-0 left-0 right-0 mt-[10vh]"
        >
            <div
                className="bg-white flex flex-col justify-center p-10 m-5 gap-y-3 rounded h-[18rem]"
            >
                <div className="flex justify-center">
                    <h1 className="text-[#00AB6B] font-bold text-[1.5rem]">
                        Change Password
                    </h1>
                </div>
                <div className="flex justify-center">
                    <input 
                        className="bg-[#F0F0F0] p-1 pl-4 border-2 w-[20rem] border-white  outline-none rounded-md" 
                        type="password" placeholder="New password"
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
                        onClick={changePassword}
                        id="buttonSubmit"
                    >
                        Change
                    </button>
                </div>
                <p 
                    id="message" className="text-black text-center"
                >
                </p>
            </div>
        </div>
    )
}

export default ChangePassword;