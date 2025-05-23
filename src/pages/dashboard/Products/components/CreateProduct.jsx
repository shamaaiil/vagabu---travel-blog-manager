import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useProductForm from "./useProductForm";
import { FaSpinner, FaTimes, FaSave } from "react-icons/fa";
import ProductInformation from "./ProductInformation";
import ProductIdentifiers from "./ProductIdentifiers";
import Pricing from "./ProductPricing";
import SEO from "./SEO";
import Media from "./Media";
import ProductDetails from "./ProductDetails";
import ProductVariation from "./ProductVariations";
import ShippingOptions from "./Shipping";
import BackButton from "@/ui/BackButton";
import { toast } from "react-toastify";
import { useGetQuery } from "@/services/apiService";

const CreateProduct = ({ onCreate, onBack }) => {
  const { uuid } = useParams();
  const {
    data: productResponse,
    isLoading: isLoadingProduct,
    error,
  } = useGetQuery(
    {
      path: uuid ? `products/${uuid}` : null,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    },
    { skip: !uuid },
  );

  const product = productResponse?.data || null;
  const isEditMode = !!product;

  useEffect(() => {
    if (error) {
      toast.error("Failed to load product data");
    }
  }, [error]);

  const {
    sizeVariations,
    attributes,
    setAttributes,
    productInfo,
    setProductInfo,
    productIdentifiers,
    setProductIdentifiers,
    pricing,
    setPricing,
    variations,
    setVariations,
    details,
    setDetails,
    media,
    setMedia,
    shipping,
    setShipping,
    seo,
    setSeo,
    isSubmitting,
    previewImageUrl,
    setPreviewImageUrl,
    galleryPreviewUrls,
    setGalleryPreviewUrls,
    videoPreviewUrl,
    setVideoPreviewUrl,
    categories,
    subCategories,
    childCategories,
    isLoadingCategories,
    isLoadingSubCategories,
    isLoadingChildCategories,
    handleLabelsChange,
    handleFeatureImageChange,
    handleGalleryImagesChange,
    handleRemoveGalleryImage,
    handleVideoFileChange,
    handleSpecificationsChange,
    handleSubmit,
    setSpecificAttributes,
    setSizeVariations,
  } = useProductForm({ product, isEditMode, onCreate });

  if (isEditMode && isLoadingProduct) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <FaSpinner className="animate-spin text-teelclr text-4xl mb-4" />
          <p>Loading product data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-[#F2F7FB] flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex justify-between items-center w-full px-4 py-2">
          <h1 className="text-2xl text-[#2B3674] font-bold">
            {isEditMode ? "Edit Product" : "Add Product"}
          </h1>
          <BackButton />
        </div>
        {isEditMode && product?.updatedAt && (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Last updated: {new Date(product.updatedAt).toLocaleString()}
            </span>
            <div className="h-4 border-l border-gray-300"></div>
            <span className="text-sm text-gray-500">
              Status: {product.availability ? "Active" : "Inactive"}
            </span>
          </div>
        )}
      </div>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="space-y-6"
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
            e.preventDefault();
          }
        }}
      >
        <ProductInformation
          productInfo={productInfo}
          setProductInfo={setProductInfo}
          handleLabelsChange={handleLabelsChange}
          categories={categories}
          subCategories={subCategories}
          childCategories={childCategories}
          isLoadingCategories={isLoadingCategories}
          isLoadingSubCategories={isLoadingSubCategories}
          isLoadingChildCategories={isLoadingChildCategories}
        />
        <ProductIdentifiers
          productIdentifiers={productIdentifiers}
          setProductIdentifiers={setProductIdentifiers}
        />
        <Pricing pricing={pricing} setPricing={setPricing} />
        <ProductVariation
          variations={variations}
          setVariations={setVariations}
          setSpecificAttributes={setSpecificAttributes}
          setSizeVariations={setSizeVariations}
          attributes={attributes}
          setAttributes={setAttributes}
          sizeVariations={sizeVariations}
        />
        <ProductDetails
          details={details}
          setDetails={setDetails}
          handleSpecificationsChange={handleSpecificationsChange}
        />
        <Media
          featureImage={media.featureImage}
          setFeatureImage={handleFeatureImageChange}
          gallery={media.gallery}
          setGallery={handleGalleryImagesChange}
          removeGalleryImage={handleRemoveGalleryImage}
          videoFile={media.videoFile}
          setVideoFile={handleVideoFileChange}
          videoLink={media.videoLink}
          setVideoLink={(link) =>
            setMedia((prev) => ({ ...prev, videoLink: link }))
          }
          selectedColor={media.selectedColor}
          setSelectedColor={(color) =>
            setMedia((prev) => ({ ...prev, selectedColor: color }))
          }
          colors={[
            "Red",
            "teelclr",
            "Green",
            "Black",
            "White",
            "Yellow",
            "Purple",
            "Orange",
            "Gray",
          ]}
          pdfFiles={media.pdfFiles}
          setPdfFiles={(files) =>
            setMedia((prev) => ({ ...prev, pdfFiles: files }))
          }
          previewImageUrl={previewImageUrl}
          setPreviewImageUrl={setPreviewImageUrl}
          galleryPreviewUrls={galleryPreviewUrls}
          setGalleryPreviewUrls={setGalleryPreviewUrls}
          videoPreviewUrl={videoPreviewUrl}
          setVideoPreviewUrl={setVideoPreviewUrl}
        />
        <ShippingOptions
          freeShipping={shipping.free_shipping}
          setFreeShipping={(value) =>
            setShipping((prev) => ({ ...prev, free_shipping: value }))
          }
          deliveryTime={shipping.delivery_time}
          setDeliveryTime={(value) =>
            setShipping((prev) => ({ ...prev, delivery_time: value }))
          }
          shippingVariant={shipping.variant}
          setShippingVariant={(value) =>
            setShipping((prev) => ({ ...prev, variant: value }))
          }
          shippingCost={shipping.shipping_cost}
          setShippingCost={(value) =>
            setShipping((prev) => ({ ...prev, shipping_cost: value }))
          }
          shippingLocation={shipping.shipping_location}
          setShippingLocation={(value) =>
            setShipping((prev) => ({ ...prev, shipping_location: value }))
          }
        />
        <SEO seo={seo} setSeo={setSeo} productName={productInfo.productName} />
        <div className="flex justify-end space-x-4 pt-4 mt-8 border-t">
          <button
            type="button"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center"
            onClick={onCreate}
            disabled={isSubmitting}
          >
            <FaTimes className="mr-2" /> Cancel
          </button>
          <button
            type="submit"
            onClick={onCreate}
            className="px-6 py-3 bg-teelclr text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors flex items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <FaSave className="mr-2" />
                {isEditMode ? "Update Product" : "Create Product"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
