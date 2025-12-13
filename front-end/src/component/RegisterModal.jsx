import { FaEye, FaEyeSlash } from "react-icons/fa"
import { useState } from 'react';

const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
    if (regex.test(password)) {
        return null;
    } else {
        return "Mật khẩu tối thiểu 8 ký tự bao gồm số, chữ thường, chữ in hoa và ký tự đặc biệt";
    }
}

const RegisterModal = ({ onClose }) => {
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        const newErrors = {};

        const passwordError = validatePassword(formData.password);
        if (passwordError) {
            newErrors.password = passwordError;
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
        }

        if (!formData.username) newErrors.username = "Tên đăng nhập không được để trống.";
        if (!formData.email) newErrors.email = "Email không được để trống.";

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                // SỬA ĐƯỜNG DẪN CHÍNH XÁC: /api/auth/register/
                const response = await fetch("http://127.0.0.1:8000/api/auth/register/", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    // Chỉ gửi username và password nếu serializer chỉ xử lý 2 trường này
                    body: JSON.stringify({
                        username: formData.username,
                        password: formData.password,
                        // Có thể gửi email nếu bạn sửa Serializer ở backend
                        email: formData.email
                    })
                });

                if (response.ok) {
                    alert("Đăng ký thành công! Vui lòng đăng nhập.");
                    onClose();
                } else {
                    const errorData = await response.json();
                    console.error("Lỗi đăng ký từ server:", errorData);
                    alert("Đăng ký thất bại: " + JSON.stringify(errorData));
                }
            } catch (error) {
                console.error("Lỗi mạng/API:", error);
                alert("Đã xảy ra lỗi kết nối.");
            }
        }
    };

    return (
        <div onClick={handleOverlayClick} className='fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50'>
            <div className="w-[800px] h-[600px] bg-white rounded-lg flex">
                {/* ... (Phần UI) ... */}
                <div className="bg-login w-[400px] h-full relative bg-cover bg-center rounded-l-lg">
                    <div className="absolute bottom-8 left-8">
                        <h1 className='text-white text-4xl font-extrabold '>LÀNG PHIM</h1>
                    </div>
                </div>
                <div className="w-[400px] h-full bg-white rounded-r-lg ">
                    <form onSubmit={handleRegister} className="text-black flex flex-col justify-center items-center h-full p-8">
                        <h2 className='font-extrabold text-4xl mb-4 text-red-700 uppercase'>Đăng ký</h2>

                        {/* Username Input */}
                        <input type="text" placeholder='Tên đăng nhập...' name="username"
                            value={formData.username} onChange={handleChange}
                            className={`mb-2 w-full p-4 border rounded-lg outline-none transition duration-300 ${errors.username ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-red-600'}`} />
                        {errors.username && <p className="text-red-500 text-sm mb-2 w-full text-left">{errors.username}</p>}

                        {/* Email Input */}
                        <input type="email" placeholder='Email...' name="email"
                            value={formData.email} onChange={handleChange}
                            className={`mb-2 w-full p-4 border rounded-lg outline-none transition duration-300 ${errors.email ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-red-600'}`} />
                        {errors.email && <p className="text-red-500 text-sm mb-2 w-full text-left">{errors.email}</p>}

                        {/* Password Input */}
                        <div className="w-full flex relative items-center mb-2">
                            <input type={showPassword ? 'text' : 'password'}
                                placeholder='Mật khẩu...'
                                name="password" value={formData.password}
                                onChange={handleChange}
                                className={`w-full p-4 border rounded-lg outline-none transition duration-300 ${errors.password ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-red-600'}`} />
                            <button type="button" className="absolute right-0 mr-4" onClick={toggleShowPassword}>
                                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-sm mb-2 w-full text-left">{errors.password}</p>}

                        {/* Confirm Password Input */}
                        <div className="w-full flex relative items-center mb-4">
                            <input type={showPassword ? 'text' : 'password'}
                                placeholder='Xác nhận mật khẩu...'
                                name="confirmPassword" value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`w-full p-4 border rounded-lg outline-none transition duration-300 ${errors.confirmPassword ? 'border-red-500 focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-red-600'}`} />
                            <button type="button" className="absolute right-0 mr-4" onClick={toggleShowPassword}>
                                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-sm mb-2 w-full text-left">{errors.confirmPassword}</p>}

                        <input type="submit" value="Đăng Ký"
                            className='w-full py-3 text-lg font-semibold text-white bg-red-700 rounded-lg shadow-lg hover:bg-red-600 transition duration-300 transform hover:scale-[1.01] cursor-pointer' />

                        <p className='text-center w-full mt-8'>Đã có tài khoản, <a href="#" className='text-red-700'>đăng nhập tại đây!</a> </p>

                    </form>

                </div>
            </div>
        </div>
    );
};

export default RegisterModal;