import { useState, useEffect } from 'react';

const StaffForm = ({ onSubmit, onClose, initialData, title, buttonText }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    password: '',
    confirmPassword: '',
    profileImage: null
  });

  // Use useEffect to properly set form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.full_name || '',
        email: initialData.email || '',
        phone: initialData.phone_number || '',
        role: initialData.role || '',
        password: '',  // Don't prefill passwords for security
        confirmPassword: '',
        profileImage: null
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" onClick={handleOverlayClick}>
      <div className="absolute inset-0 bg-black bg-opacity-30 modal-overlay"></div>
      <div className="bg-white rounded shadow-lg p-8 w-full max-w-2xl z-10 mx-4 h-[90vh] overflow-y-scroll">
        <h2 className="text-xl font-medium text-pink-500 mb-6 border-b pb-2">{title}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Left Column */}
            <div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="User Name"
                  className="w-full px-4 py-2 border border-gray-200 rounded-md"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Role</label>
                <div className="relative">
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full appearance-none px-4 py-2 border border-gray-200 rounded-md pr-10"
                  >
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="staff">Staff</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-600 mb-2">
                  {initialData ? 'New Password' : 'Password'}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={initialData ? "New password" : "Password"}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md"
                />
              </div>
            </div>
            
            {/* Right Column */}
            <div>
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  className="w-full px-4 py-2 border border-gray-200 rounded-md"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-600 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  className="w-full px-4 py-2 border border-gray-200 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-gray-600 mb-2">
                  {initialData ? 'Confirm New Password' : 'Confirm Password'}
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder={initialData ? "Confirm new password" : "Confirm Password"}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md"
                />
              </div>
            </div>
          </div>
          
          {/* Staff Profile Image - Centered */}
          <div className="flex flex-col items-center mt-6">
            <label className="block text-gray-600 mb-2">Staff Profile Image</label>
            <div className="border border-dashed border-gray-300 w-32 h-32 flex items-center justify-center">
              {formData.profileImage ? (
                <img 
                  src={URL.createObjectURL(formData.profileImage)} 
                  alt="Profile Preview" 
                  className="max-w-full max-h-full" 
                />
              ) : initialData?.photo ? (
                <img 
                  src={initialData.photo} 
                  alt="Current Profile" 
                  className="max-w-full max-h-full" 
                />
              ) : null}
            </div>
            <p className="text-sm text-gray-500 mt-2">Preferred size: (600x600 Square size)</p>
            <button
              type="button"
              className="px-6 py-2 border border-teal-500 text-teal-500 rounded-md hover:bg-teal-50 mt-4"
              onClick={() => document.getElementById('fileInput').click()}
            >
              Upload Image
            </button>
            <input
              id="fileInput"
              type="file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files[0]) {
                  setFormData(prev => ({ ...prev, profileImage: e.target.files[0] }));
                }
              }}
              accept="image/*"
            />
          </div>
          
          {/* Submit Button - Right Aligned */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600"
            >
             {buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffForm;