import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'
import { Link } from 'react-router-dom' // <-- Import Link

import 'swiper/css'
import 'swiper/css/navigation'

function MoviesList({ title, data }) {
    return (
        <div className='text-white  p-4 mt-4 ml-12 mb-10'>
            <h2 className='text-3xl font-bold mb-10'>
                {title}
            </h2>
            <Swiper
                className="w-full"
                modules={[Navigation, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                navigation
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                loop={true}
                breakpoints={{
                    320: { slidesPerView: 1 },
                    480: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                    1280: { slidesPerView: 5 },
                }}
            >
                {data.length > 0 && data.map((item) => (
                    <SwiperSlide key={item.id} className=" h-[300px] relative group">
                        <Link to={`/movie/${item.id}`} className="block w-full h-full"> {/* <-- Điều hướng */}
                            <div className="w-full h-full group-hover:scale-105 transition transform duration-500 ease-in-out cursor-pointer">
                                <img loading='lazy'
                                    src={item.thumb}
                                    alt={item.title}
                                    className='w-full h-full object-cover ' />
                                <div className="absolute inset-0 bg-black/40"></div>
                                <div className="absolute bottom-4 left-0 w-full text-center">
                                    <p className='uppercase text-md'>
                                        {item.title}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default MoviesList