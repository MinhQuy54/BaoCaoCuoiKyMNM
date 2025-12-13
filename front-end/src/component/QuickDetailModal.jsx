import React from 'react';
import { FaTimes, FaPlayCircle, FaInfoCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const QuickDetailModal = ({ movie, onClose }) => {
    if (!movie) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-[1000] flex justify-center items-center p-4" onClick={onClose}>
            <div
                className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden transform transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header và Background */}
                <div className="relative h-64 bg-cover bg-center" style={{ backgroundImage: `url(${movie.bg})` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white text-2xl p-2 bg-black/50 rounded-full hover:bg-red-700 transition"
                    >
                        <FaTimes />
                    </button>
                    <div className="absolute bottom-4 left-4 text-white">
                        <h2 className="text-4xl font-bold">{movie.title}</h2>
                        <p className="text-gray-400">{movie.year || 'N/A'} • {movie.duration || movie.episodes || 'N/A'}</p>
                    </div>
                </div>

                {/* Nội dung chi tiết */}
                <div className="p-6 text-white">
                    <p className="mb-4 text-lg line-clamp-4">{movie.desc || movie.description || 'Không có mô tả.'}</p>

                    <div className="flex items-center space-x-4 mb-6">
                        <Link to={`/movie/${movie.id}`} onClick={onClose}>
                            <button className="flex items-center px-6 py-3 bg-red-700 text-white rounded-lg text-lg font-semibold hover:bg-red-600 transition">
                                <FaPlayCircle className="mr-3" /> Xem chi tiết
                            </button>
                        </Link>
                        {/* Bạn có thể tùy chọn thêm logic cho nút này, hiện tại nó có vẻ chỉ mang tính trang trí */}
                        <button className="flex items-center px-4 py-3 border border-gray-600 rounded-lg text-lg font-semibold hover:bg-gray-700 transition">
                            <FaInfoCircle className="mr-3" /> Thông tin đầy đủ
                        </button>
                    </div>

                    <div className="text-sm">
                        <p><strong>Đạo diễn:</strong> {movie.director || 'N/A'}</p>
                        <p><strong>Diễn viên:</strong> {movie.cast || 'N/A'}</p>
                        <p><strong>Thể loại:</strong> {movie.tags?.join(', ') || movie.categories?.map(c => c.name).join(', ') || 'N/A'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickDetailModal;