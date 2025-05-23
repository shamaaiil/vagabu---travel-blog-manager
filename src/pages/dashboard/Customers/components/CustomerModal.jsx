// import React, { useState, useEffect, useRef } from "react";

// const DynamicCustomerModal = ({
//   title = "Edit Customer",
//   fields = [],
//   onSubmit,
//   onClose,
//   submitButtonText = "Update",
//   initialData = null,
// }) => {
//   const modalRef = useRef(null); // Reference to the modal container
//   console.log("initialData", initialData);

//   const getInitialFormData = () => {
//     const emptyInitial = fields.reduce((acc, field) => {
//       acc[field.name] = field.defaultValue || "";
//       return acc;
//     }, {});

//     // Set default status to active if creating a new customer
//     if (!initialData) {
//       emptyInitial.status = 1; // Default to active
//       emptyInitial.isBanned = 0; // Default to not banned
//     }

//     return initialData ? { ...emptyInitial, ...initialData } : emptyInitial;
//   };

//   const [formData, setFormData] = useState(getInitialFormData());
//   const [isBanned, setIsBanned] = useState(
//     initialData?.isBanned === "Yes" || initialData?.isBanned === 1 || false,
//   );
//   const [profileImage, setProfileImage] = useState(initialData?.profile);

//   // Close modal on clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (modalRef.current && !modalRef.current.contains(event.target)) {
//         onClose(); // Close the modal if clicked outside
//       }
//     };

//     // Add event listener for clicking outside
//     document.addEventListener("mousedown", handleClickOutside);

//     // Clean up the event listener when the component unmounts
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [onClose]);

//   useEffect(() => {
//     if (initialData) {
//       setFormData((prev) => ({ ...prev, ...initialData }));
//       if ("isBanned" in initialData) {
//         setIsBanned(
//           initialData.isBanned === "Yes" || initialData.isBanned === 1,
//         );
//       }
//     }
//   }, [initialData]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     // Execute onChange handler if defined for the field
//     const field = fields.find((f) => f.name === name);
//     if (field && field.onChange) {
//       field.onChange(value);
//     }

//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleProfileImageUpload = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setProfileImage(e.target.files[0]);
//     }
//   };

//   const handleSubmit = () => {
//     onSubmit({
//       ...formData,
//       isBanned: isBanned ? 1 : 0,
//       profileImage: profileImage || formData.profileImage,
//     });
//   };

//   // Get field by name helper function
//   const getField = (name) => fields.find((f) => f.name === name);

//   // Render text input with label
//   const renderInput = (name, label, placeholder) => {
//     const field = getField(name);
//     if (!field) return null;

//     return (
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           {label}
//         </label>
//         <input
//           type="text"
//           name={name}
//           value={formData[name] || ""}
//           onChange={handleChange}
//           placeholder={placeholder}
//           className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
//         />
//       </div>
//     );
//   };

//   // Render the profile image field centered
//   const renderProfileImageField = () => {
//     return (
//       <div className="text-center">
//         <div className="text-center text-sm font-medium text-gray-700 mb-2">
//           Customer Profile Image
//         </div>
//         <div className="w-48 h-48 mx-auto border border-gray-300 rounded mb-2 flex items-center justify-center">
//           {profileImage || initialData?.profileImage ? (
//             <img
//               src={
//                 profileImage
//                   ? URL.createObjectURL(profileImage)
//                   : initialData?.profileImage
//               }
//               alt="Profile"
//               className="max-h-full max-w-full"
//             />
//           ) : (
//             <span className="text-gray-400 text-xs">No image</span>
//           )}
//         </div>
//         <p className="text-xs text-gray-500 mb-2">
//           Preferred size:(600x600 Square size)
//         </p>
//         <button
//           type="button"
//           onClick={() => document.getElementById("profile-upload").click()}
//           className="px-4 py-1.5 border border-teal-500 text-teal-500 rounded-md text-sm hover:bg-teal-50"
//         >
//           Upload Image
//         </button>
//         <input
//           id="profile-upload"
//           name="profileImage"
//           type="file"
//           onChange={handleProfileImageUpload}
//           className="hidden"
//           accept="image/*"
//         />
//       </div>
//     );
//   };

