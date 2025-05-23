// useProductForm.js
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useGetQuery, usePostMutation } from "@/services/apiService";

const useProductForm = ({ product, isEditMode, onCreate }) => {
  console.log(product, "this is from the start");
  const [specificAttributes, setSpecificAttributes] = useState([]);
  const [sizeVariations, setSizeVariations] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [productInfo, setProductInfo] = useState({
    productName: product?.name || "",
    productLabels: Array.isArray(product?.labels)
      ? product.labels.map((label) =>
          typeof label === "object" ? label.id : label,
        )
      : [],
    category_id: product?.category_id || "",
    subCategory: product?.sub_category_id || "",
    childCategory: product?.child_category_id || "",
    type: product?.type || "prints",
  });

  const [productIdentifiers, setProductIdentifiers] = useState({
    sku: product?.sku || "",
    manufacturer: product?.manufacturer || "",
    model: product?.model || "",
  });

  const [pricing, setPricing] = useState({
    retailPrice: product?.price || "",
    discountAmount: product?.discount_amount || "0",
    allowWholesale: product?.allow_wholesale || false,
    wholesale_price: product?.wholesale_price || "0",
    wholesale_quantity: product?.wholesale_quantity || "1",
    wholesaleFields: product?.wholesale_fields?.length
      ? product.wholesale_fields
      : [{ quantity: "0", price: "0" }],
  });

  const [variations, setVariations] = useState([]);

  const [details, setDetails] = useState({
    description: product?.description || "",
    specifications:
      typeof product?.specifications === "string"
        ? product?.specifications
        : Array.isArray(product?.specifications)
          ? product?.specifications.join(", ")
          : "",
    refund_policy: product?.refund_policy || "",
  });

  const [media, setMedia] = useState({
    featureImage: null,
    gallery: [],
    videoFile: null,
    videoLink: product?.video_link || "",
    selectedColor: product?.color || "No Color",
    pdfFiles: Array.isArray(product?.pdf_files) ? product.pdf_files : [],
  });

  const [shipping, setShipping] = useState({
    free_shipping: product?.shipping?.free_shipping ?? false,
    delivery_time: product?.shipping?.delivery_time || "Next Day",
    variant: product?.shipping?.variant || "Whole order",
    shipping_cost: product?.shipping?.shipping_cost || "0",
    shipping_location: product?.shipping?.shipping_location || "Worldwide",
  });

  const [seo, setSeo] = useState({
    title: product?.seo?.title || "",
    keywords: product?.seo?.keywords || "",
    meta_tags: product?.seo?.meta_tags || "",
    meta_description: product?.seo?.meta_description || "",
    slug: product?.seo?.slug || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState(
    product?.featured_image || null,
  );
  const [galleryPreviewUrls, setGalleryPreviewUrls] = useState(() => {
    const images = product?.additional_images;
    if (!images) return [];
    if (Array.isArray(images)) return images;
    if (typeof images === "string") return [images];
    if (typeof images === "object") return [images];
    return [];
  });
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(
    product?.video_file_url || null,
  );

  const [featuredImageChanged, setFeaturedImageChanged] = useState(false);
  const [galleryImagesChanged, setGalleryImagesChanged] = useState(false);
  const [videoChanged, setVideoChanged] = useState(false);

  const [createProduct, { isLoading: isCreating }] = usePostMutation();
  const [updateProduct, { isLoading: isUpdating }] = usePostMutation();

  const { data: productData, isLoading: isLoadingProduct } = useGetQuery(
    { path: isEditMode ? `products/${product?.product_uuid}` : null },
    { skip: !isEditMode },
  );

  const { data: categoriesData, isLoading: isLoadingCategories } = useGetQuery({
    path: "categories?parent_only=1&sub_only=0&child_only=0",
  });

  const { data: subCategoriesData, isLoading: isLoadingSubCategories } =
    useGetQuery(
      {
        path: `categories?parent_only=0&sub_only=1&child_only=0&parent_id=${productInfo.category_id}`,
      },
      { skip: !productInfo.category_id },
    );

  const { data: childCategoriesData, isLoading: isLoadingChildCategories } =
    useGetQuery(
      {
        path: `categories?parent_only=0&sub_only=0&child_only=1&parent_id=${productInfo.subCategory}`,
      },
      { skip: !productInfo.subCategory },
    );

  const categories = categoriesData?.data || [];
  const subCategories = subCategoriesData?.data || [];
  const childCategories = childCategoriesData?.data || [];

  useEffect(() => {
    if (isEditMode && productData?.data) {
      const product = productData.data;
      console.log("Loading product data:", product);

      setFeaturedImageChanged(false);
      setGalleryImagesChanged(false);
      setVideoChanged(false);

      // Handle attributes
      if (Array.isArray(product.attributes)) {
        const formattedAttributes = product.attributes.map((attr) => {
          return {
            general_attribute_id: attr.general_attribute?.id || 1,
            attribute_name: attr.general_attribute?.name || "",
            values: Array.isArray(attr.attribute_values)
              ? attr.attribute_values.map((val) => ({
                  id: val.id,
                  attribute_name: val.attribute_name,
                  price_adjustment: val.price_adjustment || 0,
                  price_type:
                    val.price_type === "fixed" ? "Per Item" : "Percentage",
                  additional_info: val.attribute_info || "",
                }))
              : [],
          };
        });

        const transformedAttributes = formattedAttributes.map((attr) => ({
          attributeId: attr.general_attribute_id,
          options: attr.values.map((val) => ({
            value: val.attribute_name,
            price: val.price_adjustment,
            priceType: val.price_type, // Already "Per Item" or "Percentage"
            frontOnly: val.additional_info || "",
            bothFrontBack: "", // Or any other field if you have
          })),
        }));

        // Then set it to the 'attributes' state used in ProductVariation
        setAttributes(transformedAttributes);

        setSpecificAttributes(formattedAttributes);
        console.log(formattedAttributes, " from formated");
      }

      // Handle size variations
      if (Array.isArray(product.size_variations)) {
        setSizeVariations(product.size_variations);
        console.log(product.size_variations, " from product size variations");

        console.log(product.size_variations, " from setSizeVariations");
      }

      // Handle product info
      setProductInfo({
        productName: product.name || "",
        productLabels: Array.isArray(product.labels)
          ? product.labels.map((label) =>
              typeof label === "object" ? label.id : label,
            )
          : [],
        category_id: product.category_id || "",
        subCategory: product.sub_category_id || "",
        childCategory: product.child_category_id || "",
        type: product.type || "prints",
      });

      // Handle product identifiers
      setProductIdentifiers({
        sku: product.sku || "",
        manufacturer: product.manufacturer || "",
        model: product.model || "",
      });

      // Handle pricing
      setPricing({
        retailPrice: product.price || "",
        discountAmount: product.discount_amount || "0",
        allowWholesale:
          product.allow_wholesale ||
          (product.wholesale_price && product.wholesale_quantity
            ? true
            : false),
        wholesale_price: product.wholesale_price || "0",
        wholesale_quantity: product.wholesale_quantity || "1",
        wholesaleFields:
          Array.isArray(product.wholesale_fields) &&
          product.wholesale_fields.length > 0
            ? product.wholesale_fields
            : [{ quantity: "0", price: "0" }],
      });

      const formattedVariations = Array.isArray(product.variations)
        ? product.variations.map((v) => {
            let attrId = v.general_attribute_id || v.attribute_id;
            const attributeIdInt =
              attrId === "size" ? 1 : parseInt(attrId, 10) || 1;
            return {
              ...v,
              general_attribute_id: attributeIdInt,
              price_adjustment: v.price_adjustment ?? v.price ?? 0,
              price_type: v.price_type,
            };
          })
        : [
            {
              attribute: "Size",
              general_attribute_id: 1,
              value: "Default",
              price_adjustment: 0,
              price_type: "fixed",
              quantity: 1,
            },
          ];
      setVariations(formattedVariations);

      // Handle details
      setDetails({
        description: product.description || "",
        specifications:
          typeof product.specifications === "string"
            ? product.specifications
            : Array.isArray(product.specifications)
              ? product.specifications.join(", ")
              : "",
        refund_policy: product.refund_policy || "",
      });

      if (product.featured_image) {
        setPreviewImageUrl(product.featured_image);
      }

      const galleryImages = Array.isArray(product.additional_images)
        ? product.additional_images
        : product.additional_images
          ? [product.additional_images]
          : [];

      setGalleryPreviewUrls(galleryImages);

      // Handle video preview
      if (product.video_file_url) {
        setVideoPreviewUrl(product.video_file_url);
      }

      setMedia({
        featureImage: null,
        gallery: [],
        videoFile: null,
        videoLink: product.video_link || "",
        selectedColor: product.color || "No Color",
        pdfFiles: Array.isArray(product.pdf_files) ? product.pdf_files : [],
      });

      // Handle shipping
      setShipping({
        free_shipping: product.shipping?.free_shipping ?? false,
        delivery_time: product.shipping?.delivery_time || "Next Day",
        variant: product.shipping?.variant || "Whole order",
        shipping_cost: product.shipping?.shipping_cost || "0",
        shipping_location: product.shipping?.shipping_location || "Worldwide",
      });

      setSeo({
        title: product.seo?.title || "",
        slug: product.seo?.slug || "",
        keywords: product.seo?.keywords || "",
        meta_tags: product.seo?.meta_tags || "",
        meta_description: product.seo?.meta_description || "",
      });
    }
  }, [isEditMode, productData]);

  useEffect(() => {
    if (productInfo.category_id && !isEditMode) {
      setProductInfo((prev) => ({
        ...prev,
        subCategory: "",
        childCategory: "",
      }));
    }
  }, [productInfo.category_id, isEditMode]);

  useEffect(() => {
    if (productInfo.subCategory && !isEditMode) {
      setProductInfo((prev) => ({
        ...prev,
        childCategory: "",
      }));
    }
  }, [productInfo.subCategory, isEditMode]);

  useEffect(() => {
    return () => {
      if (previewImageUrl && previewImageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewImageUrl);
      }

      galleryPreviewUrls?.forEach((url) => {
        if (typeof url === "string" && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        } else if (url && url.file_url && url.file_url.startsWith("blob:")) {
          URL.revokeObjectURL(url.file_url);
        }
      });

      if (videoPreviewUrl && videoPreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
    };
  }, [previewImageUrl, galleryPreviewUrls, videoPreviewUrl]);

  const handleLabelsChange = (selectedLabels) => {
    setProductInfo((prev) => ({
      ...prev,
      productLabels: Array.isArray(selectedLabels) ? selectedLabels : [],
    }));
  };

  const handleFeatureImageChange = (file) => {
    setFeaturedImageChanged(true);
    if (!file) {
      setMedia((prev) => ({ ...prev, featureImage: null }));
      if (previewImageUrl && previewImageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewImageUrl);
      }
      setPreviewImageUrl(null);
      return;
    }

    setMedia((prev) => ({ ...prev, featureImage: file }));
    if (previewImageUrl && previewImageUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewImageUrl);
    }
    const previewUrl = URL.createObjectURL(file);
    setPreviewImageUrl(previewUrl);
  };

  const handleGalleryImagesChange = (files) => {
    setGalleryImagesChanged(true);
    if (!files || (Array.isArray(files) && files.length === 0)) return;

    setMedia((prev) => {
      const currentGallery = Array.isArray(prev.gallery) ? prev.gallery : [];
      const newFiles = Array.isArray(files) ? files : [files].filter(Boolean);
      return {
        ...prev,
        gallery: [...currentGallery, ...newFiles],
      };
    });

    const filesArray = Array.isArray(files) ? files : [files].filter(Boolean);
    const newPreviewUrls = filesArray.map((file) => URL.createObjectURL(file));
    setGalleryPreviewUrls((prev) => {
      const prevUrls = Array.isArray(prev) ? prev : [];
      return [...prevUrls, ...newPreviewUrls];
    });
  };

  const handleRemoveGalleryImage = (index) => {
    setGalleryImagesChanged(true);
    setMedia((prev) => {
      const updatedGallery = [...prev.gallery];
      updatedGallery.splice(index, 1);
      return { ...prev, gallery: updatedGallery };
    });

    setGalleryPreviewUrls((prev) => {
      const updatedPreviews = [...prev];
      if (
        updatedPreviews[index] &&
        typeof updatedPreviews[index] === "string" &&
        updatedPreviews[index].startsWith("blob:")
      ) {
        URL.revokeObjectURL(updatedPreviews[index]);
      }
      updatedPreviews.splice(index, 1);
      return updatedPreviews;
    });
  };

  const handleVideoFileChange = (file) => {
    setVideoChanged(true);
    if (!file) {
      setMedia((prev) => ({ ...prev, videoFile: null }));
      if (videoPreviewUrl && videoPreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
      setVideoPreviewUrl(null);
      return;
    }

    setMedia((prev) => ({ ...prev, videoFile: file }));
    if (videoPreviewUrl && videoPreviewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    const videoUrl = URL.createObjectURL(file);
    setVideoPreviewUrl(videoUrl);
  };

  const handleSpecificationsChange = (value) => {
    setDetails((prev) => ({
      ...prev,
      specifications: value || "",
    }));
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setIsSubmitting(true);

    try {
      if (!productInfo.productName) {
        toast.error("Product name is required");
        setIsSubmitting(false);
        return;
      }

      if (!productInfo.category_id) {
        toast.error("Category is required");
        setIsSubmitting(false);
        return;
      }

      if (!pricing.retailPrice) {
        toast.error("Retail price is required");
        setIsSubmitting(false);
        return;
      }

      if (!seo.title) {
        toast.error("SEO title is required");
        setIsSubmitting(false);
        return;
      }

      if (!seo.keywords) {
        toast.error("SEO keywords are required");
        setIsSubmitting(false);
        return;
      }

      if (!seo.meta_description) {
        toast.error("SEO meta description is required");
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append("name", productInfo.productName);
      formData.append("category_id", productInfo.category_id);
      formData.append("type", productInfo.type || "prints");
      formData.append("sku", productIdentifiers.sku || "");
      formData.append("manufacturer", productIdentifiers.manufacturer || "");
      formData.append("model", productIdentifiers.model || "");
      formData.append("price", pricing.retailPrice);
      formData.append("discount_amount", pricing.discountAmount || "0");
      formData.append("description", details.description || "");
      formData.append("refund_policy", details.refund_policy || "");
      formData.append("specifications", details.specifications || "");
      formData.append("status", "1");

      // Handle wholesale data
      formData.append("allow_wholesale", pricing.allowWholesale ? "1" : "0");
      formData.append("wholesale_price", pricing.wholesale_price || "0");
      formData.append("wholesale_quantity", pricing.wholesale_quantity || "1");

      // Handle Labels
      if (
        Array.isArray(productInfo.productLabels) &&
        productInfo.productLabels.length
      ) {
        productInfo.productLabels.forEach((label, index) => {
          const labelId =
            typeof label === "object" && label.id ? label.id : label;
          formData.append(`labels[${index}]`, labelId);
        });
      }

      // Handle Attributes
      if (specificAttributes?.length) {
        specificAttributes.forEach((attr, index) => {
          formData.append(
            `attributes[${index}][general_attribute_id]`,
            attr.general_attribute_id || "1",
          );

          if (attr.values?.length) {
            attr.values.forEach((val, valIndex) => {
              console.log(val);
              formData.append(
                `attributes[${index}][attribute_values][${valIndex}][id]`,
                val.id || val.value || val.attribute_name || "",
              );

              formData.append(
                `attributes[${index}][attribute_values][${valIndex}][price_adjustment]`,
                val.price_adjustment || val.price || "0",
              );
              formData.append(
                `attributes[${index}][attribute_values][${valIndex}][price_type]`,
                val.price_type === "Per Item" ? "fixed" : "percentage",
              );

              formData.append(
                `attributes[${index}][attribute_values][${valIndex}][attribute_name]`,
                val.attribute_name || val.value || "",
              );
              formData.append(
                `attributes[${index}][attribute_values][${valIndex}][attribute_info]`,
                val.additional_info || val.attribute_info || "",
              );
            });
          }
        });
      }

      // Handle Size Variations ONLY if user added them
      if (sizeVariations?.length > 0) {
        sizeVariations.forEach((size, index) => {
          if (size.size_name?.trim()) {
            formData.append(
              `size_variations[${index}][size_name]`,
              size.size_name,
            );
            formData.append(
              `size_variations[${index}][size_qty]`,
              size.size_qty || "0",
            );
            formData.append(
              `size_variations[${index}][size_price]`,
              size.size_price || "0",
            );
          }
        });
      }

      // Handle Featured Image
      if (media.featureImage) {
        formData.append("featured_image", media.featureImage);
      }

      // Handle Additional Images
      if (media.gallery && media.gallery.length > 0) {
        media.gallery.forEach((image, index) => {
          if (image instanceof File) {
            formData.append(`additional_images[${index}]`, image);
          }
        });
      }

      // Handle Video
      if (media.videoFile) {
        formData.append("video", media.videoFile);
      }
      if (media.videoLink) {
        formData.append("video_link", media.videoLink);
      }

      // Handle PDF Files if any
      if (media.pdfFiles && media.pdfFiles.length > 0) {
        media.pdfFiles.forEach((pdf, index) => {
          if (pdf instanceof File) {
            formData.append(`pdf_files[${index}]`, pdf);
          } else if (typeof pdf === "string") {
            formData.append(`pdf_files[${index}]`, pdf);
          }
        });
      }

      formData.append("seo[title]", seo.title);
      formData.append(
        "seo[slug]",
        seo.slug || seo.title.toLowerCase().replace(/\s+/g, "-"),
      );
      formData.append("seo[keywords]", seo.keywords);
      formData.append("seo[meta_tags]", seo.meta_tags || "");
      formData.append("seo[meta_description]", seo.meta_description);

      formData.append(
        "shipping[free_shipping]",
        shipping.free_shipping ? "1" : "0",
      );
      formData.append(
        "shipping[delivery_time]",
        shipping.delivery_time || "3-5 days",
      );
      formData.append("shipping[variant]", shipping.variant || "Whole order");
      formData.append("shipping[shipping_cost]", shipping.shipping_cost || "0");
      formData.append(
        "shipping[shipping_location]",
        shipping.shipping_location || "Worldwide",
      );

      try {
        if (isEditMode && product?.product_uuid) {
          formData.append("_method", "PUT");

          const response = await updateProduct({
            path: `products/${product.product_uuid}`,
            body: formData,
            method: "POST",
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (!response.error && response.data?.status === 1) {
            toast.success("Product updated successfully");
            if (onCreate && typeof onCreate === "function") {
              onCreate();
            }
          } else {
            handleApiError(response);
          }
        } else {
          const response = await createProduct({
            path: "products",
            body: formData,
            method: "POST",
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (!response.error && response.data?.status === 1) {
            toast.success("Product created successfully");
            if (onCreate && typeof onCreate === "function") {
              onCreate();
            }
          } else {
            handleApiError(response);
          }
        }
      } catch (error) {
        console.error("Error saving product:", error);
        toast.error(error.message || "An unexpected error occurred");
      }
    } catch (error) {
      console.error("Form validation error:", error);
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApiError = (response) => {
    const errorMsg =
      response.error?.data?.message ||
      (response.error?.status === 0
        ? "Network error: Unable to connect to API"
        : "Failed to save product");
    toast.error(errorMsg);

    if (response.error?.data?.errors) {
      console.error("Validation errors:", response.error.data.errors);
      const firstError = Object.values(response.error.data.errors)[0];
      if (firstError && firstError.length > 0) {
        toast.error(firstError[0]);
      }
    } else {
      console.error("API Error:", response.error);
    }
  };

  return {
    setAttributes,
    attributes,
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
    isLoadingProduct,
    isLoadingCategories,
    isLoadingSubCategories,
    isLoadingChildCategories,
    specificAttributes,
    sizeVariations,
    handleLabelsChange,
    handleFeatureImageChange,
    handleGalleryImagesChange,
    handleRemoveGalleryImage,
    handleVideoFileChange,
    handleSpecificationsChange,
    handleSubmit,
    setSpecificAttributes,
    setSizeVariations,
  };
};

export default useProductForm;

// useProductForm.js

// import { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import { useGetQuery, usePostMutation } from "@/services/apiService";

// const useProductForm = ({ product, isEditMode, onCreate }) => {
//   // Initialize with empty/default values - will be populated from API call
//   const [specificAttributes, setSpecificAttributes] = useState([]);
//   const [sizeVariations, setSizeVariations] = useState([]);
//   const [productInfo, setProductInfo] = useState({
//     productName: "",
//     productLabels: [],
//     category_id: "",
//     subCategory: "",
//     childCategory: "",
//     type: "prints",
//   });

//   const [productIdentifiers, setProductIdentifiers] = useState({
//     sku: "",
//     manufacturer: "",
//     model: "",
//   });

//   const [pricing, setPricing] = useState({
//     retailPrice: "",
//     discountAmount: "0",
//     allowWholesale: false,
//     wholesale_price: "0",
//     wholesale_quantity: "1",
//     wholesaleFields: [{ quantity: "0", price: "0" }],
//   });

//   const [variations, setVariations] = useState([]);

//   const [details, setDetails] = useState({
//     description: "",
//     specifications: "",
//     refund_policy: "",
//   });

//   const [media, setMedia] = useState({
//     featureImage: null,
//     gallery: [],
//     videoFile: null,
//     videoLink: "",
//     selectedColor: "No Color",
//     pdfFiles: [],
//   });

//   const [shipping, setShipping] = useState({
//     free_shipping: false,
//     delivery_time: "Next Day",
//     variant: "Whole order",
//     shipping_cost: "0",
//     shipping_location: "Worldwide",
//   });

//   const [seo, setSeo] = useState({
//     title: "",
//     keywords: "",
//     meta_tags: "",
//     meta_description: "",
//     slug: "",
//   });

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [previewImageUrl, setPreviewImageUrl] = useState(null);
//   const [galleryPreviewUrls, setGalleryPreviewUrls] = useState([]);
//   const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);

//   const [featuredImageChanged, setFeaturedImageChanged] = useState(false);
//   const [galleryImagesChanged, setGalleryImagesChanged] = useState(false);
//   const [videoChanged, setVideoChanged] = useState(false);

//   const [createProduct, { isLoading: isCreating }] = usePostMutation();
//   const [updateProduct, { isLoading: isUpdating }] = usePostMutation();

//   const { data: productData, isLoading: isLoadingProduct } = useGetQuery(
//     { path: isEditMode ? `products/${product?.product_uuid}` : null },
//     { skip: !isEditMode },
//   );

//   const { data: categoriesData, isLoading: isLoadingCategories } = useGetQuery({
//     path: "categories?parent_only=1&sub_only=0&child_only=0",
//   });

//   const { data: subCategoriesData, isLoading: isLoadingSubCategories } =
//     useGetQuery(
//       {
//         path: `categories?parent_only=0&sub_only=1&child_only=0&parent_id=${productInfo.category_id}`,
//       },
//       { skip: !productInfo.category_id },
//     );

//   const { data: childCategoriesData, isLoading: isLoadingChildCategories } =
//     useGetQuery(
//       {
//         path: `categories?parent_only=0&sub_only=0&child_only=1&parent_id=${productInfo.subCategory}`,
//       },
//       { skip: !productInfo.subCategory },
//     );

//   const categories = categoriesData?.data || [];
//   const subCategories = subCategoriesData?.data || [];
//   const childCategories = childCategoriesData?.data || [];

//   // Helper function to populate all form fields with complete product data
//   const populateFormWithProductData = (productData) => {
//     console.log("Loading product data:", productData);

//     // Reset change flags
//     setFeaturedImageChanged(false);
//     setGalleryImagesChanged(false);
//     setVideoChanged(false);

//     // Handle attributes
//     if (Array.isArray(productData.attributes)) {
//       const formattedAttributes = productData.attributes.map((attr) => {
//         return {
//           general_attribute_id: attr.general_attribute?.id || 1,
//           attribute_name: attr.general_attribute?.name || "",
//           values: Array.isArray(attr.attribute_values)
//             ? attr.attribute_values.map((val) => ({
//                 id: val.id,
//                 attribute_name: val.attribute_name,
//                 price_adjustment: val.price_adjustment || 0,
//                 price_type:
//                   val.price_type === "fixed" ? "Per Item" : "Percentage",
//                 additional_info: val.attribute_info || "",
//               }))
//             : [],
//         };
//       });
//       setSpecificAttributes(formattedAttributes);
//       console.log(formattedAttributes, " formatted attributes");
//     } else {
//       setSpecificAttributes([]);
//     }

//     // Handle size variations
//     if (Array.isArray(productData.size_variations)) {
//       setSizeVariations(productData.size_variations);
//       console.log(productData.size_variations, " product size variations");
//     } else {
//       setSizeVariations([]);
//     }

//     // Handle product info - populate ALL fields
//     setProductInfo({
//       productName: productData.name || "",
//       productLabels: Array.isArray(productData.labels)
//         ? productData.labels.map((label) =>
//             typeof label === "object" ? label.id : label,
//           )
//         : [],
//       category_id: productData.category_id || "",
//       subCategory: productData.sub_category_id || "",
//       childCategory: productData.child_category_id || "",
//       type: productData.type || "prints",
//     });

//     // Handle product identifiers - populate ALL fields
//     setProductIdentifiers({
//       sku: productData.sku || "",
//       manufacturer: productData.manufacturer || "",
//       model: productData.model || "",
//     });

//     // Handle pricing - populate ALL fields
//     setPricing({
//       retailPrice: productData.price || "",
//       discountAmount: productData.discount_amount || "0",
//       allowWholesale: productData.allow_wholesale || false,
//       wholesale_price: productData.wholesale_price || "0",
//       wholesale_quantity: productData.wholesale_quantity || "1",
//       wholesaleFields:
//         Array.isArray(productData.wholesale_fields) &&
//         productData.wholesale_fields.length > 0
//           ? productData.wholesale_fields
//           : [{ quantity: "0", price: "0" }],
//     });

//     // Handle variations - populate with complete data
//     const formattedVariations = Array.isArray(productData.variations)
//       ? productData.variations.map((v) => {
//           let attrId = v.general_attribute_id || v.attribute_id;
//           const attributeIdInt =
//             attrId === "size" ? 1 : parseInt(attrId, 10) || 1;
//           return {
//             ...v,
//             general_attribute_id: attributeIdInt,
//             price_adjustment: v.price_adjustment ?? v.price ?? 0,
//             price_type: v.price_type,
//           };
//         })
//       : [
//           {
//             attribute: "Size",
//             general_attribute_id: 1,
//             value: "Default",
//             price_adjustment: 0,
//             price_type: "fixed",
//             quantity: 1,
//           },
//         ];
//     setVariations(formattedVariations);

//     // Handle details - populate ALL fields
//     setDetails({
//       description: productData.description || "",
//       specifications:
//         typeof productData.specifications === "string"
//           ? productData.specifications
//           : Array.isArray(productData.specifications)
//             ? productData.specifications.join(", ")
//             : "",
//       refund_policy: productData.refund_policy || "",
//     });

//     // Handle media preview URLs
//     if (productData.featured_image) {
//       setPreviewImageUrl(productData.featured_image);
//     }

//     // Handle gallery images
//     const galleryImages = Array.isArray(productData.additional_images)
//       ? productData.additional_images
//       : productData.additional_images
//         ? [productData.additional_images]
//         : [];
//     setGalleryPreviewUrls(galleryImages);

//     // Handle video preview
//     if (productData.video_file_url) {
//       setVideoPreviewUrl(productData.video_file_url);
//     }

//     // Handle media - populate ALL fields including existing files
//     setMedia({
//       featureImage: null, // Keep null for new uploads
//       gallery: [], // Keep empty for new uploads
//       videoFile: null, // Keep null for new uploads
//       videoLink: productData.video_link || "",
//       selectedColor: productData.color || "No Color",
//       pdfFiles: Array.isArray(productData.pdf_files) ? productData.pdf_files : [],
//     });

//     // Handle shipping - populate ALL fields
//     setShipping({
//       free_shipping: productData.shipping?.free_shipping ?? false,
//       delivery_time: productData.shipping?.delivery_time || "Next Day",
//       variant: productData.shipping?.variant || "Whole order",
//       shipping_cost: productData.shipping?.shipping_cost || "0",
//       shipping_location: productData.shipping?.shipping_location || "Worldwide",
//     });

//     // Handle SEO - populate ALL fields
//     setSeo({
//       title: productData.seo?.title || "",
//       slug: productData.seo?.slug || "",
//       keywords: productData.seo?.keywords || "",
//       meta_tags: productData.seo?.meta_tags || "",
//       meta_description: productData.seo?.meta_description || "",
//     });
//   };

//   // Main useEffect to handle product data loading
//   useEffect(() => {
//     if (isEditMode && productData?.data) {
//       // Use the complete product data from API call
//       populateFormWithProductData(productData.data);
//     } else if (!isEditMode && product) {
//       // For create mode, use prop data if available
//       populateFormWithProductData(product);
//     }
//   }, [isEditMode, productData]);

//   // Handle category changes - reset subcategories when category changes
//   useEffect(() => {
//     if (productInfo.category_id && !isEditMode) {
//       setProductInfo((prev) => ({
//         ...prev,
//         subCategory: "",
//         childCategory: "",
//       }));
//     }
//   }, [productInfo.category_id, isEditMode]);

//   // Handle subcategory changes - reset child categories when subcategory changes
//   useEffect(() => {
//     if (productInfo.subCategory && !isEditMode) {
//       setProductInfo((prev) => ({
//         ...prev,
//         childCategory: "",
//       }));
//     }
//   }, [productInfo.subCategory, isEditMode]);

//   // Cleanup blob URLs on unmount
//   useEffect(() => {
//     return () => {
//       if (previewImageUrl && previewImageUrl.startsWith("blob:")) {
//         URL.revokeObjectURL(previewImageUrl);
//       }

//       galleryPreviewUrls?.forEach((url) => {
//         if (typeof url === "string" && url.startsWith("blob:")) {
//           URL.revokeObjectURL(url);
//         } else if (url && url.file_url && url.file_url.startsWith("blob:")) {
//           URL.revokeObjectURL(url.file_url);
//         }
//       });

//       if (videoPreviewUrl && videoPreviewUrl.startsWith("blob:")) {
//         URL.revokeObjectURL(videoPreviewUrl);
//       }
//     };
//   }, [previewImageUrl, galleryPreviewUrls, videoPreviewUrl]);

//   const handleLabelsChange = (selectedLabels) => {
//     setProductInfo((prev) => ({
//       ...prev,
//       productLabels: Array.isArray(selectedLabels) ? selectedLabels : [],
//     }));
//   };

//   const handleFeatureImageChange = (file) => {
//     setFeaturedImageChanged(true);
//     if (!file) {
//       setMedia((prev) => ({ ...prev, featureImage: null }));
//       if (previewImageUrl && previewImageUrl.startsWith("blob:")) {
//         URL.revokeObjectURL(previewImageUrl);
//       }
//       setPreviewImageUrl(null);
//       return;
//     }

//     setMedia((prev) => ({ ...prev, featureImage: file }));
//     if (previewImageUrl && previewImageUrl.startsWith("blob:")) {
//       URL.revokeObjectURL(previewImageUrl);
//     }
//     const previewUrl = URL.createObjectURL(file);
//     setPreviewImageUrl(previewUrl);
//   };

//   const handleGalleryImagesChange = (files) => {
//     setGalleryImagesChanged(true);
//     if (!files || (Array.isArray(files) && files.length === 0)) return;

//     setMedia((prev) => {
//       const currentGallery = Array.isArray(prev.gallery) ? prev.gallery : [];
//       const newFiles = Array.isArray(files) ? files : [files].filter(Boolean);
//       return {
//         ...prev,
//         gallery: [...currentGallery, ...newFiles],
//       };
//     });

//     const filesArray = Array.isArray(files) ? files : [files].filter(Boolean);
//     const newPreviewUrls = filesArray.map((file) => URL.createObjectURL(file));
//     setGalleryPreviewUrls((prev) => {
//       const prevUrls = Array.isArray(prev) ? prev : [];
//       return [...prevUrls, ...newPreviewUrls];
//     });
//   };

//   const handleRemoveGalleryImage = (index) => {
//     setGalleryImagesChanged(true);
//     setMedia((prev) => {
//       const updatedGallery = [...prev.gallery];
//       updatedGallery.splice(index, 1);
//       return { ...prev, gallery: updatedGallery };
//     });

//     setGalleryPreviewUrls((prev) => {
//       const updatedPreviews = [...prev];
//       if (
//         updatedPreviews[index] &&
//         typeof updatedPreviews[index] === "string" &&
//         updatedPreviews[index].startsWith("blob:")
//       ) {
//         URL.revokeObjectURL(updatedPreviews[index]);
//       }
//       updatedPreviews.splice(index, 1);
//       return updatedPreviews;
//     });
//   };

//   const handleVideoFileChange = (file) => {
//     setVideoChanged(true);
//     if (!file) {
//       setMedia((prev) => ({ ...prev, videoFile: null }));
//       if (videoPreviewUrl && videoPreviewUrl.startsWith("blob:")) {
//         URL.revokeObjectURL(videoPreviewUrl);
//       }
//       setVideoPreviewUrl(null);
//       return;
//     }

//     setMedia((prev) => ({ ...prev, videoFile: file }));
//     if (videoPreviewUrl && videoPreviewUrl.startsWith("blob:")) {
//       URL.revokeObjectURL(videoPreviewUrl);
//     }
//     const videoUrl = URL.createObjectURL(file);
//     setVideoPreviewUrl(videoUrl);
//   };

//   const handleSpecificationsChange = (value) => {
//     setDetails((prev) => ({
//       ...prev,
//       specifications: value || "",
//     }));
//   };

//   const handleSubmit = async (e) => {
//     if (e) {
//       e.preventDefault();
//       e.stopPropagation();
//     }

//     setIsSubmitting(true);

//     try {
//       if (!productInfo.productName) {
//         toast.error("Product name is required");
//         setIsSubmitting(false);
//         return;
//       }

//       if (!productInfo.category_id) {
//         toast.error("Category is required");
//         setIsSubmitting(false);
//         return;
//       }

//       if (!pricing.retailPrice) {
//         toast.error("Retail price is required");
//         setIsSubmitting(false);
//         return;
//       }

//       if (!seo.title) {
//         toast.error("SEO title is required");
//         setIsSubmitting(false);
//         return;
//       }

//       if (!seo.keywords) {
//         toast.error("SEO keywords are required");
//         setIsSubmitting(false);
//         return;
//       }

//       if (!seo.meta_description) {
//         toast.error("SEO meta description is required");
//         setIsSubmitting(false);
//         return;
//       }

//       const formData = new FormData();
//       formData.append("name", productInfo.productName);
//       formData.append("category_id", productInfo.category_id);
//       formData.append("type", productInfo.type || "prints");
//       formData.append("sku", productIdentifiers.sku || "");
//       formData.append("manufacturer", productIdentifiers.manufacturer || "");
//       formData.append("model", productIdentifiers.model || "");
//       formData.append("price", pricing.retailPrice);
//       formData.append("discount_amount", pricing.discountAmount || "0");
//       formData.append("description", details.description || "");
//       formData.append("refund_policy", details.refund_policy || "");
//       formData.append("specifications", details.specifications || "");
//       formData.append("status", "1");

//       // Handle wholesale data
//       formData.append("allow_wholesale", pricing.allowWholesale ? "1" : "0");
//       formData.append("wholesale_price", pricing.wholesale_price || "0");
//       formData.append("wholesale_quantity", pricing.wholesale_quantity || "1");

//       // Handle Labels
//       if (
//         Array.isArray(productInfo.productLabels) &&
//         productInfo.productLabels.length
//       ) {
//         productInfo.productLabels.forEach((label, index) => {
//           const labelId =
//             typeof label === "object" && label.id ? label.id : label;
//           formData.append(`labels[${index}]`, labelId);
//         });
//       }

//       // Handle Attributes
//       if (specificAttributes?.length) {
//         specificAttributes.forEach((attr, index) => {
//           formData.append(
//             `attributes[${index}][general_attribute_id]`,
//             attr.general_attribute_id || "1",
//           );

//           if (attr.values?.length) {
//             attr.values.forEach((val, valIndex) => {
//               console.log(val);
//               formData.append(
//                 `attributes[${index}][attribute_values][${valIndex}][id]`,
//                 val.id || val.value || val.attribute_name || "",
//               );

//               formData.append(
//                 `attributes[${index}][attribute_values][${valIndex}][price_adjustment]`,
//                 val.price_adjustment || val.price || "0",
//               );
//               formData.append(
//                 `attributes[${index}][attribute_values][${valIndex}][price_type]`,
//                 val.price_type === "Per Item" ? "fixed" : "percentage",
//               );

//               formData.append(
//                 `attributes[${index}][attribute_values][${valIndex}][attribute_name]`,
//                 val.attribute_name || val.value || "",
//               );
//               formData.append(
//                 `attributes[${index}][attribute_values][${valIndex}][attribute_info]`,
//                 val.additional_info || val.attribute_info || "",
//               );
//             });
//           }
//         });
//       }

//       // Handle Size Variations ONLY if user added them
//       if (sizeVariations?.length > 0) {
//         sizeVariations.forEach((size, index) => {
//           if (size.size_name?.trim()) {
//             formData.append(
//               `size_variations[${index}][size_name]`,
//               size.size_name,
//             );
//             formData.append(
//               `size_variations[${index}][size_qty]`,
//               size.size_qty || "0",
//             );
//             formData.append(
//               `size_variations[${index}][size_price]`,
//               size.size_price || "0",
//             );
//           }
//         });
//       }

//       // Handle Featured Image
//       if (media.featureImage) {
//         formData.append("featured_image", media.featureImage);
//       }

//       // Handle Additional Images
//       if (media.gallery && media.gallery.length > 0) {
//         media.gallery.forEach((image, index) => {
//           if (image instanceof File) {
//             formData.append(`additional_images[${index}]`, image);
//           }
//         });
//       }

//       // Handle Video
//       if (media.videoFile) {
//         formData.append("video", media.videoFile);
//       }
//       if (media.videoLink) {
//         formData.append("video_link", media.videoLink);
//       }

//       // Handle PDF Files if any
//       if (media.pdfFiles && media.pdfFiles.length > 0) {
//         media.pdfFiles.forEach((pdf, index) => {
//           if (pdf instanceof File) {
//             formData.append(`pdf_files[${index}]`, pdf);
//           } else if (typeof pdf === "string") {
//             formData.append(`pdf_files[${index}]`, pdf);
//           }
//         });
//       }

//       formData.append("seo[title]", seo.title);
//       formData.append(
//         "seo[slug]",
//         seo.slug || seo.title.toLowerCase().replace(/\s+/g, "-"),
//       );
//       formData.append("seo[keywords]", seo.keywords);
//       formData.append("seo[meta_tags]", seo.meta_tags || "");
//       formData.append("seo[meta_description]", seo.meta_description);

//       formData.append(
//         "shipping[free_shipping]",
//         shipping.free_shipping ? "1" : "0",
//       );
//       formData.append(
//         "shipping[delivery_time]",
//         shipping.delivery_time || "3-5 days",
//       );
//       formData.append("shipping[variant]", shipping.variant || "Whole order");
//       formData.append("shipping[shipping_cost]", shipping.shipping_cost || "0");
//       formData.append(
//         "shipping[shipping_location]",
//         shipping.shipping_location || "Worldwide",
//       );

//       try {
//         if (isEditMode && product?.product_uuid) {
//           formData.append("_method", "PUT");

//           const response = await updateProduct({
//             path: `products/${product.product_uuid}`,
//             body: formData,
//             method: "POST",
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           });

//           if (!response.error && response.data?.status === 1) {
//             toast.success("Product updated successfully");
//             if (onCreate && typeof onCreate === "function") {
//               onCreate();
//             }
//           } else {
//             handleApiError(response);
//           }
//         } else {
//           const response = await createProduct({
//             path: "products",
//             body: formData,
//             method: "POST",
//             headers: {
//               "Content-Type": "multipart/form-data",
//             },
//           });

//           if (!response.error && response.data?.status === 1) {
//             toast.success("Product created successfully");
//             if (onCreate && typeof onCreate === "function") {
//               onCreate();
//             }
//           } else {
//             handleApiError(response);
//           }
//         }
//       } catch (error) {
//         console.error("Error saving product:", error);
//         toast.error(error.message || "An unexpected error occurred");
//       }
//     } catch (error) {
//       console.error("Form validation error:", error);
//       toast.error(error.message || "An unexpected error occurred");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleApiError = (response) => {
//     const errorMsg =
//       response.error?.data?.message ||
//       (response.error?.status === 0
//         ? "Network error: Unable to connect to API"
//         : "Failed to save product");
//     toast.error(errorMsg);

//     if (response.error?.data?.errors) {
//       console.error("Validation errors:", response.error.data.errors);
//       const firstError = Object.values(response.error.data.errors)[0];
//       if (firstError && firstError.length > 0) {
//         toast.error(firstError[0]);
//       }
//     } else {
//       console.error("API Error:", response.error);
//     }
//   };

//   return {
//     productInfo,
//     setProductInfo,
//     productIdentifiers,
//     setProductIdentifiers,
//     pricing,
//     setPricing,
//     variations,
//     setVariations,
//     details,
//     setDetails,
//     media,
//     setMedia,
//     shipping,
//     setShipping,
//     seo,
//     setSeo,
//     isSubmitting,
//     previewImageUrl,
//     setPreviewImageUrl,
//     galleryPreviewUrls,
//     setGalleryPreviewUrls,
//     videoPreviewUrl,
//     setVideoPreviewUrl,
//     categories,
//     subCategories,
//     childCategories,
//     isLoadingProduct,
//     isLoadingCategories,
//     isLoadingSubCategories,
//     isLoadingChildCategories,
//     specificAttributes,
//     sizeVariations,
//     handleLabelsChange,
//     handleFeatureImageChange,
//     handleGalleryImagesChange,
//     handleRemoveGalleryImage,
//     handleVideoFileChange,
//     handleSpecificationsChange,
//     handleSubmit,
//     setSpecificAttributes,
//     setSizeVariations,
//   };
// };

// export default useProductForm;
