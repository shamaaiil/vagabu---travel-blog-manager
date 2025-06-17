import React from "react";
import { useGetQuery } from "@/services/apiService";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { FaMapMarkerAlt, FaTags, FaCalendarAlt, FaBlog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function FearuredDestinations() {
 
  const { data: destinations, isLoading, error } = useGetQuery({ path: "/destinations" });
  const navigate = useNavigate()

  const handleDiscoverMore = (slug) => {
    navigate(`/destinations/${slug}`);
  };

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error loading destinations</div>;

  return (
    <div className=" mx-auto py-12 px-4">
      <h2 className="text-6xl font-bold text-blue font-dancingScript text-center my-8">
        Featured Destinations
      </h2>
      <Swiper
        modules={[Navigation, Pagination, Autoplay, A11y]}
        slidesPerView={1}
        spaceBetween={20}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 1, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 30 },
          1024: { slidesPerView: 4, spaceBetween: 40 },
        }}
        className="mySwiper"
      >
        {destinations?.filter((dest) => dest.featured === true).map((dest) => (
          <SwiperSlide key={dest.id}>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl">
              {/* Image */}
              <div className="relative h-64">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <h3 className="absolute bottom-4 left-4 text-xl font-semibold text-grey">
                  {dest.name}
                </h3>
              </div>
              {/* Content */}
              <div className="p-6 text-blue">
                <div className="flex items-center mb-3">
                  <FaMapMarkerAlt className="text-blue-600 mr-2" />
                  <span >{dest.region}</span>
                </div>
                <div className="flex items-center mb-3">
                  <FaTags className="text-blue-600 mr-2" />
                  <span >{dest.type.join(", ")}</span>
                </div>
                <div className="flex items-center mb-3">
                  <FaCalendarAlt className="text-blue-600 mr-2" />
                  <span >Best Season: {dest.bestSeason}</span>
                </div>
                <div className="flex items-center">
                  <FaBlog className="text-blue-600 mr-2" />
                  <span >{dest.blogCount} Blogs</span>
                </div>
                <button className="mt-4 w-full bg-blue text-pastelgrey py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                onClick={() => handleDiscoverMore(dest.slug)}
                >
                  Discover More
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default FearuredDestinations;