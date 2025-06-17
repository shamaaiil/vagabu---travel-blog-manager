import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaPinterest, FaTiktok, FaLinkedinIn } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r bg-blue text-white py-10 px-6">
      <div className="max-w-7xl mx-auto gap-8">

        <div>
          <div className="flex space-x-8 justify-center mt-4 text-xl">
          <FaFacebookF/>
          <FaInstagram/>
          <FaTwitter/>
          <FaTiktok/>
          <FaLinkedinIn/>
          </div>
        </div>
   

        <div>
          {/* <h4 className="text-lg font-semibold mb-2">Links</h4> */}
          <ul className="flex justify-center space-x-8 text-sm mt-6">
            <Link to='/'>Home</Link>
            <Link to='/blogs'>Blogs</Link>
            <Link to='/destinations'>Destinations</Link>
            <Link to='/contact'>Contact</Link>
          </ul>
        </div>

      {/* Bottom Bar */}
      <div className="text-center text-xs text-gray-400 border-t border-gray-600 mt-10 pt-4">
        © 2025 Travelog. All Rights Reserved.
      </div>
         </div>
    </footer>
  );
};

export default Footer;
