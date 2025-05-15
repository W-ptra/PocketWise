function RequestChangePassword(){
    return (
                <div
            className="flex justify-center py-[29vh]"
        >
            <div
                className="bg-white flex flex-col p-10 m-5 gap-y-3 rounded"
            >
                <div className="flex justify-center">
                    <h1 className="text-[#00AB6B] font-bold text-[1.5rem]">
                        Forget Password
                    </h1>
                </div>
                <div className="flex justify-center">
                    <input className="bg-[#F0F0F0] p-1 pl-4 border-2 w-[20rem] border-white  outline-none rounded-md" type="text" placeholder="Email"/>
                </div>
                <div className="flex justify-center">
                    <button
                        className="bg-[#00AB6B] text-white font-bold w-full py-1 rounded hover:bg-[#00CF81] cursor-pointer"
                    >
                        Send reset link
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RequestChangePassword;