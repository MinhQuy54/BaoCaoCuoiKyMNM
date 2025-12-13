// Header2.jsx (Đã sửa lỗi nhảy chữ)

import { FaSearch, FaSortDown } from "react-icons/fa";
import { useState, useEffect, useRef } from 'react';
import { FaBell, FaSignOutAlt, FaCrown, FaFire } from "react-icons/fa";
import { IoCaretDownOutline } from "react-icons/io5";
import { FaListCheck } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';

const Header2 = () => {
    // ... (Code State và Effects giữ nguyên) ...
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpenNotificationBox, setIsOpenNotificationBox] = useState(false);
    const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(''); // State cho input tìm kiếm

    const notificationRef = useRef(null);
    const genreRef = useRef(null);
    const countryRef = useRef(null);

    const navigate = useNavigate();

    // Xử lý scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // đóng hộp thông báo/dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                notificationRef.current && !notificationRef.current.contains(event.target)
            ) {
                setIsOpenNotificationBox(false);
            }
            if (genreRef.current && !genreRef.current.contains(event.target)) {
                setIsGenreDropdownOpen(false);
            }
            if (countryRef.current && !countryRef.current.contains(event.target)) {
                setIsCountryDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const toggleNotificationBox = () => {
        setIsOpenNotificationBox(!isOpenNotificationBox);
    };

    const toggleGenreDropdown = () => {
        setIsGenreDropdownOpen(!isGenreDropdownOpen);
        setIsCountryDropdownOpen(false);
    };

    const toggleCountryDropdown = () => {
        setIsCountryDropdownOpen(!isCountryDropdownOpen);
        setIsGenreDropdownOpen(false);
    };

    // Xử lý Tìm kiếm
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };


    const handleLogout = async () => {
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/auth/logout/", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    },
                    body: JSON.stringify({ refresh_token: refreshToken })
                });

                if (response.status === 205 || response.ok) {
                    console.log("Refresh Token đã bị Blacklist thành công trên server.");
                } else {
                    console.warn("Lỗi server khi Logout, có thể token đã hết hạn, vẫn tiến hành xóa cục bộ.");
                }
            } catch (error) {
                console.error("Lỗi mạng khi gọi API Logout:", error);
            }
        }

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('username'); // Nếu bạn có lưu username

        alert("Đăng xuất thành công!");
        window.location.reload();
    };


    return (
        <div className={`p-4 flex items-center justify-between text-white top-0 left-0 w-full z-50 fixed
            transition-all duration-800 ${isScrolled ? 'bg-black' : 'bg-transparent'}`}>
            <div className="flex items-center space-x-4">
                <Link to="/" className="text-[25px] uppercase font-bold text-red-700 pr-4 cursor-pointer">
                    Làng Phim
                </Link>
                <div className="flex items-center">
                    {/* Thanh tìm kiếm */}
                    <form onSubmit={handleSearchSubmit} className="flex items-center flex-shrink-0">
                        <input
                            type="text"
                            placeholder="Tìm kiếm tên phim..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            // Sử dụng min-w-0 và max-w-xs để giới hạn kích thước input
                            className="h-12 px-4 text-black rounded-l-lg border-none focus:outline-none min-w-0 max-w-xs"
                        />
                        <button type="submit" className="h-12 px-4 bg-red-700 rounded-r-lg flex-shrink-0">
                            <FaSearch />
                        </button>
                    </form>
                </div>
            </div>

            {/* CONTAINER BÊN PHẢI: Thêm flex-nowrap để ngăn xuống dòng và min-w-0 để cho phép co lại */}
            <div className="flex items-center space-x-4 text-lg flex-nowrap min-w-0">
                {/* Menu điều hướng */}
                <nav className="flex items-center space-x-4 flex-shrink">
                    <Link to="/ranking" className="text-white hover:text-red-600 font-bold flex items-center whitespace-nowrap">
                        <FaFire className="mr-1 text-orange-500" /> Bảng Xếp Hạng
                    </Link>
                </nav>

                {/* Dropdown Thể loại */}
                <nav className="relative flex-shrink" ref={genreRef}>
                    <button onClick={toggleGenreDropdown} className="text-white flex items-center hover:text-red-600 whitespace-nowrap">
                        Thể loại <FaSortDown className={`ml-1 transition-transform ${isGenreDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
                    </button>
                    {isGenreDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-gray-800 rounded-md shadow-xl z-50">
                            {/* ... (Links) ... */}
                            <Link to="/genre/action" className="block px-4 py-2 text-sm text-white hover:bg-red-700">Hành Động</Link>
                            <Link to="/genre/romance" className="block px-4 py-2 text-sm text-white hover:bg-red-700">Tình Cảm</Link>
                            <Link to="/genre/horror" className="block px-4 py-2 text-sm text-white hover:bg-red-700">Kinh Dị</Link>
                        </div>
                    )}
                </nav>

                {/* Dropdown Quốc gia */}
                <nav className="relative flex-shrink" ref={countryRef}>
                    <button onClick={toggleCountryDropdown} className="text-white flex items-center hover:text-red-600 whitespace-nowrap">
                        Quốc gia <FaSortDown className={`ml-1 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
                    </button>
                    {isCountryDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-gray-800 rounded-md shadow-xl z-50">
                            {/* ... (Links) ... */}
                            <Link to="/country/vn" className="block px-4 py-2 text-sm text-white hover:bg-red-700">Việt Nam</Link>
                            <Link to="/country/us" className="block px-4 py-2 text-sm text-white hover:bg-red-700">Âu Mỹ</Link>
                            <Link to="/country/kr" className="block px-4 py-2 text-sm text-white hover:bg-red-700">Hàn Quốc</Link>
                        </div>
                    )}
                </nav>

                {/* Phim lẻ/Phim bộ - Thêm whitespace-nowrap */}
                <nav className="flex items-center space-x-4 flex-shrink">
                    <Link to="/phimle" className="text-white hover:text-red-600 whitespace-nowrap">Phim lẻ</Link>
                </nav>
                <nav className="flex items-center space-x-4 flex-shrink">
                    <Link to="/phimbo" className="text-white hover:text-red-600 whitespace-nowrap">Phim bộ</Link>
                </nav>

                {/* Nút Đăng ký VIP */}
                <button
                    onClick={() => navigate('/vip')}
                    className='flex items-center px-4 py-2 text-white bg-yellow-600 rounded-lg font-semibold hover:bg-yellow-500 transition duration-300 flex-shrink-0 whitespace-nowrap'>
                    <FaCrown className="mr-2" /> VIP
                </button>

                {/* Hộp thông báo */}
                <nav className="flex items-center space-x-4 relative flex-shrink-0">
                    <button
                        onClick={toggleNotificationBox}
                        className="h-12 px-4 bg-red-700 rounded-full hover:animate-shake ">
                        <FaBell />
                    </button>
                    {/* ... (Hộp thông báo) ... */}
                </nav>

                {/* Khu vực Người dùng và Đăng xuất */}
                <nav className="flex items-center space-x-4 flex-shrink-0">
                    <div
                        className="h-12 w-12 p-0 overflow-hidden bg-red-700 rounded-full">
                        <img src="https://i.pinimg.com/736x/38/5f/44/385f443a72d21425ee4bb83eacb31140.jpg"
                            alt="avatar"
                            className="w-full h-full inset-0" />
                    </div>
                    <IoCaretDownOutline />
                </nav>

                {/* Nút Đăng xuất */}
                <button
                    onClick={handleLogout}
                    className='flex items-center px-4 py-2 text-white bg-red-700 rounded-lg font-semibold hover:bg-red-600 transition duration-300 flex-shrink-0 whitespace-nowrap'>
                    <FaSignOutAlt className="mr-2" /> Đăng xuất
                </button>
            </div>
        </div>
    )
}

export default Header2