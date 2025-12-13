// src/App.jsx

import { useState, useEffect } from 'react'
import Header from './component/Header'
import Header2 from './component/Header2'
import Banner from './component/Banner'
import Chude from './component/Chude'
import MoviesList from './component/MoviesList'
import Footer from './component/Footer'
import TopComment from './component/TopComment'
import RankingSection from './component/RankingSection'
import NewComments from './component/NewComments'


// Định nghĩa URL cơ sở để dễ quản lý
const API_BASE_URL = "http://127.0.0.1:8000";


function App() {
  const [movie, setMovie] = useState([])
  const [movieRated, setMovieRated] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true);

  // Kiểm tra trạng thái đăng nhập khi khởi động
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch dữ liệu phim
  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/movies/`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();

        // Xử lý đường dẫn ảnh để đảm bảo chúng là absolute URL
        const updated = data.map(item => ({
          ...item,
          bg: item.bg?.startsWith('http')
            ? item.bg
            : `${API_BASE_URL}${item.bg}`,
          thumb: item.thumb?.startsWith('http')
            ? item.thumb
            : `${API_BASE_URL}${item.thumb}`,
        }));

        // Chia dữ liệu thành hai phần bằng nhau cho hai MoviesList
        const half = Math.ceil(updated.length / 2);
        setMovie(updated.slice(0, half));
        setMovieRated(updated.slice(half));
      } catch (error) {
        console.error("Lỗi khi fetch từ Django:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, []);




  return (
    <div className='bg-black/90 overflow-x-hidden min-h-screen text-white'>
      {/* HEADER */}
      {isLoggedIn ? (
        <Header2 />
      ) : (
        <Header />
      )}

      {/* NỘI DUNG CHÍNH */}
      {renderContent()}

      {/* FOOTER */}
      <Footer />
    </div>
  )
}

// Export mặc định hợp lệ
export default App;