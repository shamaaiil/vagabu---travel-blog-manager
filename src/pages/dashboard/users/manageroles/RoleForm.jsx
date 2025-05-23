import React, { useState } from 'react';
import { Check } from 'lucide-react';

const RoleForm = ({title}) => {
  const [roleName, setRoleName] = useState('');
  const [permissions, setPermissions] = useState({});

  // All available permissions
  const permissionGroups = [
    // Left column
    [
      "Orders",
      "Affiliate Products",
      "Vendors & Vendor Verifications",
      "Product Discussion",
      "Blog",
      "General Settings",
      "Menu Page Settings",
      "Payment Settings",
      "Language Settings",
      "Manage Staff",
      "Order Verification",
      "Reports",
      "Categories"
    ],
    // Right column
    [
      "Products",
      "Customers",
      "Vendor Subscription Plans",
      "Set Coupons",
      "Messages",
      "Home Page Settings",
      "Email Settings",
      "Social Settings",
      "SEO Tools",
      "Subscribers",
      "Customer Subscription Plans",
      "Charities/Donations",
      "Bulk Product Upload"
    ]
  ];

  const handlePermissionChange = (permission) => {
    setPermissions(prev => ({
      ...prev,
      [permission]: !prev[permission]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      roleName,
      permissions
    });
    // API call would go here
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-pinkclr mb-6">{title}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Name</label>
          <input
            type="text"
            placeholder="Enter Name"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-pinkclr"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-pinkclr font-medium mb-4">Permissions</label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {permissionGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="space-y-3">
                {group.map(permission => (
                  <div key={permission} className="flex items-center">
                    <div 
                      className={`w-5 h-5 border ${permissions[permission] ? 'bg-blue-600 border-blue-600' : 'border-gray-400'} rounded flex items-center justify-center cursor-pointer`}
                      onClick={() => handlePermissionChange(permission)}
                    >
                      {permissions[permission] && <Check size={16} className="text-white" />}
                    </div>
                    <label className="ml-2 text-gray-700 cursor-pointer" onClick={() => handlePermissionChange(permission)}>
                      {permission} <span className="text-gray-400">*</span>
                    </label>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end">
          <button 
            type="submit"
            className="bg-pinkclr text-white px-6 py-2 rounded focus:outline-none focus:ring-2"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default RoleForm