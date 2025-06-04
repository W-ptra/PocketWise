function Footer(){
    return (
        <footer
            className=""
        >
            <div
                className="bg-white flex px-10 py-6"
            >
                <div
                    className="flex-1/2 flex flex-col justify-center"
                >
                    <p>
                        <span
                            className="text-[#00AB6B] font-bold text-[1.8rem]"
                        >
                            PocketWise
                        </span> <br />
                        <span
                            className="font-bold  text-[1.7rem]"
                        >
                            <span className="text-[#787878]">
                                Smart Life, Smart 
                            </span>
                            <span className="text-[#00AB6B]">
                                { " Money" }
                            </span>
                        </span>
                    </p>
                </div>
                <div
                    className="flex-1/2 flex flex-col"
                >
                    <div className="flex flex-row text-[#747274] justify-end gap-x-10 font-bold">
                        <p>Dashboard</p>
                        <p>Transaction History</p>
                        <p>Analysis</p>
                    </div>
                    <div className="flex justify-end ">
                        <div
                            className="flex border-[0.1rem] border-white border-t-black px-5 mt-12"
                        >
                            <div 
                                className="items-center flex border-[0.1rem] border-white border-r-black mr-5 pr-5 mt-5"
                            >
                                <p className="text-[#747274]">
                                    @pocket_wise
                                </p>
                            </div>
                            <div className="flex items-center justify-end gap-x-5 mt-5">
                                <img className="size-8" src="./logo/LinkedIn.png" alt="LinkedIn" />
                                <img className="size-8" src="./logo/Instagram.png" alt="Instagram" />
                                <img className="size-8" src="./logo/GitHub.png" alt="GitHub" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="bg-[#00AB6B] px-10 py-3"
            >
                <p
                    className="text-white font-bold"
                >
                    © 2025 PocketWise
                </p>
            </div>
        </footer>
    )
}

export default Footer;