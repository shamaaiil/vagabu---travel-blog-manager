import React from 'react';
import { useLocation } from 'react-router-dom';
import blogData from '../data/blogs.json'; // or your data fetching logic
import Card from './Card';

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q')?.toLowerCase() || '';

  const filteredBlogs = blogData.filter(
    (blog) =>
      blog.title.toLowerCase().includes(query) ||
      blog.description.toLowerCase().includes(query) ||
      blog.tags?.some((tag) => tag.toLowerCase().includes(query))
  );

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">
        Search Results for "<span className="text-blue">{query}</span>"
      </h2>

      {filteredBlogs.length === 0 ? (
        <p className="text-gray-500">No matching blogs found.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((blog) => (
            <Card key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </section>
  );
};

export default SearchResults;
