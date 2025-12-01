import { FaSearch, FaSortDown } from "react-icons/fa";
import { useState, useEffect, useRef } from 'react';
import { FaBell } from "react-icons/fa";
import { IoCaretDownOutline } from "react-icons/io5";
import { FaListCheck } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { FaPlusCircle } from "react-icons/fa";
import { FaClockRotateLeft } from "react-icons/fa6";
import { FaUserLarge } from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";


const Header2 = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpenNotificationBox, setIsOpenNotificationBox] = useState(false);
    const [isOpenUserBox, setIsOpenUserBox] = useState(false)

    const notificationRef = useRef(null);
    const userBoxRef = useRef(null);
    const notificationToggleRef = useRef(null);
    const userToggleRef = useRef(null);

    // Xử lý scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    //đóng hộp thông báo khi click ra ngoài
    //đóng hộp user khi click ra ngoài

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target) &&
                !notificationToggleRef.current.contains(event.target)
            ) {
                setIsOpenNotificationBox(false);
            }

            if (
                userBoxRef.current &&
                !userBoxRef.current.contains(event.target) &&
                !userToggleRef.current.contains(event.target)
            ) {
                setIsOpenUserBox(false);
            }

        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    //hiển thị hộp thông báo
    const toggleNotificationBox = () => {
        setIsOpenNotificationBox(!isOpenNotificationBox);
    };



    //hiển thị hộp thông báo
    const toggleUserBox = () => {
        setIsOpenUserBox(!isOpenUserBox);
    };




    return (
        <div className={`p-4 flex items-center justify-between text-white top-0 left-0  w-full z-50 fixed
            transition-all duration-800 ${isScrolled ? 'bg-black' : 'bg-transparent'}`}>
            <div className="flex items-center space-x-4">
                <h1 className="text-[30px] uppercase font-bold text-red-700 pr-4    ">
                    Làng Phim
                </h1>
                <div className="flex items-center">
                    <input type="text" placeholder="Tìm kiếm tên phim..." className="h-12 px-4 text-black rounded-l-lg border-none focus:outline-none" />
                    <button className="h-12 px-4 bg-red-700 rounded-r-lg ">
                        <FaSearch />
                    </button>

                </div>

            </div>

            <div className="flex items-center space-x-4 text-lg">
                <nav className="flex items-center space-x-4">
                    <a href="#" className="text-white hover:text-red-600">Chủ đề</a>
                </nav>
                <nav className="flex items-center space-x-4">
                    <a href="#" className="text-white flex items-center hover:text-red-600">Thể loại <FaSortDown className="ml-1" /></a>
                </nav>

                <nav className="flex items-center space-x-4">
                    <a href="#" className="text-white flex items-center hover:text-red-600">Quốc gia <FaSortDown className="ml-1" /></a>
                </nav>

                <nav className="flex items-center space-x-4">
                    <a href="#" className="text-white hover:text-red-600">Phim lẻ</a>
                </nav>

                <nav className="flex items-center space-x-4">
                    <a href="#" className="text-white hover:text-red-600">Phim bộ</a>
                </nav>

                <nav className="flex items-center space-x-4">
                    <button
                        ref={notificationToggleRef}
                        onClick={toggleNotificationBox}
                        className="h-12 px-4 bg-red-700 rounded-full hover:animate-shake ">
                        <FaBell />
                    </button>
                    {/* Hôp thông báo */}
                    {isOpenNotificationBox && (
                        <div
                            ref={notificationRef}
                            className="bg-gray-200 h-[400px] w-[400px] 
            absolute top-20 rounded-xl right-32 text-gray-800 shadow-lg
            flex flex-col">
                            <div className="flex justify-between items-center p-4">
                                <div className="text-lg font-semibold flex-shrink-0">
                                    Thông báo
                                </div>
                                <button className="flex space-x-2 text-red-800 hover:text-red-600
                        justify-center items-center ">
                                    <FaListCheck />
                                    <p>Đã đọc</p>
                                </button>

                            </div>
                            <hr className="border-gray-300 flex-shrink-0" />
                            <div className="text-center  text-red-600 
                    flex-grow flex items-center justify-center">
                                <p className="p-4">Không có thông báo nào</p>
                            </div>
                            <hr className="border-gray-300 flex-shrink-0" />
                            <div className="text-center  text-black flex-shrink-0">
                                <p className="p-4 hover:bg-gray-300 rounded-b-xl">Xem tất cả</p>
                            </div>

                        </div>
                    )}


                </nav>

                <nav className="flex items-center space-x-4">
                    <div
                        className="h-12 w-12 p-0 overflow-hidden bg-red-700 rounded-full">
                        <img src="https://i.pinimg.com/736x/38/5f/44/385f443a72d21425ee4bb83eacb31140.jpg"
                            alt="avatar"
                            className="w-full h-full inset-0" />
                    </div>
                    <button className="w-4 h-4"
                        ref={userToggleRef}
                        onClick={toggleUserBox}>
                        <IoCaretDownOutline />
                    </button>
                    {/* Hôp user */}
                    {
                        isOpenUserBox && (
                            <div ref={userBoxRef} className="bg-gray-200 h-[340px] w-[250px] absolute right-6 top-20
                    rounded-lg flex flex-col shadow-lg">
                                <div className="text-black text-lg p-4 
                        flex items-center justify-center flex-shrink-0">
                                    Ariana Grade
                                </div>
                                <hr className="border-gray-300 flex-shrink-0" />
                                <div className="text-black text-lg 
                         flex flex-col items-start justify-center
                         flex-grow">
                                    <p className="flex items-center gap-2 pl-6
                            hover:bg-gray-300 w-full h-full">
                                        <FaHeart />
                                        Yêu thích
                                    </p>
                                    <p className="flex items-center gap-2 pl-6
                            hover:bg-gray-300 w-full h-full">
                                        <FaPlusCircle />
                                        Danh sách phát
                                    </p>
                                    <p className="flex items-center gap-2 pl-6
                            hover:bg-gray-300 w-full h-full">
                                        <FaClockRotateLeft />
                                        Xem tiếp
                                    </p>
                                    <p className="flex items-center gap-2 pl-6
                            hover:bg-gray-300 w-full h-full">
                                        <FaUserLarge />
                                        Tài khoản
                                    </p>
                                </div>
                                <hr className="border-gray-300 flex-shrink-0" />
                                <div className="text-black text-lg 
                        flex items-center justify-center flex-shrink-0">
                                    <p className="flex items-center justify-center p-4 gap-2
                            hover:bg-gray-300 w-full h-full rounded-b-lg">
                                        <FaSignOutAlt />
                                        Đăng xuất
                                    </p>
                                </div>

                            </div>

                        )
                    }
                </nav>

            </div>

        </div>
    )
}

export default Header2