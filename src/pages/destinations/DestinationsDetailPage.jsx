import { useGetQuery } from "@/services/apiService";
import Header from "@/ui/Header";
import React from "react";
import { useParams } from "react-router-dom";
import { 
  FaMapMarkerAlt, FaTags, FaCalendarAlt, FaBlog, FaPlay, FaHeart, 
  FaShare, FaCamera, FaStar, FaArrowLeft, FaGlobe, FaThermometerHalf, 
  FaUmbrella, FaSun, FaEye, FaClock, FaUsers, FaRoute, FaPhone, 
  FaWifi, FaUtensils, FaBed, FaTree, FaMountain, FaWater, FaBookmark,
  FaInfo, FaLeaf, FaSnowflake, FaInfoCircle
} from "react-icons/fa";
import BackButton from "@/ui/BackButton";

function DestinationsDetailPage() {
  const { slug } = useParams();
  const { data: destinations, isLoading, error } = useGetQuery({ path: "/destinations" });
  const [isLiked, setIsLiked] = React.useState(false);
  const [isBookmarked, setIsBookmarked] = React.useState(false);

  React.useEffect(() => {
    console.log("Slug from URL:", slug);
    console.log("Destinations data:", destinations);
  }, [slug, destinations]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-grey flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue text-lg font-medium">Loading destination details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-grey flex items-center justify-center">
        <div className="text-center bg-white rounded-xl p-8 shadow-lg border border-pastelgrey">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaInfoCircle className="text-red-500 text-2xl" />
          </div>
          <h2 className="text-blue text-xl font-semibold mb-2">Error Loading Destination</h2>
          <p className="text-gray-600">Unable to load destination details. Please try again.</p>
        </div>
      </div>
    );
  }

  const destination = destinations?.find((d) => d.slug === slug);
  if (!destination) {
    return (
      <div className="min-h-screen bg-grey flex items-center justify-center">
        <div className="text-center bg-white rounded-xl p-8 shadow-lg border border-pastelgrey">
          <div className="w-16 h-16 bg-pastelgrey rounded-full flex items-center justify-center mx-auto mb-4">
            <FaMapMarkerAlt className="text-blue text-2xl" />
          </div>
          <h2 className="text-blue text-xl font-semibold mb-2">Destination Not Found</h2>
          <p className="text-gray-600">No destination found for: {slug}</p>
        </div>
      </div>
    );
  }

  const getSeasonIcon = (season) => {
    if (season?.toLowerCase().includes('summer')) return FaSun;
    if (season?.toLowerCase().includes('winter')) return FaSnowflake;
    if (season?.toLowerCase().includes('spring')) return FaLeaf;
    if (season?.toLowerCase().includes('autumn')) return FaTree;
    return FaCalendarAlt;
  };

  const SeasonIcon = getSeasonIcon(destination.bestSeason);

  return (
    <div className="min-h-screen bg-grey">
       <Header title={destination.name}/>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <BackButton label="Go Back To Destinations"/>
        {/* Main Content Row - Image and Details Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12 items-center">
          {/* Image Section */}
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={destination.image || "/placeholder-image.jpg"}
                alt={destination.name}
                className="w-full h-96 lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center justify-between">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <FaMapMarkerAlt className="text-blue text-sm" />
                      <span className="text-blue text-sm font-medium">{destination.region}</span>
                    </div>
                  </div>
                 
                </div>
              </div>
            </div>
            
           
          </div>

          {/* Details Section */}
          <div className="space-y-8">
            {/* Title and Region */}
            <div className="">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-blue rounded-full"></div>
                <span className="text-blue text-sm uppercase tracking-wide">{destination.region}</span>
              </div>
              <h1 className="text-4xl lg:text-5xl text-blue mb-4 font-dancingScript font-semibold">
                {destination.name}
              </h1>
              <p className="text-gray-700 text-lg leading-relaxed">
                {destination.log}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Information Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seasonal Information */}
        


        </div>

        {/* Additional Information */}
        <div className="mt-12 rounded-2xl p-8 border border-pastelgrey">
          <h3 className="text-2xl font-semibold text-blue mb-6">About {destination.name}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-pastelgrey rounded-full flex items-center justify-center mx-auto mb-3">
                <FaMapMarkerAlt className="text-blue text-xl" />
              </div>
              <h4 className="font-semibold text-blue mb-2">Location</h4>
              <p className="text-gray-600 text-sm">{destination.region}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pastelgrey rounded-full flex items-center justify-center mx-auto mb-3">
                <SeasonIcon className="text-blue text-xl" />
              </div>
              <h4 className="font-semibold text-blue mb-2">Best Season</h4>
              <p className="text-gray-600 text-sm">{destination.bestSeason}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pastelgrey rounded-full flex items-center justify-center mx-auto mb-3">
                <FaTags className="text-blue text-xl" />
              </div>
              <h4 className="font-semibold text-blue mb-2">Activities</h4>
              <p className="text-gray-600 text-sm">{destination.type?.join(', ')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pastelgrey rounded-full flex items-center justify-center mx-auto mb-3">
                <FaBlog className="text-blue text-xl" />
              </div>
              <h4 className="font-semibold text-blue mb-2">Stories</h4>
              <p className="text-gray-600 text-sm">{destination.blogCount} Travel Stories</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DestinationsDetailPage;