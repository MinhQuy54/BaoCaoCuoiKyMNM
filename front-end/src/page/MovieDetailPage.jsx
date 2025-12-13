// src/page/MovieDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header2 from '../component/Header2';
import Header from '../component/Header';
import Footer from '../component/Footer';
import { FaStar, FaPlayCircle, FaHeart, FaShareAlt } from 'react-icons/fa';

/**
 * MovieDetailPage (FULL)
 * - fetch movie detail
 * - fetch comments (GET)
 * - post comment (POST) with auth
 * - reply to comment (POST with parent)
 * - auto-refresh access token on expiry (uses refresh token stored in localStorage under 'refreshToken')
 *
 * IMPORTANT:
 * Backend must return comments with nested `replies` and `user` object:
 * comment = { id, content, created_at, user: { id, username }, replies: [...] }
 * If backend returns different shape, adapt parsing accordingly.
 */

const TOKEN_REFRESH_URL = "http://127.0.0.1:8000/api/token/refresh/"; // đổi nếu cần

// Convert Youtube url -> embed
const getEmbedUrl = (url) => {
    if (!url) return null;
    let videoId = null;
    let finalUrl = url;
    let watchMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|\w+\/|watch\?v=))([^&]+)/);
    if (watchMatch && watchMatch[1]) videoId = watchMatch[1];
    let shortMatch = url.match(/(?:youtu\.be\/)([^?]+)/);
    if (shortMatch && shortMatch[1] && !videoId) videoId = shortMatch[1];
    if (videoId) finalUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    else if (url.includes('youtube.com/embed/')) finalUrl = url.includes('?') ? `${url}&autoplay=1&rel=0` : `${url}?autoplay=1&rel=0`;
    return finalUrl;
};

