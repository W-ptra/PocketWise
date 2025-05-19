import { useState,useEffect } from "react";
import { isInputsInvalid,redirectIfLogin } from "../utils/validation";
import { deleteToken, getToken } from "../utils/localStorage";
import Back from "../components/back";
import { getRequest, postRequest, putRequest } from "../utils/api";
import Message from "../components/message";

function Profile(){
    const [id,setId] = useState("empty");
    const [googleId,setGoogleId] = useState("empty");
    const [name,setName] = useState("empty");
    const [email,setEmail] = useState("empty");
    const [profileImage,setprofileImage] = useState(null);
    const [isConnectToGoogle,setIsConnectToGoogle] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("error");
    const [showMessage, setShowMessage] = useState(false);

    const handleNameChange = (e) => {
        setName(e.target.value);
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const toggleMessage = () => {
        setShowMessage((prev) => !prev);
    };

    redirectIfLogin();

    useEffect(() => {
        const getProfileInfo = async () => {
        const token = getToken();
        const respond = await getRequest("api/user/profile", token);

        if (respond.error)
            return;

        setId(respond.data.id);
        setGoogleId(respond.data.googleId);
        setName(respond.data.name);
        setEmail(respond.data.email);
        setprofileImage(respond.data.profileImageUrl)
        console.log(respond.data)
        if(respond.data.authMethod === "google"){
            setIsConnectToGoogle(true);
        }
    };

    getProfileInfo();
    }, []);

    const updateProfile = async () => {
        setShowMessage(false);
        if(isInputsInvalid(name)){
            handleShowMessage("input can't empty","error")
            return;
        }
        const token = getToken();
        const respond = await putRequest("api/user/profile",token,{
            name
        });

        if(respond.error){
            handleShowMessage(respond.error,"error")
            return;
        }
        handleShowMessage(respond.message,"message")
    }

    const changeEmail = async () => {
        setShowMessage(false);
        if(isInputsInvalid(email)){
            console.log(email)
            handleShowMessage("input can't empty","error")
            return;
        }
        const token = getToken();
        const respond = await putRequest("api/user/profile/email",token,{
            email
        });

        if(respond.error){
            handleShowMessage(respond.error,"error")
            return;
        }

        handleShowMessage(respond.message,"message")
    }

    const requestResetLink = async () => {
        setShowMessage(false);
        const isInputInvalid = isInputsInvalid(
            email
        );

        if(isInputInvalid){
            handleShowMessage("input can't empty","error")
            return;
        }
        try{
            const respond = await postRequest("api/auth/request-reset-password",null,{
                email
            });
    
            if(respond.error){
                handleShowMessage(respond.error,"error")
                return;
            }
            handleShowMessage(respond.message,"message")
        }
        catch(err){
            console.log(err);
            handleShowMessage(
                "something went wrong, can't request reset link",
                "error"
            )
        }
    }

    const handleShowMessage = (message,type) => {
        setShowMessage(true);
        setMessage(message);
        setMessageType(type);
    }

    return (
        <>
            { showMessage && (
                <Message type={messageType} message={message} onClose={toggleMessage}/>
            ) }
            <Back/>
            <div
                className="flex flex-col justify-center items-center mt-10 gap-y-7"
            >
                <div
                    className="bg-white flex flex-col justify-center py-5 px-5 gap-y-3 rounded w-[40rem]"
                >
                    <div
                        className="flex items-center gap-x-3"
                    >
                        { profileImage ? (
                            <img className="size-16 bg-gray-200 rounded-full" src={profileImage} alt="" />
                        ) : (
                            <img className="size-16 bg-gray-200 rounded-full" src="/logo/User.png" alt="" />
                        )}
                        
                        <div
                            className="flex flex-col"
                        >
                            <input type="text" 
                                className="outline-none w-full"
                                value={name}
                                onChange={handleNameChange}
                                disabled={ isConnectToGoogle }
                            />
                            { isConnectToGoogle && (
                                <div className="flex border-[0.12rem] rounded border-[#00AB6B] items-center pr-1">
                               
                                    <img className="w-8 h-5" src="/logo/google.png" alt="" />
                                    
                                    <p>
                                        Account Connected to Google
                                    </p>
                                </div>
                            )}
                            
                        </div>
                    </div>
                </div>
                <div
                    className="bg-white flex flex-col justify-center px-5 py-5 gap-y-3  rounded w-[40rem]"
                >
                    <div className="flex gap-x-5">
                        <p className="text-[#787878]">Id</p>
                        <input type="text" 
                            className="outline-none w-full"
                            value={id}
                            disabled={ true }
                        />
                    </div>
                    { isConnectToGoogle && (
                        <div className="flex gap-x-5 border-[0.05rem] border-white border-t-black pt-2.5">
                            <p className="text-[#787878]">GoogleId</p>
                            <input type="text" 
                                className="outline-none w-full"
                                value={googleId}
                                disabled={ true }
                            />
                        </div>
                    ) }

                    <div className="flex gap-x-5 border-[0.05rem] border-white border-t-black pt-2.5">
                        <p className="text-[#787878]">Email</p>
                        <input type="text" 
                            className="outline-none w-full"
                            value={email}
                            onChange={handleEmailChange}
                            disabled={ isConnectToGoogle }
                        />
                    </div>
                </div>

                { !isConnectToGoogle && (
                    <div
                        className="flex justify-center gap-x-3 rounded w-[40rem]"
                    >
                        

                        <button
                                className="bg-[#00AB6B] text-white font-bold w-full py-2 rounded hover:bg-[#00CF81] cursor-pointer"
                                onClick={updateProfile}
                                id="buttonSubmit"
                            >
                                Update Profile
                        </button>
                        <button
                                className="bg-[#00AB6B] text-white font-bold w-full py-2 rounded hover:bg-[#00CF81] cursor-pointer"
                                onClick={changeEmail}
                                id="buttonSubmit"
                            >
                                Change Email
                        </button>
                        <button
                                className="bg-[#00AB6B] text-white font-bold w-full py-2 rounded hover:bg-[#00CF81] cursor-pointer"
                                onClick={requestResetLink}
                                id="buttonSubmit"
                            >
                                Change Password
                        </button>
                    </div>
                )}

                <div
                    className="bg-white flex gap-x-5 items-center px-8 py-4 gap-y-3 rounded w-[40rem]"
                >
                    <div className="flex items-center gap-x-4 cursor-pointer">
                        <div
                            className="flex items-center gap-x-4"
                            onClick={deleteToken}
                        >
                            <img className="size-5" src="/logo/log out.png" alt="" />
                            <p>
                                Log out
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile;