import React from "react";
import { useParams, Link } from "react-router-dom";
import { useGetQuery } from "@/services/apiService";
import {
  FaCalendarAlt,
  FaUser,
  FaClock,
  FaTag,
  FaMapMarkerAlt,
  FaLightbulb,
} from "react-icons/fa";
import BackButton from "@/ui/BackButton";

const BlogDetail = () => {
  const { slug } = useParams();
  const {
    data: blogs,
    isLoading,
    error,
  } = useGetQuery({
    path: `/blogs?slug=${slug}`,
  });

  const blog = blogs?.[0];

  // Error or no blog found
  if (error || !blog) {
    return (
      <div className="w-[95%] mx-auto py-12 px-4 text-center">
        <div className="max-w-4xl mx-auto bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
          <p className="text-lg font-semibold">Oops! Something went wrong.</p>
          <p>Blog not found or there was an error loading the content.</p>
          <Link
            to="/blogs"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  // Share function for social media
  const shareBlog = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: window.location.href,
      });
    } else {
      alert("Share feature not supported. Copy the URL to share!");
    }
  };

  return (
    <div className="w-[95%] mx-auto py-12 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <BackButton label="Back To Blogs"/>
        {/* Hero Image */}
        <div className="relative mb-8">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-[500px] object-cover rounded-xl shadow-xl"
            loading="lazy"
          />
          {blog.featured && (
            <span className="absolute top-4 left-4 bg-yellow-400 text-white text-sm font-semibold px-3 py-1 rounded-full">
              Featured
            </span>
          )}
        </div>

        {/* Blog Header */}
        <h1 className="text-4xl md:text-5xl font-bold text-blue mb-4 leading-tight">
          {blog.title}
        </h1>
        <p className="text-xl text-gray-600 mb-6 italic">{blog.excerpt}</p>

        {/* Meta Information */}
        <div className="flex flex-wrap gap-4 items-center text-gray-600 mb-8 border-b pb-4">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-blue-500" />
            <span>{new Date(blog.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaUser className="text-blue-500" />
            <span>{blog.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="text-blue-500" />
            <span>{blog.readTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaTag className="text-blue-500" />
            <span>{blog.category}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {blog.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Story Content */}
        <div className="prose prose-lg text-gray-700 mb-12">
          {typeof blog.story === "string" && blog.story ? (
            blog.story
              .split("\n\n")
              .filter(
                (paragraph) =>
                  !paragraph.includes(blog.travelTip) &&
                  !paragraph.includes(blog.funFact),
              )
              .map((paragraph, index) => (
                <p key={index} className="mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))
          ) : (
            <p className="text-gray-500 italic">No story content available.</p>
          )}
        </div>

        {/* Travel Tip */}
        <div className="bg-blue-50 p-6 rounded-lg mb-8 shadow-md">
          <h3 className="text-xl font-semibold text-blue mb-2 flex items-center gap-2">
            <FaMapMarkerAlt /> Travel Tip
          </h3>
          <p className="text-gray-700">{blog.travelTip}</p>
        </div>

        {/* Fun Fact */}
        <div className=" p-6 rounded-lg mb-8 shadow-md">
          <h3 className="text-xl font-semibold text-blue mb-2 flex items-center gap-2">
            <FaLightbulb /> Fun Fact
          </h3>
          <p className="text-gray-700">{blog.funFact}</p>
        </div>

        {/* Share and Navigation */}
        
      </div>
    </div>
  );
};

export default BlogDetail;
