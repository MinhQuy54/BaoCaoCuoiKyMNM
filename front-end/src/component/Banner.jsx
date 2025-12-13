import { FaPlay, FaHeart, FaInfoCircle } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, Autoplay } from "swiper/modules";
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import QuickDetailModal from "./QuickDetailModal"; // Import Modal
import "swiper/css";
import "swiper/css/thumbs";
import "./banner.css";

const Banner = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null); // State cho modal
  const [favoriteStates, setFavoriteStates] = useState({}); // State cho yêu thích

  // Giả định người dùng đã đăng nhập nếu có accessToken
  const isLoggedIn = !!localStorage.getItem('accessToken');

  // Gọi API Django
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/movies/")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Lỗi khi fetch dữ liệu từ API Django");
        }
        return res.json();
      })
      .then((data) => {
        const updatedData = data.map(item => ({
          ...item,
          bg: item.bg?.startsWith('http')
            ? item.bg
            : `http://127.0.0.1:8000${item.bg}`,
          thumb: item.thumb?.startsWith('http')
            ? item.thumb
            : `http://127.0.0.1:8000${item.thumb}`,
        }));
        setMovies(updatedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  // Toggle (Thêm/Xóa) phim khỏi danh sách yêu thích
  const handleToggleFavorite = async (movieId) => {
    if (!isLoggedIn) {
      alert("Vui lòng đăng nhập để thêm vào danh sách yêu thích!");
      return;
    }

    const token = localStorage.getItem('accessToken');
    // Sử dụng giá trị hiện tại trong state để xác định hành động
    const isCurrentlyFavorite = favoriteStates[movieId];
    const method = isCurrentlyFavorite ? 'DELETE' : 'POST';

    try {
      // Giả định API favorites nhận POST để thêm, DELETE để xóa
      const response = await fetch(`http://127.0.0.1:8000/api/favorites/${movieId}/`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        // Body chỉ cần cho POST (tùy thuộc API Django)
        body: method === 'POST' ? JSON.stringify({ movie_id: movieId }) : null
      });

      if (response.ok || response.status === 204) {
        // Cập nhật trạng thái yêu thích trong local state
        setFavoriteStates(prev => ({
          ...prev,
          [movieId]: !isCurrentlyFavorite
        }));
        alert(isCurrentlyFavorite ? "Đã xóa khỏi danh sách yêu thích!" : "Đã thêm vào danh sách yêu thích!");
      } else {
        console.error("Lỗi khi toggle yêu thích:", response.status);
        alert("Lỗi khi thực hiện hành động yêu thích.");
      }
    } catch (error) {
      console.error("Lỗi mạng:", error);
      alert("Lỗi mạng khi cập nhật yêu thích.");
    }
  };

  const handleInfoClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleModalClose = () => {
    setSelectedMovie(null);
  };


  if (loading) {
    return <p className="text-white text-center mt-10">Đang tải dữ liệu phim...</p>;
  }

  return (
    <div className="w-full h-[800px] relative">
      <Swiper
        modules={[Thumbs, Autoplay]}
        thumbs={{ swiper: thumbsSwiper }}
        className="w-full h-[800px] mb-4 overflow-hidden"
        spaceBetween={10}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false
        }}
      >
        {movies.map((m, idx) => (
          <SwiperSlide key={idx}>
            <div
              className="w-full h-[800px] bg-no-repeat bg-cover relative"
              style={{
                backgroundImage: `url(${m.bg})`,
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/50 to-transparent "></div>
              <div className="w-full h-full flex items-center justify-center space-x-[30px] p-4 ml-8 relative z-10">
                <div className="flex flex-col space-y-5 items-baseline w-[50%] absolute left-4">
                  <p className="text-white text-xl py-2 px-4 bg-gradient-to-r from-red-700 to-white">
                    Phim bộ mới
                  </p>

                  <h2 className="text-5xl text-white font-bold">{m.title}</h2>

                  <div className="flex items-center space-x-2">
                    <p className="text-black text-xl py-2 px-4 bg-white rounded-md">{m.age || 'T16'}</p>
                    <p className="text-white text-xl py-2 px-4 bg-black rounded-md">{m.year || 'N/A'}</p>
                    <p className="text-white text-xl py-2 px-4 bg-black rounded-md">{m.duration || m.episodes || 'N/A'}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {m.tags?.map((tag, i) => (
                      <p
                        key={i}
                        className="text-white text-xl py-2 px-4 bg-transparent border rounded-md"
                      >
                        {tag}
                      </p>
                    ))}
                  </div>

                  <p className="text-white line-clamp-3 w-[70%]">{m.desc || m.description}</p>

                  <div className="pl-10 flex items-center space-x-20 justify-center">
                    {/* Nút Play -> Chi tiết phim */}
                    <Link
                      to={`/movie/${m.id}`}
                      className="flex items-center justify-center 
                                            w-20 h-20 rounded-full text-2xl
                                            border-2 border-red-700 text-white bg-red-700
                                            hover:bg-red-600 hover:text-white hover:border-white
                                            transition-all duration-300 ease-in-out 
                                            transform hover:scale-110"
                    >
                      <FaPlay />
                    </Link>

                    <div className="flex items-center justify-center space-x-10 text-2xl shadow-lg bg-black/40 border-gray-400 
                                            text-white border-2 rounded-full px-8 py-4">

                      {/* Nút Yêu thích -> Gọi hàm Toggle */}
                      <button
                        onClick={() => handleToggleFavorite(m.id)}
                        className={`transition-all duration-300 ease-in-out transform hover:scale-125 
                                                    ${favoriteStates[m.id] ? 'text-red-500' : 'text-white hover:text-red-500'}`}
                      >
                        <FaHeart />
                      </button>

                      {/* Nút Info -> Mở Modal */}
                      <button
                        onClick={() => handleInfoClick(m)}
                        className="hover:text-yellow-500 transition-all duration-300 ease-in-out transform hover:scale-125"
                      >
                        <FaInfoCircle />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnail Swiper */}
      <div className="absolute bottom-20 right-10 w-[50%] z-20">
        <Swiper
          onSwiper={setThumbsSwiper}
          modules={[Thumbs]}
          slidesPerView={5}
          spaceBetween={10}
          watchSlidesProgress
          className="w-full h-[100px]"
        >
          {movies.map((m, idx) => (
            <SwiperSlide key={idx}>
              <img
                src={m.thumb}
                alt={m.title}
                className="w-full h-full object-cover rounded-lg cursor-pointer opacity-70 hover:opacity-100 transition"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Modal Chi tiết Nhanh */}
      {selectedMovie && (
        <QuickDetailModal
          movie={selectedMovie}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default Banner;