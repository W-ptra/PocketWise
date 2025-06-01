function Navbar(){
    return (
        <nav
            className="bg-white flex flex-col"
        >
            <div
                className="flex-1/2 flex items-center justify-between pt-2 mb-1"
            >
                <p
                    className="text-[#00AB6B] font-extrabold ml-10 cursor-pointer"
                >
                    PocketWise
                </p>
                <a href="/profile">
                    <img className="size-10 rounded-full bg-gray-200 mr-10 cursor-pointer" src="/logo/User.png" alt="" />
                </a>
            </div>
            <div
                className="flex justify-center gap-x-10 flex-1/2 border-[0.1rem] border-white border-t-black mt-2 items-center py-3"
            >
                <div
                    className="flex items-center justify-center gap-x-3 cursor-pointer"
                >
                    <img className="size-7" src="/logo/Control Panel gray.png" alt="" />
                    <p
                        className="text-[#B0B0B0]"
                    >
                        Dashboard
                    </p>
                </div>
                <div
                    className="flex items-center justify-center gap-x-3 cursor-pointer"
                >
                    <img className="size-7" src="/logo/Purchase Order gray.png" alt="" />
                    <p
                        className="text-[#B0B0B0]"
                    >
                        Transaction History
                    </p>
                </div>
                <div
                    className="flex items-center justify-center gap-x-3 cursor-pointer"
                >
                    <img className="size-7" src="/logo/Web Analytics gray.png" alt="" />
                    <p
                        className="text-[#B0B0B0]"
                    >
                        Analysis
                    </p>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;