import React, { useState, useEffect } from 'react';
import Header2 from '../component/Header2';
import Header from '../component/Header';
import Footer from '../component/Footer';
import { FaTrophy, FaStar, FaFire } from 'react-icons/fa';

const RankingPage = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn] = useState(!!localStorage.getItem('accessToken'));

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                // API lấy tất cả phim
                const res = await fetch("http://127.0.0.1:8000/api/movies/");
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

                const data = await res.json();

                // Client-side Sorting (Giả định Backend trả về 'average_rating')
                const ranked = data
                    .filter(m => m.average_rating)
                    .sort((a, b) => b.average_rating - a.average_rating)
                    .slice(0, 20)
                    .map(item => ({
                        ...item,
                        thumb: item.thumb?.startsWith('http') ? item.thumb : `http://127.0.0.1:8000${item.thumb}`,
                    }));

                setMovies(ranked);
                setLoading(false);
            } catch (error) {
                console.error("Lỗi khi fetch bảng xếp hạng:", error);
                setLoading(false);
            }
        };

        fetchRanking();
    }, []);

    const renderMovieRow = (movie, index) => {
        const rank = index + 1;
        const rankColor = rank === 1 ? 'text-yellow-500' : rank === 2 ? 'text-gray-400' : rank === 3 ? 'text-orange-600' : 'text-gray-500';

        return (
            <a href={`/movie/${movie.id}`} key={movie.id} className="block">
                <div className="flex items-center bg-gray-900 p-4 rounded-lg shadow-xl hover:bg-gray-800 transition duration-300 mb-4 cursor-pointer">
                    <div className={`text-5xl font-extrabold mr-8 w-12 flex-shrink-0 ${rankColor}`}>
                        {rank}
                    </div>
                    <img src={movie.thumb} alt={movie.title} className="w-16 h-24 object-cover rounded-md mr-6 flex-shrink-0" />
                    <div className="flex-grow">
                        <h3 className="text-xl font-bold text-white hover:text-red-500">{movie.title}</h3>
                        <p className="text-gray-400 text-sm">{movie.director} | {movie.year}</p>
                    </div>
                    <div className="flex items-center text-lg font-semibold flex-shrink-0">
                        <FaStar className="text-yellow-500 mr-2" />
                        <span className="text-white">{movie.average_rating ? movie.average_rating.toFixed(1) : 'N/A'}</span>
                    </div>
                </div>
            </a>
        );
    };

    return (
        <div className='bg-black/90 min-h-screen'>
            {isLoggedIn ? <Header2 /> : <Header />}
            <div className="max-w-4xl mx-auto py-20 px-4">
                <div className="text-center text-white mb-10">
                    <FaTrophy className="text-red-700 text-6xl mx-auto mb-4" />
                    <h1 className="text-4xl font-extrabold mb-2">BẢNG XẾP HẠNG PHIM</h1>
                    <p className="text-gray-400 text-lg">Top 20 Phim được đánh giá cao nhất!</p>
                </div>

                {loading ? (
                    <div className="text-white text-center">Đang tải bảng xếp hạng...</div>
                ) : (
                    <div className="space-y-4">
                        {movies.length === 0 ? (
                            <p className="text-gray-500 text-center">Không có dữ liệu xếp hạng.</p>
                        ) : (
                            movies.map((movie, index) => renderMovieRow(movie, index))
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default RankingPage;