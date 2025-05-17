import { useState,useEffect } from "react";
import { isInputsInvalid,redirectIfLogin } from "../utils/validation";
import { deleteToken, getToken } from "../utils/localStorage";
import Back from "../components/back";
import { getRequest } from "../utils/api";

function Profile(){
    const [name,setName] = useState("empty");
    const [email,setEmail] = useState("empty");

    const handleNameChange = (e) => {
        setName(e.target.value);
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    redirectIfLogin();

    useEffect(() => {
        const getProfileInfo = async () => {
        const token = getToken();
        const respond = await getRequest("api/user/profile", token);

        if (respond.error)
            return;

        setName(respond.data.name);
        setEmail(respond.data.email);
    };

    getProfileInfo();
    }, []);

    return (
        <>
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
                        <img className="size-10 bg-gray-200 rounded-full" src="/logo/User.png" alt="" />
                        <input type="text" 
                            className="outline-none w-full"
                            value={name}
                            onChange={handleNameChange}
                        />
                    </div>
                </div>
                <div
                    className="bg-white flex flex-col justify-center px-5 py-5 gap-y-3  rounded w-[40rem]"
                >
                    <div>
                        <input type="text" 
                            className="outline-none w-full"
                            value={email}
                            onChange={handleEmailChange}
                        />
                    </div>
                    <div
                        className="border-[0.05rem] border-white border-t-black pt-2.5"
                    >
                        <p>10 April 2025</p>
                    </div>
                    <p id="message" className="text-center"></p>
                </div>
                <div
                    className="flex justify-center gap-x-3 rounded w-[40rem]"
                >
                    

                    <button
                            className="bg-[#00AB6B] text-white font-bold w-full py-2 rounded hover:bg-[#00CF81] cursor-pointer"
                            //onClick={}
                            id="buttonSubmit"
                        >
                            Update Profile
                    </button>
                    <button
                            className="bg-[#00AB6B] text-white font-bold w-full py-2 rounded hover:bg-[#00CF81] cursor-pointer"
                            //onClick={}
                            id="buttonSubmit"
                        >
                            Change Password
                    </button>
                </div>
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