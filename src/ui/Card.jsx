import { useNavigate } from "react-router-dom";

const Card = ({ 
  image, 
  category, 
  title, 
  description, 
  author, 
  authorImage, 
  date,
  categoryColor = "bg-indigo-600",
  className = "",
  slug
}) => {
   const navigate = useNavigate()

const handleClick = () => {
    navigate(`/blogs/${slug}`); // Use id instead of slug
  };


  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden max-w-sm hover:shadow-xl transition-shadow duration-300 ${className}`}
     onClick={handleClick}
    >
      {/* Image Container */}
      <div className="relative">
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-fill"
        />
        {/* Category Badge */}
        <div className={`absolute top-4 left-4 ${categoryColor} text-grey px-3 py-1 rounded-full text-sm font-medium uppercase tracking-wide`}>
          {category}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-blue mb-3 leading-tight">
          {title}
        </h3>
        
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {description}
        </p>
        
        {/* Author Info */}
        <div className="flex items-center">
          <img 
            src='/public/img/gallery1.jpeg' 
            alt={author}
            className="w-8 h-8 rounded-full object-cover mr-3"
          />
          <div>
            <p className="text-sm font-medium text-gray-600">{author}</p>
            <p className="text-xs text-gray-500">{date}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card