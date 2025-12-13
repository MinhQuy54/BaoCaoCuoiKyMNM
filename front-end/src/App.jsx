import { useState, useEffect } from 'react'
import Header from './component/Header' // Giả sử là Header chưa đăng nhập (Header1)
import Header2 from './component/Header2' // Header đã đăng nhập
import Banner from './component/Banner'
import Chude from './component/Chude'
import MoviesList from './component/MoviesList'
import Footer from './component/Footer'
import LoginModal from './component/LoginModal'
import RegisterModal from './component/RegisterModal'


function App() {
  const [movie, setMovie] = useState([])
  const [movieRated, setMovieRated] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Modals (Đã được giữ lại nếu bạn vẫn muốn dùng Modal thay vì trang Login riêng)
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)

  // Kiểm tra trạng thái đăng nhập khi khởi động
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Fetch dữ liệu phim (giữ nguyên logic xử lý ảnh)
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/movies/");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();

        const updated = data.map(item => ({
          ...item,
          bg: item.bg?.startsWith('http')
            ? item.bg
            : `http://127.0.0.1:8000${item.bg}`,
          thumb: item.thumb?.startsWith('http')
            ? item.thumb
            : `http://127.0.0.1:8000${item.thumb}`,
        }));

        const half = Math.ceil(updated.length / 2);
        setMovie(updated.slice(0, half));
        setMovieRated(updated.slice(half));
      } catch (error) {
        console.error("Lỗi khi fetch từ Django:", error);
      }
    };

    fetchMovie();
  }, []);

  // Xử lý Modal (Bạn cần đảm bảo Header chưa đăng nhập gọi đúng các hàm này)
  const handleLoginOpen = () => setLoginOpen(true)
  const handleLoginClose = () => setLoginOpen(false)
  const handleRegisterOpen = () => {
    setRegisterOpen(true)
    setLoginOpen(false)
  }
  const handleRegisterClose = () => setRegisterOpen(false)


  return (
    <div className='bg-black/90 overflow-x-hidden'>
      {isLoggedIn ? (
        <Header2 />
      ) : (
        <Header onLoginClick={handleLoginOpen} onRegisterClick={handleRegisterOpen} />
      )}

      <Banner />
      <Chude />
      <MoviesList title="Phim nổi bật" data={movie} />
      <MoviesList title="Phim mới" data={movieRated} />

      {loginOpen && <LoginModal onClose={handleLoginClose} onRegisterClick={handleRegisterOpen} />}
      {registerOpen && <RegisterModal onClose={handleRegisterClose} />}

      <Footer />
    </div>
  )
}

export default App