//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
//       <div
//         ref={modalRef}
//         className="relative bg-white rounded-xl shadow-lg w-full max-w-2xl mx-4"
//       >
//         {/* Header with pink title and close button */}
//         <div className="p-4 flex justify-between items-center">
//           <h2 className="text-lg font-medium text-pinkclr">{title}</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700"
//             aria-label="Close"
//           >
//             <svg
//               className="w-5 h-5"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M6 18L18 6M6 6l12 12"
//               ></path>
//             </svg>
//           </button>
//         </div>

//         {/* Horizontal line separator */}
//         <div className="border-b border-gray-200 w-full"></div>

//         <div className="p-5">
//           {/* First row: Name, Email, Phone in one row */}
//           <div className="grid grid-cols-3 gap-4 mb-6">
//             {renderInput("fullName", "Name", "Enter name")}
//             {renderInput("email", "Email", "Enter email")}
//             {renderInput("phoneNumber", "Phone", "Enter phone number")}
//           </div>

//           {/* Second row: Centered Image upload */}
//           <div className="mb-6">{renderProfileImageField()}</div>

//           {/* Save and Cancel buttons at bottom right */}
//           <div className="flex justify-end gap-3 mt-6">
//             <button
//               onClick={onClose}
//               className="px-6 py-1.5 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleSubmit}
//               className="px-6 py-1.5 bg-teelclr text-white rounded-xl text-sm hover:bg-teal-600"
//             >
//               {submitButtonText}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DynamicCustomerModal;

import React, { useState, useEffect, useRef } from "react";

const DynamicCustomerModal = ({
  title = "Edit Customer",
  fields = [],
  onSubmit,
  onClose,
  submitButtonText = "Update",
  initialData = null,
}) => {
  const modalRef = useRef(null);

  const getInitialFormData = () => {
    const emptyInitial = fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue || "";
      return acc;
    }, {});

    if (!initialData) {
      emptyInitial.status = 1;
      emptyInitial.isBanned = 0;
    }

    return initialData ? { ...emptyInitial, ...initialData } : emptyInitial;
  };

  const [formData, setFormData] = useState(getInitialFormData());
  const [isBanned, setIsBanned] = useState(
    initialData?.isBanned === "Yes" || initialData?.isBanned === 1 || false,
  );

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
      if ("isBanned" in initialData) {
        setIsBanned(
          initialData.isBanned === "Yes" || initialData.isBanned === 1,
        );
      }
      if (initialData.profile) {
        setPreviewImage(initialData?.profile);
      }
    }
  }, [initialData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const field = fields.find((f) => f.name === name);
    if (field && field.onChange) {
      field.onChange(value);
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleProfileImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    onSubmit({
      ...formData,
      isBanned: isBanned ? 1 : 0,
      profileImage: profileImage || formData.profileImage,
    });
  };

  const getField = (name) => fields.find((f) => f.name === name);

  const renderInput = (name, label, placeholder) => {
    const field = getField(name);
    if (!field) return null;

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <input
          type="text"
          name={name}
          value={formData[name] || ""}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
      </div>
    );
  };

  const renderProfileImageField = () => {
    return (
      <div className="text-center">
        <div className="text-center text-sm font-medium text-gray-700 mb-2">
          Customer Profile Image
        </div>
        <div className="w-48 h-48 mx-auto border border-gray-300 rounded mb-2 flex items-center justify-center overflow-hidden">
          {previewImage ? (
            <img
              src={previewImage}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-gray-400 text-xs">No image</span>
          )}
        </div>
        <p className="text-xs text-gray-500 mb-2">
          Preferred size: (600x600 Square size)
        </p>
        <button
          type="button"
          onClick={() => document.getElementById("profile-upload").click()}
          className="px-4 py-1.5 border border-teal-500 text-teal-500 rounded-md text-sm hover:bg-teal-50"
        >
          Upload Image
        </button>
        <input
          id="profile-upload"
          name="profileImage"
          type="file"
          onChange={handleProfileImageUpload}
          className="hidden"
          accept="image/*"
        />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="relative bg-white rounded-xl shadow-lg w-full max-w-2xl mx-4"
      >
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-lg font-medium text-pinkclr">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <div className="border-b border-gray-200 w-full"></div>

        <div className="p-5">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {renderInput("fullName", "Name", "Enter name")}
            {renderInput("email", "Email", "Enter email")}
            {renderInput("phoneNumber", "Phone", "Enter phone number")}
          </div>

          <div className="mb-6">{renderProfileImageField()}</div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-6 py-1.5 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-1.5 bg-teelclr text-white rounded-xl text-sm hover:bg-teal-600"
            >
              {submitButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicCustomerModal;
