import { useGetQuery } from "@/services/apiService";
import Card from "@/ui/Card";
import Header from "@/ui/Header";
import React, { useState } from "react";

function Blogs() {
 
  const [currentPage , setCurrentPage] = useState(1)
  const blogsPerPage = 8

  const { data: blogs } = useGetQuery({
    path: "/blogs",
  });

    const totalPages = Math.ceil((blogs?.length || 0) / blogsPerPage);
  const startIndex = (currentPage - 1) * blogsPerPage;
  const currentBlogs = blogs?.slice(startIndex, startIndex + blogsPerPage);



  return (
    <div className="py-10 ">
      <Header title="Blogs" imageSrc="/public/img/sharanforest (1).jpeg" />
      <h1 className="text-3xl text-center text-blue mt-10 font-semibold">Latest Travel Blogs & Insights</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 py-16 w-[95%] mx-auto gap-8">
        {currentBlogs?.map((blog) => (
          <Card
            key={blog.id}
            image={blog.image}
            title={blog.title}
            description={blog.excerpt}
            category={blog.category}
            author={blog.author}
            slug={blog.slug}
          />
        ))}
      </div>

        <div className="flex justify-center mt-10 gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === i + 1
                ? "bg-blue-700 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Blogs;
