import Navbar from "../../../components/navbar";
import Footer from "../../../components/footer";

function Analysis(){
    return (
        <div>
            <Navbar/>
            <div className=" flex flex-col bg-gray-100 mx-10 mb-5">
                <div className="mt-10 flex flex-col items-center justify-center gap-y-7">
                    <div className="flex  flex-col justify-center gap-y-3 rounded bg-white px-5 py-5 shadow-md w-full">
                        <h1 className="text-[1.5rem] font-bold text-[#00AB6B] text-center">Analisa Bulanan</h1>
                    </div>

                    <div className="flex flex-col justify-center gap-y-5 rounded bg-white px-5 py-5 shadow-md w-full">
                        <div className="flex flex-col">
                            <div className="justify-left flex">
                                <h2 className="text-[1.2rem] font-medium text-[#00AB6B]">Januari 2025</h2>
                            </div>
                            <div className="flex-1 border-[0.05rem] border-t border-gray-300"></div>
                            <div className="justify-right flex flex-col">
                                <ul className="flex flex-col gap-y-1 mt-3">
                                    <li>• Pengeluaranmu untuk Rent cukup rendah (Str18.2% vs saran 27.7%). Boleh dipertimbangkan naik hingga Rp6,093,291.</li>
                                    <li>• Kamu terlalu banyak mengeluarkan uang di Loan_Repayment (2.7% vs saran 1.3%). Idealnya kamu bisa hemat sekitar Rp314,557.</li>
                                    <li>• Pengeluaranmu untuk Insurance cukup rendah (1.4% vs saran 4.9%). Boleh dipertimbangkan naik hingga Rp1,067,360.</li>
                                    <li>• Pengeluaranmu untuk Groceries cukup rendah (9.1% vs saran 12.4%). Boleh dipertimbangkan naik hingga Rp2,717,884.</li>
                                    <li>• Pengeluaranmu untuk Transport cukup rendah (2.3% vs saran 7.6%). Boleh dipertimbangkan naik hingga Rp1,662,562.</li>
                                    <li>• Kamu terlalu banyak mengeluarkan uang di Eating_Out (9.1% vs saran 5.0%). Idealnya kamu bisa hemat sekitar Rp900,153.</li>
                                    <li>• Pengeluaranmu untuk Entertainment cukup rendah (0.9% vs saran 5.0%). Boleh dipertimbangkan naik hingga Rp1,099,717.</li>
                                    <li>• Pengeluaranmu untuk Utilities cukup rendah (0.2% vs saran 4.2%). Boleh dipertimbangkan naik hingga Rp920,922.</li>
                                    <li>• Pengeluaranmu untuk Healthcare cukup rendah (0.5% vs saran 4.9%). Boleh dipertimbangkan naik hingga Rp1,079,028.</li>
                                    <li>• Kamu terlalu banyak mengeluarkan uang di Education (0.5% vs saran 0.0%). Idealnya kamu bisa hemat sekitar Rp99,994.</li>
                                </ul>
                            </div>
                        </div>

                    </div>

                    <div className="flex flex-col justify-center gap-y-3 rounded bg-white px-5 py-5 shadow-md w-full">
                        <h2 className="text-[1.5rem] font-bold text-[#00AB6B] text-center">Analisa Harian</h2>
                    </div>

                    <div className="flex flex-col justify-center gap-y-3 rounded bg-white px-5 py-5 shadow-md w-full mb-5 gap-x-1">
                        <div className="grid grid-cols-[2fr_1fr] w-full">
                            <div className="flex justify-center">
                                <h2 className="text-[1.5rem] font-bold text-[#00AB6B]">Rekomendasi</h2>
                            </div>
                            <div className="flex justify-center">
                                <h2 className="text-[1.5rem] font-bold text-[#00AB6B]">Hari,Tanggal</h2>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-[2fr_1fr] w-full border-[0.1rem] border-white border-t-[#787878] pt-1 gap-x-1">
                           <div 
                            className="flex flex-row justify-center items-center"
                           >
                                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus ab fugit cumque nemo possimus eaque libero magni placeat voluptatum ducimus? Ut unde minima magni molestiae, placeat porro omnis obcaecati alias.
                           </div>
                           <div
                            className="flex flex-row justify-center items-center"
                           >
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio officia eligendi perferendis voluptate fugiat eius, error soluta et nihil vel ratione, dolore hic aut ipsa quod impedit autem quos nesciunt.
                           </div>
                           
                        </div>
                        <div className="grid grid-cols-[2fr_1fr] w-full border-[0.1rem] border-white border-t-[#787878] pt-1 gap-x-1">
                           <div 
                            className="flex flex-row justify-center items-center"
                           >
                                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus ab fugit cumque nemo possimus eaque libero magni placeat voluptatum ducimus? Ut unde minima magni molestiae, placeat porro omnis obcaecati alias.
                           </div>
                           <div
                            className="flex flex-row justify-center items-center"
                           >
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio officia eligendi perferendis voluptate fugiat eius, error soluta et nihil vel ratione, dolore hic aut ipsa quod impedit autem quos nesciunt.
                           </div>
                           
                        </div>
                        <div className="grid grid-cols-[2fr_1fr] w-full border-[0.1rem] border-white border-t-[#787878] pt-1 gap-x-1">
                           <div 
                            className="flex flex-row justify-center items-center"
                           >
                                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus ab fugit cumque nemo possimus eaque libero magni placeat voluptatum ducimus? Ut unde minima magni molestiae, placeat porro omnis obcaecati alias.
                           </div>
                           <div
                            className="flex flex-row justify-center items-center"
                           >
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio officia eligendi perferendis voluptate fugiat eius, error soluta et nihil vel ratione, dolore hic aut ipsa quod impedit autem quos nesciunt.
                           </div>
                           
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default Analysis;