🎬 Web Xem Phim – Movie Streaming Website
<p align="center"> <i>Nền tảng xem phim trực tuyến hiện đại – giao diện đẹp, tốc độ cao, dễ mở rộng.</i> </p> <p align="center"> <img src="https://img.shields.io/badge/status-developing-blue?style=for-the-badge"> <img src="https://img.shields.io/badge/frontend-ReactJS-blue?style=for-the-badge"> <img src="https://img.shields.io/badge/style-TailwindCSS-cyan?style=for-the-badge"> <img src="https://img.shields.io/badge/backend-Django-green?style=for-the-badge"> <img src="https://img.shields.io/badge/database-PostgreSQL-blue?style=for-the-badge"> </p>
🚀 Giới thiệu

Web Xem Phim là website xem phim trực tuyến với mục tiêu mang lại trải nghiệm mượt mà và hiện đại tương tự:

Netflix

VieON

FPT Play

Phimmoi

Hệ thống hỗ trợ:

Xem phim chất lượng cao (480p / 720p / 1080p)

Danh sách phim theo thể loại, quốc gia, năm

Chi tiết phim + trailer

Bộ sưu tập "Yêu thích"

Lịch sử xem phim

Đánh giá, bình luận

Trang admin để quản lý nội dung và người dùng

🧩 Công nghệ sử dụng
🎨 Frontend – ReactJS

React 18

React Router DOM

Axios

TailwindCSS

Zustand / Redux Toolkit

React Player

⚙️ Backend – Django

Django Framework

Django REST Framework (DRF)

JWT Authentication

Django Admin

Django CORS headers

🗄 Database – PostgreSQL

PostgreSQL 14+

Django ORM

🔐 Authentication

JSON Web Token (JWT)

Refresh Token / Access Token

🚀 Triển khai

Backend: Ubuntu VPS (Nginx + Gunicorn + Supervisor)

Frontend: Vercel / Netlify

Database: Supabase / Render / PostgreSQL VPS

📁 Cấu trúc thư mục
project/
│── docs/
│   ├── 01_step_1.md
│   ├── 02_step_2.md
│   
│      
│
│── backend/        # Django API
│   ├── core/
│   ├── movies/
│   ├── users/
│   ├── requirements.txt
│   └── manage.py
│
│── frontend/       # ReactJS + Tailwind
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md

🧪 Tính năng
👤 Người dùng

Đăng ký / đăng nhập (JWT)

Xem phim + chọn tập

Thêm phim vào danh sách thích

Ghi nhớ tập đang xem

Lịch sử xem

Bình luận & rating

🛠 Admin

CRUD phim

CRUD tập phim

CRUD thể loại

Quản lý user

Dashboard thống kê

🏗 Hướng dẫn chạy dự án
1️⃣ Backend (Django)
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
source venv/bin/activate   # Linux/macOS

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

2️⃣ Frontend (ReactJS)
cd frontend
npm install
npm run start

❤️ Đóng góp

Mọi đóng góp đều được hoan nghênh!
Bạn có thể:

Tạo Issue

Gửi Pull Request

Thảo luận thêm tính năng mới
