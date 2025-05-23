
// ProductItem.js - A fully reusable component that can be imported anywhere
const ProductItem = ({ 
  image = "",
  name ,
  description = "",
  price,
  size = "",
  quantity,
  currency = "$"
}) => {
  return (
    <div className="flex w-[50%] p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex-shrink-0 mr-4">
        <img 
          src={image} 
          alt={name} 
          className="w-24 h-24 object-cover rounded-md"
        />
      </div>
      
      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        {description && (
          <p className="text-sm text-gray-600 mb-1">{description}</p>
        )}
        <div className="mt-1">
          <p className="font-medium">Price: {currency}{price}</p>
          {size && <p className="text-sm text-gray-700">Size: {size}</p>}
        </div>
         <div className="mt-1">
          <p className="font-medium">Quantity: {quantity}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductItem