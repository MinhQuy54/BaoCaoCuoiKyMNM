// src/page/MoviePlayerPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header2 from '../component/Header2';
import Header from '../component/Header';
import Footer from '../component/Footer';
import HLSPlayer from '../component/HLSPlayer'; // Import Player mới
import { FaArrowLeft } from 'react-icons/fa';

const MoviePlayerPage = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn] = useState(!!localStorage.getItem('accessToken'));

    useEffect(() => {
        const fetchMovieDetail = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:8000/api/movies/${id}/`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

                const data = await res.json();
                setMovie(data);
                setLoading(false);
            } catch (error) {
                console.error("Lỗi khi fetch chi tiết phim:", error);
                setLoading(false);
            }
        };
        fetchMovieDetail();
    }, [id]);

    if (loading) {
        return <div className="bg-black min-h-screen text-white flex justify-center items-center text-xl">Đang tải phim...</div>;
    }
    if (!movie) {
        return <div className="bg-black min-h-screen text-white flex justify-center items-center text-xl">Không tìm thấy phim.</div>;
    }

    // 🌟 URL PROXY: URL mà Frontend sẽ gọi để lấy Stream từ Backend Django 🌟
    // Đây là cách giải quyết lỗi CORS/Referer
    const proxyStreamUrl = `http://127.0.0.1:8000/api/proxy-stream/${id}/`;

    if (!movie.video_url) {
        // Hiển thị lỗi nếu video_url chưa được scrape
        return (
            <div className="bg-black min-h-screen text-white">
                {isLoggedIn ? <Header2 /> : <Header />}
                <div className="max-w-7xl mx-auto p-8 pt-20">
                    <h1 className="text-4xl font-bold mb-4 text-red-600">Lỗi: Không có Video</h1>
                    <p className="text-gray-400">Không tìm thấy URL phát phim cho: **{movie.title}**.</p>
                    <Link to={`/movie/${movie.id}`} className="mt-4 inline-flex items-center text-red-400 hover:text-red-500 transition">
                        <FaArrowLeft className="mr-2" /> Quay lại trang chi tiết
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    // Hiển thị Player chính
    return (
        <div className='bg-black min-h-screen'>
            {isLoggedIn ? <Header2 /> : <Header />}

            <div className="max-w-7xl mx-auto p-4 pt-20">
                <Link to={`/movie/${movie.id}`} className="text-gray-400 hover:text-white transition inline-flex items-center mb-4">
                    <FaArrowLeft className="mr-2" /> Quay lại trang chi tiết
                </Link>
                <h1 className="text-3xl font-bold text-white mb-6">Đang xem: {movie.title}</h1>

                {/* KHỐI CHỨA HLS PLAYER MỚI */}
                <div className="w-full relative pt-[56.25%] bg-black rounded-lg overflow-hidden shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-full">
                        <HLSPlayer
                            streamUrl={proxyStreamUrl} // 🌟 DÙNG LINK PROXY 🌟
                            movieTitle={movie.title}
                        />
                    </div>
                </div>

                <div className="mt-8 text-gray-400">
                    <p className="text-lg">Tên phim: **{movie.title}**</p>
                    <p className="text-sm">Năm phát hành: {movie.year}</p>
                    <p className="text-sm">Mô tả: {movie.desc}</p>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default MoviePlayerPage;