import React from "react";
import BackButton from "./BackButton";

const Header = ({ title, imageSrc }) => {
  return (
   <div className="relative w-full h-60 md:h-32 overflow-hidden">
      <img
        src={imageSrc || "/public/img/WhatsApp Image 2025-06-04 at 1.04.09 PM.jpeg"}
        alt={title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-blue bg-opacity-50"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-pastelgrey text-6xl md:text-7xl font-bold font-dancingScript text-center px-4">
          {title}
        </h1>
      </div>
    </div>
  );
};

export default Header;
