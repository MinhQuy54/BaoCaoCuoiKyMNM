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

    // const [password, setPassword] = useState("");
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
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const validate = () => {
        let newErrors = {};
        if (formData.username.trim() === '') {
            newErrors.username = "Tên đăng nhập không được để trống";
        }

        if (formData.email.trim() === '') {
            newErrors.email = "Email không được để trống.";
        }

        const passwordError = validatePassword(formData.password);
        if (passwordError) {
            newErrors.password = passwordError;
        }

        if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = "Mật khẩu xác nhận không trùng khớp.";
        }
        if (formData.confirmPassword.trim() === '') {
            newErrors.confirmPassword = "Xác nhận mật khẩu không được để trống.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }
    const handleRegister = (e) => {
        e.preventDefault();
        if (validate()) {


        }
    }
    return (
        <div onClick={handleOverlayClick} className='fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50'>
            <div className="w-[800px] h-[650px] bg-white rounded-lg flex">
                <div className="bg-login w-[400px] h-full relative bg-cover bg-center rounded-l-lg">
                    <div className="absolute bottom-8 left-8">
                        <h1 className='text-white text-4xl font-extrabold '>LÀNG PHIM</h1>
                    </div>
                </div>
                <div className="w-[400px] h-full bg-white rounded-r-lg ">
                    <form onSubmit={handleRegister} className="text-black flex flex-col justify-center items-center h-full p-8">
                        <h2 className='font-extrabold text-4xl mb-8 text-red-700 uppercase'>Đăng ký</h2>
                        <input type="text" placeholder='Tên đăng nhập...'
                            name='username'
                            value={formData.username}
                            onChange={handleChange}
                            className='mb-2 w-full p-4  border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-600 transition duration-300' />
                        {errors.username && (
                            <p className="text-xs text-red-700 px-2 mb-2 w-full text-left">
                                {errors.username}
                            </p>
                        )}
                        <input type="email" placeholder='Email...'
                            name="email" value={formData.email}
                            onChange={handleChange}
                            className='mb-2 w-full p-4  border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-600 transition duration-300' />
                        {errors.email && (
                            <p className="text-xs text-red-700 px-2 mb-2 w-full text-left">
                                {errors.email}
                            </p>
                        )}
                        <div className="w-full flex relative items-center">
                            <input type={showPassword ? 'text' : 'password'}
                                placeholder='Mật khẩu...'
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className='mb-2 w-full p-4   border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-600 transition duration-300' />
                            <button type="button" className="absolute right-0 mr-4" onClick={toggleShowPassword}>
                                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                            </button>

                        </div>
                        {errors.password && (
                            <p className="text-xs text-red-700 px-2 mb-2 w-full text-left">
                                {errors.password}
                            </p>
                        )}
                        <div className="w-full flex relative items-center">
                            <input type={showPassword ? 'text' : 'password'}
                                placeholder='Mật khẩu...'
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className='mb-2 w-full p-4   border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-600 transition duration-300' />
                            <button type="button" className="absolute right-0 mr-4" onClick={toggleShowPassword}>
                                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                            </button>

                        </div>
                        {errors.confirmPassword && (
                            <p className="text-xs text-red-700 px-2 mb-2 w-full text-left">
                                {errors.confirmPassword}
                            </p>
                        )}


                        <button type="submit"

                            className='w-full py-3  text-lg font-semibold text-white bg-red-700 rounded-lg 
                        shadow-lg hover:bg-red-600 transition duration-300 transform hover:scale-[1.01]' >
                            Đăng ký
                        </button>
                        <a href="" className='w-full text-black text-right pr-2 py-2 hover:text-red-700 '>Quên mật khẩu</a>

                        <p className='text-center w-full mt-8'>Chưa có tài khoản, <a href="" className='text-red-700'>đăng ký tại đây!</a> </p>

                    </form>

                </div>
            </div>
        </div>

    )
}

export default RegisterModal