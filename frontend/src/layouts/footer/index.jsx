import React from "react";
import { FaPlay } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa";
import DarkVeil from "../../componentbg/DarkVeil.jsx";

const Footer = ({onRegisterClick}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  return (
    <div className="h-[600px] w-full mt-60 
    bg-gradient-to-b from-black/10 to-black/90 
    relative ">
      <div className="flex flex-col items-center justify-center relative">
        <div className="bg-red-700 h-[250px] w-[500px] rounded-2xl
         absolute -top-20 shadow-2xl  flex-col items-center justify-center">
          <div className="p-10 pb-0">
            <h1 className="text-[40px] uppercase font-bold text-white">
              Làng Phim
            </h1>
          </div>
          <div className="pl-10 text-[16px] text-white">
            <p>
              Trang xem phim online chất lượng cao miễn phí
            </p>
          </div>
          <div className="pl-32 pt-10 flex">
            <button
              type="button"
              onClick={scrollToTop}
              className="text-gray-900 hover:text-white bg-white hover:bg-gray-900 
                font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 flex items-center justify-center gap-2 "
            >
              <FaPlay /> Xem ngay
            </button>
            <button
              type="button"
              onClick={onRegisterClick}
              className="text-gray-900 hover:text-white bg-white hover:bg-gray-900 
            font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 flex items-center justify-center gap-2  "
            >
              <FaUserPlus />Trở thành thành viên
            </button>

          </div>
        </div>
      </div>
      <div className=" absolute bottom-40 w-full h-[200px] 
           text-white text-lg font-medium flex text-[16px]
          flex-col justify-center items-center  space-y-4 ">
        <p className=" hover:text-red-700">Giới thiệu</p>
        <p className=" hover:text-red-700">Điều khoản sử dụng</p>
        <p className=" hover:text-red-700">Chính sách bảo mật</p>
        <p className=" hover:text-red-700">Liên hệ</p>
        <p className=" hover:text-red-700">FAQ</p>

      </div>

      <div className=" absolute bottom-16 flex flex-col items-center text-center w-[300px] 
      p-2 text-[16px] left-1/2 -translate-x-1/2 rounded-2xl
      justify-center text-white bg-red-700 ">
        <DarkVeil
          text={["Hoàng Sa và Trường Sa là của Việt Nam", "Làng Phim", "Chúc bạn xem phim vui vẻ!"]}
          typingSpeed={75}
          pauseDuration={1500}
          showCursor={true}
          cursorCharacter=" " />

      </div>

    </div>
  );
};

export default Footer;