const MovieDetailPage = () => {
    const { id } = useParams();

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('accessToken'));
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [replyTo, setReplyTo] = useState(null); // comment id đang trả lời
    const [replyContent, setReplyContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showTrailerModal, setShowTrailerModal] = useState(false);

    // Helper: refresh access token using refresh token
    const tryRefreshToken = async () => {
        const refresh = localStorage.getItem('refreshToken');
        if (!refresh) return false;
        try {
            const res = await fetch(TOKEN_REFRESH_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh })
            });
            if (!res.ok) return false;
            const data = await res.json();
            if (data.access) {
                localStorage.setItem('accessToken', data.access);
                // keep previous refresh token (some setups send new refresh - handle if backend returns one)
                if (data.refresh) localStorage.setItem('refreshToken', data.refresh);
                setIsLoggedIn(true);
                return true;
            }
            return false;
        } catch (e) {
            console.error('Refresh token error', e);
            return false;
        }
    };

    // Wrapper để POST có retry khi token expired
    const postWithAuth = async (url, bodyObj) => {
        const doRequest = async () => {
            const token = localStorage.getItem('accessToken');
            return fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify(bodyObj)
            });
        };

        let res = await doRequest();
        if (res.status === 401) {
            // try refresh once
            const refreshed = await tryRefreshToken();
            if (refreshed) {
                res = await doRequest();
            }
        }
        return res;
    };

    // Fetch comments
    const fetchComments = async () => {
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/movies/${id}/comments/`);
            if (!res.ok) {
                console.error('Lỗi khi fetch comments', res.status);
                return;
            }
            const data = await res.json();
            setComments(data);
        } catch (e) {
            console.error('Lỗi fetchComments', e);
        }
    };

    // Fetch movie detail
    useEffect(() => {
        const fetchMovieDetail = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:8000/api/movies/${id}/`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                const updatedMovie = {
                    ...data,
                    bg: data.bg?.startsWith('http') ? data.bg : `http://127.0.0.1:8000${data.bg}`,
                    thumb: data.thumb?.startsWith('http') ? data.thumb : `http://127.0.0.1:8000${data.thumb}`,
                };
                setMovie(updatedMovie);
            } catch (e) {
                console.error('fetchMovieDetail error', e);
            } finally {
                setLoading(false);
            }
        };
        fetchMovieDetail();
        fetchComments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Close trailer modal with ESC
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && showTrailerModal) setShowTrailerModal(false);
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [showTrailerModal]);

    // Post comment or reply
    const handleSubmitComment = async (e, parentId = null) => {
        e.preventDefault();
        if (!isLoggedIn) {
            alert('Vui lòng đăng nhập để bình luận.');
            return;
        }
        const content = parentId ? replyContent : newComment;
        if (!content || !content.trim()) return;

        setIsSubmitting(true);
        try {
            const res = await postWithAuth(`http://127.0.0.1:8000/api/movies/${id}/comments/`, {
                content: content.trim(),
                ...(parentId ? { parent: parentId } : {})
            });

            if (res.ok) {
                // success -> reload comments
                await fetchComments();
                if (parentId) {
                    setReplyContent('');
                    setReplyTo(null);
                } else {
                    setNewComment('');
                }
            } else {
                // try to parse body for error message
                let err = {};
                try { err = await res.json(); } catch (e) { /* ignore */ }
                // handle 401 specifically
                if (res.status === 401) {
                    alert('Token không hợp lệ hoặc hết hạn. Vui lòng đăng nhập lại.');
                    setIsLoggedIn(false);
                } else {
                    alert('Lỗi khi gửi bình luận: ' + JSON.stringify(err));
                }
            }
        } catch (e) {
            console.error('submit comment error', e);
            alert('Lỗi mạng khi gửi bình luận.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="bg-black/90 min-h-screen text-white flex justify-center items-center">Đang tải...</div>;
    if (!movie) return <div className="bg-black/90 min-h-screen text-white flex justify-center items-center">Không tìm thấy phim.</div>;

    return (
        <div className="bg-black/90 min-h-screen">
            {isLoggedIn ? <Header2 /> : <Header />}

            {/* Banner */}
            <div className="relative h-[600px] w-full" style={{ backgroundImage: `url(${movie.bg})`, backgroundSize: 'cover', backgroundPosition: 'center', paddingTop: '64px' }}>
                <div className="absolute inset-0 bg-black/70"></div>

                <div className="relative z-10 max-w-7xl mx-auto p-8 flex items-end h-full">
                    <img src={movie.thumb} alt={movie.title} className="w-64 h-96 object-cover rounded-lg shadow-2xl mr-10 transform translate-y-16" />

                    <div className="text-white mb-20">
                        <h1 className="text-6xl font-extrabold mb-3">{movie.title}</h1>
                        <div className="flex items-center space-x-4 mb-4 text-xl">
                            <span className="flex items-center">
                                <FaStar className="text-yellow-500 mr-2" />
                                {movie.average_rating ? movie.average_rating : 'N/A'}
                            </span>
                            <span>| {movie.year}</span>
                            <span>| {movie.duration || 'N/A'}</span>
                            <span>| {movie.language || 'N/A'}</span>
                        </div>
                        <p className="mb-4 text-gray-300 max-w-3xl line-clamp-3">{movie.desc}</p>

                        <div className="flex items-center space-x-4 mt-6">
                            {movie.video_url ? (
                                <Link to={`/watch/${movie.id}`} className="flex items-center px-6 py-3 bg-red-700 text-white rounded-full text-lg font-semibold hover:bg-red-600 transition duration-300">
                                    <FaPlayCircle className="mr-3 text-2xl" /> XEM NGAY
                                </Link>
                            ) : (
                                <button className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-full text-lg font-semibold cursor-not-allowed">
                                    <FaPlayCircle className="mr-3 text-2xl" /> CHƯA CÓ PHIM
                                </button>
                            )}

                            {movie.trailer_url && (
                                <button onClick={() => setShowTrailerModal(true)} className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-full text-lg font-semibold hover:bg-gray-400 transition duration-300">
                                    <FaPlayCircle className="mr-3 text-2xl" /> XEM TRAILER
                                </button>
                            )}

                            <button className="p-4 bg-gray-700 rounded-full hover:bg-gray-600 transition">
                                <FaHeart className="text-white text-xl" />
                            </button>
                            <button className="p-4 bg-gray-700 rounded-full hover:bg-gray-600 transition">
                                <FaShareAlt className="text-white text-xl" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto p-8 pt-20 text-white">
                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2">
                        <h2 className="text-3xl font-bold mb-4 border-b border-gray-700 pb-2">Nội dung chi tiết</h2>
                        <p className="text-gray-300 leading-relaxed mb-6">{movie.desc}</p>

                        {/* COMMENTS SECTION */}
                        <div className="mt-8">
                            <h3 className="text-2xl font-bold mb-4">Đánh giá & Bình luận ({comments.length})</h3>

                            {/* form comment chính */}
                            <form onSubmit={(e) => handleSubmitComment(e, null)} className="bg-gray-800 p-4 rounded-lg mb-6">
                                <textarea
                                    className="w-full p-3 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-700"
                                    rows="3"
                                    placeholder={isLoggedIn ? "Viết bình luận của bạn..." : "Vui lòng đăng nhập để bình luận"}
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    disabled={!isLoggedIn || isSubmitting}
                                />
                                <button
                                    type="submit"
                                    className={`mt-2 px-4 py-2 rounded-lg font-semibold transition ${isLoggedIn && newComment.trim() && !isSubmitting ? 'bg-red-700 hover:bg-red-600' : 'bg-gray-500 cursor-not-allowed'}`}
                                    disabled={!isLoggedIn || !newComment.trim() || isSubmitting}
                                >
                                    {isSubmitting ? 'Đang gửi...' : 'Gửi Bình Luận'}
                                </button>
                            </form>

                            {/* list comments */}
                            <div className="space-y-4">
                                {comments.length > 0 ? comments.map(comment => (
                                    <div key={comment.id} className="bg-gray-800 p-4 rounded-lg border-l-4 border-red-700">
                                        <p className="font-semibold text-red-400">{comment.user ? comment.user.username : 'Ẩn danh'}</p>
                                        <p className="text-sm text-gray-500 mb-2">{new Date(comment.created_at).toLocaleString()}</p>
                                        <p className="text-gray-300">{comment.content}</p>

                                        {/* reply button */}
                                        {isLoggedIn && (
                                            <button className="text-blue-400 text-sm mt-2 hover:underline" onClick={() => {
                                                setReplyTo(comment.id);
                                                setReplyContent('');
                                            }}>
                                                Trả lời
                                            </button>
                                        )}

                                        {/* reply form */}
                                        {replyTo === comment.id && (
                                            <form onSubmit={(e) => handleSubmitComment(e, comment.id)} className="mt-3 ml-6">
                                                <textarea
                                                    rows="2"
                                                    className="w-full p-2 bg-gray-700 text-white rounded"
                                                    placeholder="Nhập trả lời..."
                                                    value={replyContent}
                                                    onChange={(e) => setReplyContent(e.target.value)}
                                                    disabled={isSubmitting}
                                                />
                                                <div className="mt-2">
                                                    <button type="submit" className="bg-red-700 px-3 py-1 rounded mr-2">{isSubmitting ? 'Đang gửi...' : 'Gửi trả lời'}</button>
                                                    <button type="button" className="text-gray-300" onClick={() => { setReplyTo(null); setReplyContent(''); }}>Hủy</button>
                                                </div>
                                            </form>
                                        )}

                                        {/* replies */}
                                        {comment.replies && comment.replies.length > 0 && (
                                            <div className="mt-4 ml-6 border-l border-gray-700 pl-4 space-y-3">
                                                {comment.replies.map(reply => (
                                                    <div key={reply.id} className="bg-gray-700 p-3 rounded">
                                                        <p className="text-red-300 font-semibold">{reply.user ? reply.user.username : 'Ẩn danh'}</p>
                                                        <p className="text-sm text-gray-400">{new Date(reply.created_at).toLocaleString()}</p>
                                                        <p className="text-gray-200 mt-1">{reply.content}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )) : (
                                    <p className="text-gray-500 text-center">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-span-1">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                            <h3 className="text-2xl font-bold mb-4 text-red-700">Thông tin Phim</h3>
                            <p className="mb-2"><span className="font-semibold text-gray-400">Đạo diễn:</span> {movie.director}</p>
                            <p className="mb-2"><span className="font-semibold text-gray-400">Diễn viên:</span> {movie.cast || 'N/A'}</p>
                            <p className="mb-2"><span className="font-semibold text-gray-400">Thể loại:</span> {movie.categories && Array.isArray(movie.categories) ? movie.categories.map(c => c.name).join(', ') : 'N/A'}</p>
                            <p className="mb-2"><span className="font-semibold text-gray-400">Tags:</span> {movie.tags ? movie.tags.join(', ') : 'N/A'}</p>
                            <p className="mb-2"><span className="font-semibold text-gray-400">Quốc gia:</span> {movie.release_country || 'Unknown'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

            {/* MODAL TRAILER */}
            {showTrailerModal && movie.trailer_url && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4" onClick={() => setShowTrailerModal(false)}>
                    <div className="w-full max-w-4xl relative" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setShowTrailerModal(false)} className="absolute -top-10 right-0 text-white text-3xl font-bold p-2 z-50 hover:text-red-500">&times;</button>
                        <div className="relative pt-[56.25%] rounded-lg overflow-hidden shadow-2xl">
                            <iframe
                                className="absolute top-0 left-0 w-full h-full"
                                src={getEmbedUrl(movie.trailer_url)}
                                title={`${movie.title} Trailer`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieDetailPage;
