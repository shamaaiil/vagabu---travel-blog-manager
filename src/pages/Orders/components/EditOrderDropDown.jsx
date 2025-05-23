import React from 'react';

const EditOrderDropDown = ({ items = [], className = '', order, onItemClick }) => {
  return (
    <div className={`absolute top-10 right-0 bg-white shadow-lg rounded-2xl p-2 w-48 z-50 ${className}`}>
      <ul className="flex flex-col space-y-1">
        {items.map((item, index) => (
          <li key={index}>
            <div
              onClick={() => onItemClick(item)}
              className="text-[#2B3674] font-bold flex hover:text-blue-500 py-2 px-4 rounded-md items-center cursor-pointer"
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EditOrderDropDown;
