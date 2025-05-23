import { useState, useEffect } from "react";
import DynamicTable from "@/ui/DynamicTable";
import { toast } from "react-toastify";
import DeleteModal from "@/ui/DeleteModal";
import CreateProduct from "../components/CreateProduct";
import {
  useDeleteMutation,
  useGetQuery,
  usePostMutation,
} from "@/services/apiService";
import EditDropdown from "../Productsattributes/components/EditDropdown";
import Gallery from "../components/Gallery";
import ProductHighlight from "../components/ProductHighlight";
import { Navigate, useNavigate } from "react-router-dom";
export function Products() {
  const [currentProductData, setCurrentProductData] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [viewCreateForm, setViewCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isHighlightModalOpen, setIsHighlightModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  // Define table columns
  const columns = [
    { key: "name", label: "Product" },
    { key: "category", label: "Category" },
    { key: "price", label: "Price" },
    { key: "sales", label: "Sales" },
    { key: "status", label: "Status", toggleable: true },
    { key: "actions", label: "Actions" },
  ];
  // API queries with authentication headers and pagination parameters
  const {
    data: productsData,
    isLoading,
    refetch,
  } = useGetQuery(
    {
      path: `/products?page=${currentPage}&per_page=${itemsPerPage}${searchTerm ? `&search=${searchTerm}` : ""}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  useEffect(() => {
    refetch();
  }, [currentPage, searchTerm, refetch]);
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteMutation();
  const [updateProductStatus, { isLoading: isUpdating }] = usePostMutation();
  useEffect(() => {
    if (productsData) {
      if (productsData.meta?.pagination?.total) {
        setTotalItems(productsData.meta.pagination.total);
      } else if (productsData.meta?.total) {
        setTotalItems(productsData.meta.total);
      } else if (productsData.pagination?.total) {
        setTotalItems(productsData.pagination.total);
      } else if (productsData.total) {
        setTotalItems(productsData.total);
      } else {
        setTotalItems(productsData.data.length);
      }
      const formattedProducts = productsData.data.map((product) => {
        const isActive =
          product.status === true ||
          product.status === 1 ||
          product.status === "1" ||
          product.status === "Active";
        return {
          id: product.id,
          uuid: product.product_uuid,
          name: (
            <div className="flex items-center gap-6">
              <img
                width={35}
                height={35}
                className="rounded"
                src={
                  product?.featured_image ||
                  "https://tse4.mm.bing.net/th?id=OIP.7Tf4hmxqGgZ5S8aSgy_9FQHaEO&pid=Api&P=0&h=220"
                } // fallback image
              />
              <span className="font-medium text-sm">{product?.name}</span>
            </div>
          ),
          category: product.category.name || "N/A",
          inventory: "In Stock",
          price: `$${product.price}`,
          sales: product.sale_count,
          rating: "N/A",
          status: isActive ? 1 : 0,
          actions: (
            <div className="flex space-x-2">
              <EditDropdown
                onEdit={() => handleEditProduct(product)}
                onDuplicate={() => navigateToDuplicate(product)}
                onViewGallery={() => handleViewGallery(product)}
                onHighlights={() => handleHighlights(product)}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentProductData(product);
                  setIsDeleteModalOpen(true);
                }}
                className="text-pinkclr hover:text-red-900"
                disabled={isDeleting}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          ),
        };
      });
      setProducts(formattedProducts);
    }
  }, [productsData]);
  const handleToggleAvailability = async (row, newStatus) => {
    try {
      const product = productsData.data.find((p) => p.id === row.id);

      if (!product) return;
      const response = await updateProductStatus({
        path: `products/${product.product_uuid}?_method=put`,
        method: "POST",
        body: {
          status: newStatus ? 1 : 0, // Always send numeric status to API
        },
      }).unwrap();
      if (!response.error) {
        toast.success("Product status updated successfully!");
        refetch(); // Refresh the product list after status update
      } else {
        toast.error(
          response.error.data?.message || "Failed to update product status",
        );
      }
    } catch (error) {
      toast.error(error.data?.message || "Failed to update product status");
    }
  };

  const navigateToDuplicate = (product) => {
    const duplicatedProduct = JSON.parse(JSON.stringify(product));
    console.log(duplicatedProduct);

    duplicatedProduct.id = null;
    duplicatedProduct.product_uuid = null;
    duplicatedProduct.name = duplicatedProduct.name + " (Copy)";
    duplicatedProduct.sku = duplicatedProduct.sku
      ? duplicatedProduct.sku + "-copy"
      : "";

    // Normalize labels to array of IDs
    if (Array.isArray(duplicatedProduct.labels)) {
      duplicatedProduct.labels = duplicatedProduct.labels.map((label) =>
        typeof label === "object" ? label.id || label : label,
      );
    } else {
      duplicatedProduct.labels = [];
    }

    setEditingProduct(duplicatedProduct);
    setViewCreateForm(true);
  };

  // back button
  const handleBack = () => {
    setViewCreateForm(false);
  };
  const handleAddProduct = () => {
    setEditingProduct(null);
    // setViewCreateForm(true);
    navigate("/create-product");
  };
  const handleEditProduct = (product) => {
    navigate(`/edit-product/${product.product_uuid}`, {
      state: { product }, // pass product inside state
    });
  };

  const handleViewGallery = (product) => {
    setCurrentProductData(product);
    setIsGalleryModalOpen(true);
  };
  const handleHighlights = (product) => {
    setCurrentProductData(product);
    setIsHighlightModalOpen(true);
  };

  const onCreate = () => {
    setViewCreateForm(false);
    setEditingProduct(null);
  };
  const handleDeleteConfirm = async () => {
    if (!currentProductData) {
      toast.error("No product selected for deletion!");
      return;
    }
    try {
      const res = await deleteProduct({
        path: `products/${currentProductData.product_uuid}`,
        method: "DELETE",
      });
      if (!res.error) {
        toast.success("Product deleted successfully");
        refetch();
      } else {
        toast.error(res.error.data.message || "Failed to delete product");
      }
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page on new search
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  // Calculate pagination information
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const paginationInfo = `Showing ${startItem} to ${endItem} of ${totalItems} entries`;

  return (
    <div className="mt-12 mb-8 flex bg-[#F2F7FB] flex-col gap-12 px-8">
      {/* Dynamic Table for Products */}
      {viewCreateForm ? (
        <CreateProduct
          product={editingProduct}
          onBack={handleBack}
          onCreate={onCreate}
        />
      ) : (
        <>
          <DynamicTable
            tableTitle="All Products"
            columns={columns}
            data={products}
            onAdd={handleAddProduct}
            onSearch={handleSearch}
            onStatusChange={handleToggleAvailability}
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            isLoading={isLoading || isUpdating || isDeleting}
            addButtonText="Add New Product"
          />

          {/* Gallery Modal */}
          {currentProductData && (
            <Gallery
              product={currentProductData}
              // product={{
              //   uuid: currentProductData.uuid,
              //   name: currentProductData.name,
              // }}
              isOpen={isGalleryModalOpen}
              onClose={() => setIsGalleryModalOpen(false)}
            />
          )}
        </>
      )}

      {/* Delete Modal */}
      <DeleteModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteConfirm}
        rowData={currentProductData}
        isDeleting={isDeleting}
      />

      {currentProductData && (
        <ProductHighlight
          product={{
            uuid: currentProductData.product_uuid,
            name: currentProductData.name,
          }}
          isOpen={isHighlightModalOpen}
          onClose={() => setIsHighlightModalOpen(false)}
        />
      )}
    </div>
  );
}
export default Products;
