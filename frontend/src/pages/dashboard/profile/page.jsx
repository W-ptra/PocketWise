import { useState,useEffect,useRef } from "react";
import { isInputsInvalid,redirectIfLogin } from "../../../utils/validation";
import { deleteToken, getToken } from "../../../utils/localStorage";
import Back from "../../../components/back";
import { getRequest, postRequest, putRequest } from "../../../utils/api";
import Message from "../../../components/message";

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
    const [showUploadImage,setShowUplaodImage] = useState(false);
    const [file,setFile] = useState(null);
    const fileInputRef = useRef();

    const uploadFile = () => {
        fileInputRef.current.value = null;
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
        } else {
            alert("Please select a valid image file.");
        }
    };
    
    const handleNameChange = (e) => {
        setName(e.target.value);
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const toggleMessage = () => {
        setShowMessage((prev) => !prev);
    };

    const toggleUploadImageWindow = () => {
        setShowUplaodImage((prev) => !prev);
    }

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

    const uploadProfile = async () => {
        const formData = new FormData();
        formData.append('image', file);
        const respond = await postRequest("api/user/profile/image",getToken(),formData,true);
        console.log(respond);

        window.location.reload();
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
                        <div
                            className="relative"
                        >
                            { profileImage ? (
                                <img className="size-16 bg-gray-200 rounded-full" src={profileImage} alt="" />
                            ) : (
                                <img className="size-16 bg-gray-200 rounded-full" src="/logo/User.png" alt="" />
                            )}
                            { !isConnectToGoogle && (
                                <img 
                                    className="size-6 p-0.5 bg-gray-400 rounded-full absolute right-0 bottom-0 cursor-pointer hover:bg-gray-300" src="logo/edit.png" alt="" 
                                    onClick={toggleUploadImageWindow}    
                                />
                            )}
                        </div>
                        
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
            
            { showUploadImage && (
                <div
                    className="flex justify-center items-center z-50 fixed top-0 bottom-0 left-0 right-0 bg-[rgba(75,85,99,0.5)]"
                >
                    <div
                        className="bg-white rounded w-[40rem] h-[20rem] mb-10 flex flex-col justify-center items-center"
                    >
                        { file && (
                            <div
                                className="relative"
                            >
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="Preview"
                                    className="max-w-[10rem] max-h-[10rem] bg-gray-100 p-1"
                                />

                                <img src="/logo/cross.png" alt="" 
                                    className="bg-gray-500 absolute  size-6 top-0 right-0 cursor-pointer rounded-full"
                                    onClick={() => { setFile(null) }}
                                />
                            </div>
                        ) }

                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />

                        { !file ? (
                            <>
                                <div
                                    className="bg-[#00AB6B] px-5 py-2 flex items-center rounded-xl hover:bg-[rgb(109,209,156)] cursor-pointer mb-1 mt-1"
                                    onClick={uploadFile}
                                >
                                    
                                    <img 
                                        className="size-10 " 
                                        src="/logo/addImage.png" alt="" 
                                        
                                    />
                                    <p
                                        className="text-white font-bold"
                                    >
                                        Add Image
                                    </p>
                                </div>
        
                                <p className="text-[#787878] mt-1">PNG / JPEG / JPG</p>
                                <p className="text-[#787878]">Max Size 10MB</p>
                            </>
                        ) : (
                            <button
                                className="mt-2 bg-[#00AB6B] text-white font-bold px-10 py-2 rounded hover:bg-[rgb(109,209,156)] cursor-pointer"
                                onClick={uploadProfile}
                            >
                                Upload
                            </button>
                        ) }

                    </div>

                    <img 
                        className="absolute bottom-5 right-[46%] bg-gray-800 rounded-full hover:bg-gray-700 cursor-pointer" src="/logo/cross.png" alt="" 
                        onClick={toggleUploadImageWindow}    
                    />
                </div>
            ) }
        </>
    )
}

export default Profile;