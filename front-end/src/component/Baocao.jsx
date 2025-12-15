import { FaAngleRight } from "react-icons/fa";
const Baocao = () => {
    return (
        <div className="h-[600px] w-full bg-gradient-to-t from-black/10 to-black text-white flex flex-col items-center justify-center ">
            <div className="text-white text-3xl font-bold p-4 mt-4 w-full ml-24">
                Báo cáo
            </div>
            <div className="flex p-10 flex-wrap gap-6 ml-6">
                <div className="h-[180px] w-[334px] bg-gradient-to-r from-[#56039e] to-[#946ee1] rounded-md flex flex-col items-start justify-center hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer">
                    <div className="text-2xl pl-8 pt-12 pb-3">Marvel</div>
                    <div className="text-xl pl-8 flex items-center gap-1 underline">
                        Xem chủ đề <FaAngleRight />
                    </div>
                </div>
                <div className="h-[180px] w-[334px] bg-gradient-to-r from-[#e1650c] to-[#f8b14e] rounded-md flex flex-col items-start justify-center hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer">
                    <div className="text-2xl pl-8 pt-12 pb-3">Lồng tiếng cực mạnh</div>
                    <div className="text-xl pl-8 flex items-center gap-1 underline">
                        Xem chủ đề <FaAngleRight />
                    </div>
                </div>
                <div className="h-[180px] w-[334px] bg-gradient-to-r from-[#d105a2] to-[#f68fda] rounded-md flex flex-col items-start justify-center hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer">
                    <div className="text-2xl pl-8 pt-12 pb-3">Sitcom</div>
                    <div className="text-xl pl-8 flex items-center gap-1 underline">
                        Xem chủ đề <FaAngleRight />
                    </div>
                </div>
                <div className="h-[180px] w-[334px] bg-gradient-to-r from-[#157583] to-[#00d9fa] rounded-md flex flex-col items-start justify-center hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer">
                    <div className="text-2xl pl-8 pt-12 pb-3">Xuyên không</div>
                    <div className="text-xl pl-8 flex items-center gap-1 underline">
                        Xem chủ đề <FaAngleRight />
                    </div>
                </div>
                <div className="h-[180px] w-[334px] bg-gradient-to-r from-[#01916d] to-[#1bf183] rounded-md flex flex-col items-start justify-center hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer">
                    <div className="text-2xl pl-8 pt-12 pb-3">Chữa lành</div>
                    <div className="text-xl pl-8 flex items-center gap-1 underline">
                        Xem chủ đề <FaAngleRight />
                    </div>
                </div>
                <div className="h-[90px] w-[334px] bg-gradient-to-r from-[#1900ff] to-[#0971a4] rounded-md flex flex-col items-start justify-center hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer">
                    <div className="text-xl pl-8 flex items-center gap-1 ">
                        9+ Chủ đề <FaAngleRight />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Baocao