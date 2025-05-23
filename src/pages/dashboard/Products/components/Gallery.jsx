import { X } from "lucide-react";
import { useState, useEffect } from "react";

const Gallery = ({ product, isOpen, onClose }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (product && isOpen) {
      const additional = (product.additional_images || []).map((img) => ({
        id: img.id,
        url: img.file_url,
      }));

      const featured = product.featured_image
        ? [{ id: "featured", url: product.featured_image }]
        : [];

      const allImages = [...featured, ...additional];
      setImages(allImages);
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-start justify-center pt-10 pb-10">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div></div>
          <h1 className="text-2xl text-pinkclr">Image Gallery</h1>
          <button onClick={onClose} className="text-pinkclr ">
            <X />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4">
          {images.length > 0 ? (
            images.map((image, idx) => (
              <div key={image.id || idx} className="relative group">
                <img
                  src={image.url}
                  alt={`Product ${product.name}`}
                  className="w-full h-48 object-cover rounded border border-gray-200"
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              No images available for this product.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
