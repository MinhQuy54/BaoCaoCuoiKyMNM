// src/component/HLSPlayer.jsx

import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

/**
 * Component trình phát video sử dụng HLS.js để xử lý luồng M3U8.
 *
 * @param {string} streamUrl - URL của luồng HLS (M3U8) từ proxy backend Django.
 * @param {string} movieTitle - Tiêu đề phim (dùng cho thuộc tính title/alt).
 */
const HLSPlayer = ({ streamUrl, movieTitle }) => {
    // 1. Dùng useRef để giữ tham chiếu đến phần tử <video>
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !streamUrl) return;

        // Xóa bất kỳ nguồn stream cũ nào
        video.src = "";

        // 2. Kiểm tra nếu trình duyệt có hỗ trợ HLS native (Safari/iOS)
        const isHlsSupported = video.canPlayType('application/vnd.apple.mpegurl');

        if (Hls.isSupported()) {
            // 3. Sử dụng hls.js cho trình duyệt không hỗ trợ native (Chrome/Firefox)
            const hls = new Hls();

            // Gắn URL stream (proxy) vào hls.js
            hls.loadSource(streamUrl);
            hls.attachMedia(video);

            // Xử lý lỗi hls.js nếu cần
            hls.on(Hls.Events.ERROR, function (event, data) {
                if (data.fatal) {
                    console.error('HLS Fatal Error:', data.details);
                    // Có thể thử tải lại hoặc chuyển sang chế độ khác
                }
            });

            // Cleanup function khi component unmount
            return () => {
                hls.destroy();
            };

        } else if (isHlsSupported) {
            // 4. Sử dụng HLS native của trình duyệt (thường là Safari)
            video.src = streamUrl;
            video.addEventListener('loadedmetadata', () => {
                video.play();
            });
        } else {
            // 5. Nếu không hỗ trợ HLS hoàn toàn
            console.error("Trình duyệt không hỗ trợ HLS.");
            // Có thể thêm fallback UI ở đây
        }

    }, [streamUrl]); // Chạy lại khi streamUrl thay đổi

    return (
        <video
            ref={videoRef}
            className="w-full h-full object-cover"
            controls
            autoPlay // Tự động phát
            playsInline // Cho phép phát nội tuyến trên thiết bị di động
            title={`Phim: ${movieTitle}`}
        >
            <p>Trình duyệt của bạn không hỗ trợ video HTML5.</p>
        </video>
    );
};

export default HLSPlayer;