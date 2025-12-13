import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header2 from '../component/Header2';
import Header from '../component/Header';
import Footer from '../component/Footer';
import { FaSearch } from 'react-icons/fa';

const SearchResultPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn] = useState(!!localStorage.getItem('accessToken'));

    useEffect(() => {
        if (!query) {
            setResults([]);
            setLoading(false);
            return;
        }

        const fetchSearch = async () => {
            setLoading(true);
            try {
                // API tìm kiếm: /api/movies/?search={query}
                const res = await fetch(`http://127.0.0.1:8000/api/movies/?search=${query}`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

                const data = await res.json();

                const updatedResults = data.map(item => ({
                    ...item,
                    thumb: item.thumb?.startsWith('http') ? item.thumb : `http://127.0.0.1:8000${item.thumb}`,
                }));

                setResults(updatedResults);
                setLoading(false);
            } catch (error) {
                console.error("Lỗi khi tìm kiếm:", error);
                setLoading(false);
            }
        };

        // Delay nhẹ để tránh gọi API quá nhanh
        const timer = setTimeout(() => {
            fetchSearch();
        }, 300);

        return () => clearTimeout(timer);

    }, [query]);

    return (
        <div className='bg-black/90 min-h-screen'>
            {isLoggedIn ? <Header2 /> : <Header />}
            <div className="max-w-7xl mx-auto py-20 px-4 text-white">
                <h1 className="text-4xl font-extrabold mb-8 flex items-center">
                    <FaSearch className="mr-3 text-red-700" /> Kết quả tìm kiếm cho: "{query || '...'}"
                </h1>

                {loading ? (
                    <div className="text-center text-gray-400">Đang tìm kiếm...</div>
                ) : results.length === 0 ? (
                    <div className="text-center text-gray-400">Không tìm thấy phim nào phù hợp với từ khóa "{query}".</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {results.map(movie => (
                            <a href={`/movie/${movie.id}`} key={movie.id} className="block group">
                                <img src={movie.thumb} alt={movie.title} className="w-full h-auto object-cover rounded-lg group-hover:opacity-80 transition duration-300" />
                                <p className="mt-2 text-md font-semibold text-center">{movie.title}</p>
                            </a>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default SearchResultPage;