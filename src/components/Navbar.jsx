import React, { useState } from "react";
import { Search, User, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useGetQuery } from "@/services/apiService";
import { notifyManager } from "@tanstack/react-query";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const {data : blogData} = useGetQuery({
    path : '/blogs'
  })

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { name: "Home", to: "/" },
    { name: "About", to: "/about" },
    { name: "Blogs", to: "/blogs" },
    {name : "Destinations" , to : "/destinations"},
    { name: "Contact", to: "/contact" },
  ];

  const handleSearch = (e) => {
  if (e.key === 'Enter' && searchQuery.trim()) {
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery('');
    setIsMenuOpen(false); 
  }
};

const filteredSuggestions = blogData?.filter(
  (blog) =>
    searchQuery.length > 0 &&
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
);

  return (
    <div className=" w-[95%] mx-auto">
      <nav className="bg-grey/95 backdrop-blur-lg border-b border-pastelgrey/20 sticky top-0 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
             <img src="/public/img/Vagabu-removebg-preview.png" alt="" className="w-40"/>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.to}
                    onClick={() => console.log(`${item.name} clicked`)}
                    className="text-blue hover:text-blue hover:border-b-2 border-blue px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative group"
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue to-black group-hover:w-full transition-all duration-300"></span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Search Bar & Profile - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-pastelgrey" />
                </div>
               <input
    type="text"
    placeholder="Search..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === 'Enter' && searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setSearchQuery('');
        setIsMenuOpen(false);
      }
    }}
    className="block w-full pl-10 pr-3 py-2 border border-pastelgrey rounded-full leading-5 bg-grey/70 backdrop-blur-sm placeholder-pastelgrey focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent transition-all duration-300"
  />

    {searchQuery && (
    <div className="absolute top-full mt-2 w-full bg-white border border-pastelgrey rounded-lg shadow-lg z-50 max-h-64 overflow-auto">
      {filteredSuggestions?.length > 0 ? (
        filteredSuggestions.map((blog) => (
          <Link
            key={blog.slug}
            to={`/blogs/${blog.slug}`}
            onClick={() => {
              setSearchQuery('');
              setIsMenuOpen(false);
            }}
            className="block px-4 py-2 text-sm hover:bg-pastelgrey text-black"
          >
            {blog.title}
          </Link>
        ))
      ) : (
        <p className="px-4 py-2 text-sm text-gray-500">No results found.</p>
      )}
    </div>
  )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg text-black hover:text-blue hover:bg-pastelgrey transition-all duration-300"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <div
            className={`md:hidden transition-all duration-300 ease-in-out ${
              isMenuOpen
                ? "max-h-96 opacity-100 visible"
                : "max-h-0 opacity-0 invisible overflow-hidden"
            }`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 bg-grey/80 backdrop-blur-sm rounded-b-xl border-t border-pastelgrey">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-pastelgrey" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-pastelgrey rounded-full leading-5 bg-grey/70 backdrop-blur-sm placeholder-pastelgrey focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent transition-all duration-300"
                />
              </div>

              {/* Mobile Nav Items */}
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-blue hover:text-blue block px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 hover:bg-pastelgrey w-full "
                >
                  {item.name}
                </Link>
              ))}

            
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
