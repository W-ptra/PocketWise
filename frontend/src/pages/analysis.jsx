import Navbar from "../components/navbar";
import Footer from "../components/footer";

function Analysis(){
    return (
        <div>
            <Navbar/>
            <div className="flex min-h-screen flex-col bg-gray-100">
                <div className="mt-10 flex flex-col items-center justify-center gap-y-7">
                    <div className="flex w-[110rem] flex-col justify-center gap-y-3 rounded bg-white px-5 py-5 shadow-md">
                        <div className="flex justify-center">
                            <h1 className="text-[1.5rem] font-bold text-[#00AB6B]">Analisa Bulanan</h1>
                        </div>
                    </div>

                    <div className="flex w-[110rem] flex-col justify-center gap-y-3 rounded bg-white px-5 py-5 space-y-4 shadow-md">
                        <div className="flex flex-col">
                            <div className="justify-left flex">
                                <h2 className="text-[1.2rem] font-medium text-[#00AB6B]">Januari 2025</h2>
                            </div>
                            <div className="flex-1 border-[0.05rem] border-t border-gray-300"></div>
                            <div className="justify-right flex flex-col">
                                <h2 className="text-[1.1rem] font-medium mt-4 mb-4 text-[#000000]">
                                    Pada bulan Januari pengeluaran kamu sangat irit.
                                </h2>
                                <h2 className="text-[1rem] text-[#000000]">
                                    Pada bulan Januari, kamu berhasil mengelola keuangan dengan sangat baik. Pengeluaran tercatat lebih rendah dari rata-rata bulan sebelumnya, menunjukkan bahwa kamu berhasil menekan pengeluaran yang tidak perlu. Kemungkinan besar kamu lebih fokus pada kebutuhan pokok dan menghindari pembelian impulsif. Ini bisa menjadi indikasi bahwa kamu memulai tahun dengan semangat penghematan atau ada tujuan keuangan tertentu yang sedang kamu kejar, seperti menabung untuk investasi atau kebutuhan jangka panjang.
                                </h2>
                            </div>
                        </div>
                        <div className="w-full flex border-[0.05rem] border-t border-gray-300"></div>
                        <div>
                            <div className="justify-left flex">
                                <h2 className="text-[1.2rem] font-medium text-[#00AB6B]">Februari 2025</h2>
                            </div>
                            <div className="flex-1 border-[0.05rem] border-t border-gray-300"></div>
                            <div className="justify-right flex flex-col">
                                <h2 className="text-[1.1rem] font-medium mt-4 mb-4 text-[#000000]">
                                Pada bulan Februari pengeluaran kamu sangat boros.
                                </h2>
                                <h2 className="text-[1rem] text-[#000000]">
                                Hal ini menunjukkan bahwa terdapat peningkatan signifikan dalam jumlah pengeluaran dibanding bulan sebelumnya. Kemungkinan besar terjadi pembelian yang tidak direncanakan, peningkatan konsumsi gaya hidup, atau pengeluaran untuk kebutuhan sekunder yang tidak terlalu mendesak. Kamu mungkin tidak memantau anggaran secara ketat atau terlalu banyak menggunakan metode pembayaran non-tunai, seperti kartu kredit atau e-wallet, yang membuat pengeluaran terasa tidak langsung. Disarankan untuk mengevaluasi kembali daftar pengeluaran, mengidentifikasi pos-pos yang bisa dikurangi, serta mulai kembali mencatat setiap pengeluaran harian agar kamu bisa kembali ke jalur keuangan yang sehat di bulan berikutnya.
                                </h2>
                            </div>
                        </div>
                        <div className="flex border-[0.05rem] border-t border-gray-300"></div>
                        <div>
                            <div className="justify-left flex">
                                <h2 className="text-[1.2rem] font-medium text-[#00AB6B]">Maret 2025</h2>
                            </div>
                            <div className="flex-1 border-[0.05rem] border-t border-gray-300"></div>
                            <div className="justify-right flex">
                                <h2 className="text-[1rem] text-[#000000]">Pada bulan Maret pengeluaran kamu normal.</h2>
                            </div>
                        </div>
                    </div>

                    <div className="flex w-[110rem] flex-col justify-center gap-y-3 rounded bg-white px-5 py-5 shadow-md">
                        <div className="grid grid-cols-[2fr_1fr] w-full">
                            <div className="flex justify-center">
                                <h2 className="text-[1.5rem] font-bold text-[#00AB6B]">Rekomendasi Harian</h2>
                            </div>
                            <div className="flex justify-center">
                                <h2 className="text-[1.5rem] font-bold text-[#00AB6B]">Hari/Tanggal</h2>
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