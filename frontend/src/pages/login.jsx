function Login(){
    return (
        <div
            className="flex justify-center py-[16vh]"
        >
            <div
                className="bg-white flex flex-col p-10 m-5 gap-y-3 rounded"
            >
                <div className="flex justify-center">
                    <h1 className="text-[#00AB6B] font-bold text-[1.5rem]">
                        PocketWise
                    </h1>
                </div>
                <div className="flex justify-center">
                    <input className="bg-[#F0F0F0] p-1 pl-4 border-2 w-[20rem] border-white  outline-none rounded-md" type="text" placeholder="Email"/>
                </div>
                <div className="flex justify-center">
                    <input className="bg-[#F0F0F0] p-1 pl-4 border-2 w-[20rem] border-white  outline-none rounded-md" type="text" placeholder="Password"/>
                </div>
                <div className="flex justify-center">
                    <button
                        className="bg-[#00AB6B] text-white font-bold w-full py-1 rounded hover:bg-[#00CF81] cursor-pointer"
                    >
                        Login
                    </button>
                </div>
                <div className="flex justify-between text-[#00AB6B] font-bold text-[0.9rem]">
                    <a href="/request-change-password">
                        <p>Forget password</p>
                    </a>
                    <a href="/register">
                        <p>Sign up</p>
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
                    >
                        <img className="w-10 h-6" src="/logo/google.png" alt="" />
                        <p>Google</p>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login;