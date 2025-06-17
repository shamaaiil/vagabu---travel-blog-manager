import React, { useState, useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
} from "lucide-react";
import { useGetQuery } from "@/services/apiService";

const PhotoGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);

  const {
    data: gallery,
    isLoading,
    error,
  } = useGetQuery({
    path: "/gallery",
  });

  // Process API data when it arrives
  useEffect(() => {
    console.log("Raw API response:", gallery);
    console.log("Loading state:", isLoading);
    console.log("Error state:", error);

    if (gallery) {
      // Handle different possible API response formats
      let processedImages = [];

      if (Array.isArray(gallery)) {
        // Direct array response
        processedImages = gallery;
      } else if (gallery.data && Array.isArray(gallery.data)) {
        // Nested data response
        processedImages = gallery.data;
      } else if (gallery.images && Array.isArray(gallery.images)) {
        // Images property response
        processedImages = gallery.images;
      }

      console.log("Processed images:", processedImages);
      setImages(processedImages);
    }
  }, [gallery, isLoading, error]);

  const openModal = (image, index) => {
    console.log("Opening modal with:", image, "at index:", index);
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (images.length === 0) return;
    const newIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const prevImage = () => {
    if (images.length === 0) return;
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Function to get image URL from different possible property names
  const getImageUrl = (imageObj) => {
    return (
      imageObj.image || imageObj.src || imageObj.url || imageObj.photo || ""
    );
  };

  // Function to get image alt text
  const getImageAlt = (imageObj, index) => {
    return (
      imageObj.alt ||
      imageObj.title ||
      imageObj.name ||
      `Gallery image ${index + 1}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold text-blue font-dancingScript mb-2">Photo Gallery</h1>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* Gallery Grid */}
      {!isLoading && !error && images.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => {
              const imageUrl = getImageUrl(image);
              const imageAlt = getImageAlt(image, index);

              console.log(`Image ${index}:`, {
                imageUrl,
                imageAlt,
                rawImage: image,
              });

              return (
                <div
                  key={image.id || index}
                  className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-gray-200 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => openModal(image, index)}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={imageAlt}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        console.error("Image failed to load:", imageUrl);
                        e.target.style.display = "none";
                      }}
                      onLoad={() => {
                        console.log("Image loaded successfully:", imageUrl);
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300">
                      <p className="text-gray-600">No Image</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          onClick={handleBackdropClick}
        >
          <div className="relative max-w-4xl w-full max-h-full bg-white rounded-2xl overflow-hidden shadow-2xl">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation buttons */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all duration-200"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all duration-200"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image container */}
            <div className="flex flex-col md:flex-row max-h-screen">
              {/* Image */}
              <div className="flex-1 flex items-center justify-center bg-black">
                <img
                  src={getImageUrl(selectedImage)}
                  alt={getImageAlt(selectedImage, currentIndex)}
                  className="w-full max-w-[700px] max-h-[700px] object-cover mx-auto rounded-xl"
                />
              </div>

              {/* Instagram-style sidebar */}
              <div className="w-full md:w-80 bg-white flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 flex items-center">
                  <img src="/public/img/gallery1.jpeg" className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm"/>
                    
                  
                  <span className="ml-3 font-semibold text-gray-800">
                    mountaindiarygirl
                  </span>
                </div>

                {/* Actions */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex space-x-4">
                      <Heart className="w-6 h-6 cursor-pointer hover:text-red-500 transition-colors" />
                      <MessageCircle className="w-6 h-6 cursor-pointer hover:text-blue-500 transition-colors" />
                      <Send className="w-6 h-6 cursor-pointer hover:text-blue-500 transition-colors" />
                    </div>
                    <Bookmark className="w-6 h-6 cursor-pointer hover:text-yellow-500 transition-colors" />
                  </div>
                  <p className="font-semibold text-sm text-gray-800">
                    {selectedImage.likes
                      ? selectedImage.likes.toLocaleString()
                      : "0"}{" "}
                    likes
                  </p>
                </div>

                {/* Caption */}
                <div className="p-4 flex-1">
                  <p className="text-sm">
                    <span className="font-semibold text-gray-800">
                      photo_gallery
                    </span>{" "}
                    <span className="text-gray-700">
                      {selectedImage.caption}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
