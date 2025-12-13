import React, { useState } from 'react';
import Header2 from '../component/Header2';
import Header from '../component/Header';
import Footer from '../component/Footer';
import { FaCheckCircle, FaCrown, FaCreditCard, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const VipRegistrationPage = () => {
    const [isLoggedIn] = useState(!!localStorage.getItem('accessToken'));
    const [selectedPlan, setSelectedPlan] = useState('monthly');
    const navigate = useNavigate();

    const plans = [
        { id: 'monthly', name: 'Gói Tháng', price: 79000, displayPrice: '79.000 VNĐ/tháng', features: ['Xem không quảng cáo', 'Chất lượng 4K', 'Hỗ trợ 2 thiết bị'] },
        { id: 'yearly', name: 'Gói Năm', price: 790000, displayPrice: '790.000 VNĐ/năm', saving: '(Tiết kiệm 20%)', features: ['Tất cả tính năng gói tháng', 'Ưu tiên hỗ trợ', 'Truy cập sớm nội dung độc quyền'] },
    ];

    const handleSubscription = async (plan) => {
        const accessToken = localStorage.getItem('accessToken');

        if (!isLoggedIn || !accessToken) {
            alert("Phiên đăng nhập đã hết hạn hoặc không tồn tại. Vui lòng đăng nhập lại!");
            navigate('/');
            return;
        }

        // 1. Tạo orderId và OrderInfo 
        const orderId = `VIP_${plan.id}_${Date.now()}`;
        const orderInfo = `Đăng ký gói VIP ${plan.name} - ${localStorage.getItem('username') || 'Khách hàng'}`;

        try {
            // 2. Gọi API Backend (Django) để tạo yêu cầu MoMo
            const response = await fetch('http://127.0.0.1:8000/api/payment/create_momo/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    amount: plan.price,
                    orderId: orderId,
                    orderInfo: orderInfo,
                    plan_id: plan.id
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Lỗi Backend khi tạo MoMo request:", errorData);

                // Xử lý lỗi Token đã hết hạn/không hợp lệ
                if (errorData.code === 'token_not_valid') {
                    alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng xuất và đăng nhập lại để tiếp tục.");
                    // Xóa token cũ
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    navigate('/');
                } else {
                    alert(`Lỗi khi tạo yêu cầu thanh toán: ${errorData.detail || 'Lỗi không xác định.'}`);
                }
                return;
            }

            const data = await response.json();

            // 3. Chuyển hướng người dùng đến URL thanh toán của MoMo Test
            if (data.payUrl) {
                window.location.href = data.payUrl;
            } else {
                alert('Lỗi: Không nhận được URL thanh toán từ MoMo.');
            }

        } catch (error) {
            console.error('Lỗi mạng/hệ thống khi thanh toán MoMo:', error);
            alert('Có lỗi xảy ra trong quá trình tạo yêu cầu thanh toán. Vui lòng thử lại sau.');
        }
    };

    return (
        <div className='bg-black/90 min-h-screen'>
            {isLoggedIn ? <Header2 /> : <Header />}

            <div className="max-w-4xl mx-auto py-20 px-4">
                <div className="text-center text-white mb-12">
                    <FaCrown className="text-yellow-500 text-6xl mx-auto mb-4" />
                    <h1 className="text-4xl font-extrabold mb-2">Trở thành Thành viên VIP</h1>
                    <p className="text-gray-400 text-xl">Mở khóa toàn bộ nội dung, xem không giới hạn và không quảng cáo!</p>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    {plans.map(plan => (
                        <div
                            key={plan.id}
                            className={`p-6 rounded-xl border-4 cursor-pointer transition duration-300 
                                ${selectedPlan === plan.id ? 'border-red-700 bg-gray-900 shadow-2xl' : 'border-gray-800 bg-gray-800 hover:border-gray-600'}`}
                            onClick={() => setSelectedPlan(plan.id)}
                        >
                            <h2 className="text-3xl font-bold text-red-500 flex items-center mb-3">
                                {plan.name} {plan.saving && <span className="text-sm ml-2 text-green-400">{plan.saving}</span>}
                            </h2>
                            <p className="text-4xl font-extrabold text-white mb-6">{plan.displayPrice}</p>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-center text-gray-300">
                                        <FaCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSubscription(plan)}
                                className={`w-full py-3 rounded-lg font-bold text-lg transition duration-300
                                    ${selectedPlan === plan.id ? 'bg-red-700 text-white hover:bg-red-600' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                            >
                                THANH TOÁN MOMO
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center text-gray-500">
                    <p className="flex items-center justify-center text-sm">
                        <FaLock className="mr-2" />
                        Tất cả thanh toán được xử lý an toàn và bảo mật.
                        <FaCreditCard className="ml-2" />
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default VipRegistrationPage;