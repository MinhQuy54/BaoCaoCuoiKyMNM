import { FaSearch, FaSortDown } from "react-icons/fa";
import { useState, useEffect } from 'react';


const Header = ({ onLoginClick, onRegisterClick }) => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
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
                    <button onClick={onRegisterClick} className="h-12 w-32 px-4 bg-red-700 rounded-lg hover:animate-shake">Đăng ký</button>
                </nav>

                <nav className="flex items-center space-x-4">
                    <button onClick={onLoginClick} 
                        className="h-12 w-32 px-4 bg-red-700 rounded-lg  hover:animate-shake">
                            Đăng nhập
                    </button>
                </nav>

            </div>

        </div>
    )
}

export default Header