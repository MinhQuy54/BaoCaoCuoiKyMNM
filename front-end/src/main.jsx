import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Import các trang mới
import MovieDetailPage from './page/MovieDetailPage.jsx'
import VipRegistrationPage from './page/VipRegistrationPage.jsx'
import RankingPage from './page/RankingPage.jsx'
import SearchResultPage from './page/SearchResultPage.jsx'
import MoviePlayerPage from './page/MoviePlayerPage';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Trang chủ */}
        <Route path="/" element={<App />} />

        {/* Trang chi tiết phim */}
        <Route path="/movie/:id" element={<MovieDetailPage />} />

        {/* Trang Đăng ký VIP */}
        <Route path="/vip" element={<VipRegistrationPage />} />


        {/* Trang Bảng xếp hạng */}
        <Route path="/ranking" element={<RankingPage />} />

        {/* Trang Kết quả tìm kiếm */}
        <Route path="/search" element={<SearchResultPage />} />

        <Route path="/watch/:id" element={<MoviePlayerPage />} />
        {/* Bạn có thể thêm các route khác như /phimle, /phimbo, /genre/:name tại đây */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)