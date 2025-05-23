import React, { useState, useEffect } from "react";
import FileUpload from "@/components/common/FileUpload";
import CustomSelect from "@/components/common/CustomSelect";
import CustomInput from "@/components/common//CustomInput";
import PDFList from "@/components/common/PDFList";

const Media = ({
  featureImage,
  setFeatureImage,
  gallery = [],
  setGallery,
  removeGalleryImage,
  videoLink = "",
  setVideoLink,
  videoFile,
  setVideoFile,
  selectedColor,
  setSelectedColor,
  colors,
  pdfFiles = [],
  setPdfFiles,
  previewImageUrl,
  setPreviewImageUrl,
  galleryPreviewUrls = [],
  setGalleryPreviewUrls,
  videoPreviewUrl,
  setVideoPreviewUrl,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Format file size for display
  const formatFileSize = (size) => {
    if (!size) return "";
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / 1024 / 1024).toFixed(2)} MB`;
  };

  // Handle video upload
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("video/")) {
      if (file.size > 100 * 1024 * 1024) {
        setError("Video file should be less than 100MB");
        return;
      }

      setVideoFile(file);
      const videoUrl = URL.createObjectURL(file);
      setVideoPreviewUrl(videoUrl);
      setSuccess("Video uploaded successfully!");
      setTimeout(() => setSuccess(""), 2000);
    } else {
      setError("Please select a valid video file");
    }
  };

  const removeVideo = () => {
    if (videoPreviewUrl && videoPreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    setVideoFile(null);
    setVideoPreviewUrl(null);
  };

  // Handle feature image upload
  const handleFeatureImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image should be less than 5MB");
        return;
      }

      setFeatureImage(file);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviewImageUrl(previewUrl);

      setSuccess("Feature image uploaded successfully!");
      setTimeout(() => setSuccess(""), 2000);
    }
  };

  // Handle gallery image upload
  const handleGalleryImagesChange = (e) => {
    setError("");

    // Get files from the event
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Convert to array
    const filesArray = Array.from(files);

    // Validate files
    const validFiles = filesArray.filter((file) => {
      if (!file.type.startsWith("image/")) {
        setError("Some files are not valid images and were skipped");
        return false;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Files larger than 5MB were skipped");
        return false;
      }

      return true;
    });

    if (validFiles.length > 0) {
      // Pass the valid File objects directly to the parent component
      setGallery(validFiles);

      // Create preview URLs locally
      const newPreviewUrls = validFiles.map((file) =>
        URL.createObjectURL(file),
      );
      setGalleryPreviewUrls((prev) => {
        const prevUrls = Array.isArray(prev) ? prev : [];
        return [...prevUrls, ...newPreviewUrls];
      });

      setSuccess("Gallery images added successfully!");
      setTimeout(() => setSuccess(""), 2000);
    }
  };

  // Handle PDF files upload
  const handlePdfFilesChange = (e) => {
    setError("");
    const files = Array.from(e.target.files);

    if (!files || files.length === 0) return;

    // Validate PDF files
    const validFiles = files.filter((file) => {
      if (file.type !== "application/pdf") {
        setError("Only PDF files are accepted");
        return false;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError("PDF files should be less than 10MB");
        return false;
      }

      return true;
    });

    if (validFiles.length > 0) {
      setPdfFiles((prevFiles) => [...prevFiles, ...validFiles]);
      setSuccess("PDF files added successfully!");
      setTimeout(() => setSuccess(""), 2000);
    }
  };

  // Remove PDF file
  const removePdfFile = (index) => {
    setPdfFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Get proper image source for gallery items
  const getImageSource = (item) => {
    if (typeof item === "string") return item;
    if (item && item.file_url) return item.file_url;
    return item;
  };

  // Helper function to get YouTube/Vimeo thumbnail
  const getVideoLinkPreview = (url) => {
    if (!url) return null;

    // YouTube
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      let videoId = "";
      if (url.includes("youtube.com/watch?v=")) {
        videoId = url.split("v=")[1]?.split("&")[0];
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0];
      }
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/0.jpg`;
      }
    }

    // Default preview (could be expanded for Vimeo, etc.)
    return null;
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg border border-gray-200">
      <h2 className="text-xl font-bold text-pinkclr mb-4 border-b pb-2">
        MEDIA
      </h2>

      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <FileUpload
          id="featureImageUpload"
          label="Feature Image"
          accept="image/*"
          onFileChange={handleFeatureImageChange}
          preview={previewImageUrl}
          onRemove={() => {
            if (previewImageUrl && previewImageUrl.startsWith("blob:")) {
              URL.revokeObjectURL(previewImageUrl);
            }
            setFeatureImage(null);
            setPreviewImageUrl(null);
          }}
          buttonText="Upload Feature Image"
        >
          <img
            src={previewImageUrl}
            alt="Feature"
            className="w-full h-full object-contain"
          />
          {featureImage && featureImage.size && (
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
              {formatFileSize(featureImage.size)}
            </div>
          )}
        </FileUpload>

        {/* Gallery Upload - Keeping this more complex section as is */}
        <div className="col-span-2">
          <label className="block text-[#1F2B6C] font-semibold mb-2">
            Gallery Images
          </label>
          <div
            className={`border ${dragActive ? "border-teelclr border-dashed" : "border-gray-300"} rounded-md w-full h-40 p-2 overflow-auto`}
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(false);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(true);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(false);

              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                const files = Array.from(e.dataTransfer.files).filter(
                  (file) => {
                    if (!file.type.startsWith("image/")) {
                      setError(
                        "Some files are not valid images and were skipped",
                      );
                      return false;
                    }

                    if (file.size > 5 * 1024 * 1024) {
                      setError("Files larger than 5MB were skipped");
                      return false;
                    }
                    return true;
                  },
                );

                if (files.length > 0) {
                  setGallery((prevGallery) => [...prevGallery, ...files]);
                  const newPreviewUrls = files.map((file) =>
                    URL.createObjectURL(file),
                  );
                  setGalleryPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
                  setSuccess("Gallery images added successfully!");
                  setTimeout(() => setSuccess(""), 2000);
                }
              }
            }}
          >
            {galleryPreviewUrls && galleryPreviewUrls.length > 0 ? (
              <div className="grid grid-cols-4 gap-2">
                {galleryPreviewUrls.map((preview, index) => (
                  <div key={index} className="relative h-16">
                    <img
                      src={getImageSource(preview)}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        e.target.src = ""; // Clear source on error
                        e.target.alt = "Preview failed";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <span className="text-gray-500 text-sm">
                  Add gallery images
                </span>
              </div>
            )}
          </div>
          <input
            type="file"
            multiple
            className="hidden"
            id="galleryUpload"
            accept="image/*"
            onChange={handleGalleryImagesChange}
          />
          <label
            htmlFor="galleryUpload"
            className="mt-2 block text-center px-3 py-2 bg-teelclr text-white rounded-md cursor-pointer hover:bg-opacity-90 transition-colors text-sm"
          >
            Add Gallery Images
          </label>
        </div>
      </div>

      {/* Video Upload Section */}
      <div className="mb-6">
        <label className="block text-[#1F2B6C] font-semibold mb-2">
          Video Upload
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Video Upload Area using FileUpload component */}
          <FileUpload
            id="videoUpload"
            label=""
            accept="video/*"
            onFileChange={handleVideoUpload}
            preview={videoPreviewUrl}
            onRemove={removeVideo}
            buttonText="Upload Video File"
          >
            <video
              src={videoPreviewUrl}
              controls
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.src = ""; // Clear source on error
              }}
            />
            {videoFile && videoFile.size && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
                {formatFileSize(videoFile.size)}
              </div>
            )}
          </FileUpload>

          {/* Video Link Input using CustomInput */}
          <div className="flex flex-col justify-between">
            <CustomInput
              name="videoLink"
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              label="Video Link (Alternative)"
              placeholder="Enter a video link (YouTube, Vimeo, etc.)"
            />

            {videoLink && !videoFile && (
              <div className="mt-2 flex items-center">
                {getVideoLinkPreview(videoLink) ? (
                  <div className="w-16 h-16 overflow-hidden rounded mr-2">
                    <img
                      src={getVideoLinkPreview(videoLink)}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : null}
                <span className="text-sm text-green-600">Video link added</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PDF Upload Section */}
      <div className="mb-6">
        <label className="block text-[#1F2B6C] font-semibold mb-2">
          PDF Documents
        </label>
        <div
          className={`border-dashed border-2 ${
            dragActive ? "border-teelclr bg-blue-50" : "border-gray-300"
          } rounded-md p-4 min-h-40 relative`}
          onDragEnter={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(true);
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);

            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              const files = Array.from(e.dataTransfer.files).filter((file) => {
                if (file.type !== "application/pdf") {
                  setError("Only PDF files are accepted");
                  return false;
                }

                if (file.size > 10 * 1024 * 1024) {
                  setError("PDF files should be less than 10MB");
                  return false;
                }

                return true;
              });

              if (files.length > 0) {
                setPdfFiles((prevFiles) => [...prevFiles, ...files]);
                setSuccess("PDF files added successfully!");
                setTimeout(() => setSuccess(""), 2000);
              }
            }
          }}
        >
          {Array.isArray(pdfFiles) && pdfFiles.length > 0 ? (
            <PDFList
              files={pdfFiles}
              onRemove={removePdfFile}
              formatFileSize={formatFileSize}
            />
          ) : (
            <div className="h-40 flex flex-col items-center justify-center">
              <span className="text-gray-400 text-2xl block">+</span>
              <span className="text-gray-500 text-sm">
                Drag & Drop PDF files or Browse
              </span>
            </div>
          )}
        </div>
        <input
          type="file"
          multiple
          className="hidden"
          id="pdfUpload"
          accept="application/pdf"
          onChange={handlePdfFilesChange}
        />
        <label
          htmlFor="pdfUpload"
          className="mt-2 block text-center px-3 py-2 bg-teelclr text-white rounded-md cursor-pointer hover:bg-opacity-90 transition-colors text-sm"
        >
          Upload PDF Documents
        </label>
      </div>

      {/* Color Selection using CustomSelect */}
      {colors && colors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <CustomSelect
            label="Color"
            options={[
              { value: "No Color", label: "No Color" },
              ...colors.map((color) => ({ value: color, label: color })),
            ]}
            value={selectedColor || "No Color"}
            onChange={(e) => setSelectedColor(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default Media;
