import Navbar from "@/pages/dashboard/_components/Navbar";
import Footer from "@/pages/dashboard/_components/Footer";
import { getRequest } from "~utils/api";
import { getToken } from "@/utils/localStorage";
import { useEffect, useState } from "react";

function Analysis(){
    const [monthlyJournal,setMonthlyJournal] = useState(null);


    const fetchMonthlyJournal =  async () => {
        const result = await getRequest("api/ai/journal/month",getToken());
        console.log(result);
        setMonthlyJournal(result.data);
    }

    useEffect(()=>{
        fetchMonthlyJournal();
    },[]);
    
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
                                    { monthlyJournal && (
                                        monthlyJournal.feedback.map( element => (
                                            <li>{element}</li>
                                        ) )
                                    ) }

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