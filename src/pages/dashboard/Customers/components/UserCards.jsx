// import React from 'react';
// import { X } from 'lucide-react';

import DynamicTable from "../../tables"

 const columns = [
    { key: "image", label: "Image" },
    { key: "card_name", label: "Card Name" },
    { key: "brand", label: "Brand" },
    { key: "card_number", label: "Card Number" },
    { key: "expiry_date", label: "Expiry Date"},
    { key: "status", label: "Status"},
    { key: "created_at", label: "Created At"},
  ];

  const dummyCards = [
  {
    image: "https://via.placeholder.com/50x30?text=Visa",
    card_name: "Personal Travel Card",
    brand: "Visa",
    card_number: "**** **** **** 1234",
    expiry_date: "06/27",
    status: "Active",
    created_at: "2025-05-01T10:15:00Z",
  },
  {
    image: "https://via.placeholder.com/50x30?text=Master",
    card_name: "Business Gold",
    brand: "MasterCard",
    card_number: "**** **** **** 5678",
    expiry_date: "12/26",
    status: "Inactive",
    created_at: "2025-04-15T09:45:00Z",
  },
  {
    image: "https://via.placeholder.com/50x30?text=Amex",
    card_name: "Rewards Platinum",
    brand: "American Express",
    card_number: "**** **** **** 9012",
    expiry_date: "09/28",
    status: "Blocked",
    created_at: "2025-03-20T14:30:00Z",
  },
  {
    image: "https://via.placeholder.com/50x30?text=Visa",
    card_name: "Travel Plus",
    brand: "Visa",
    card_number: "**** **** **** 3456",
    expiry_date: "01/29",
    status: "Active",
    created_at: "2025-02-18T11:10:00Z",
  },
  {
    image: "https://via.placeholder.com/50x30?text=Rupay",
    card_name: "Local Spend Card",
    brand: "Rupay",
    card_number: "**** **** **** 7890",
    expiry_date: "08/26",
    status: "Inactive",
    created_at: "2025-01-25T08:55:00Z",
  },
];


// const UserCard = ({ isOpen, onClose, customer }) => {
//   if (!isOpen) return null;

//   // Handle backdrop click to close modal
//   const handleBackdropClick = (e) => {
//     if (e.target === e.currentTarget) {
//       onClose();
//     }
//   };

//   // Handle escape key to close modal
//   React.useEffect(() => {
//     const handleEscape = (e) => {
//       if (e.key === 'Escape') {
//         onClose();
//       }
//     };

//     if (isOpen) {
//       document.addEventListener('keydown', handleEscape);
//       document.body.style.overflow = 'hidden';
//     }

//     return () => {
//       document.removeEventListener('keydown', handleEscape);
//       document.body.style.overflow = 'unset';
//     };
//   }, [isOpen, onClose]);

//   return (
//     <div 
//       className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
//       onClick={handleBackdropClick}
//     >
//       <div className="bg-white rounded-3xl shadow-2xl max-w-[60%] w-full mx-4 relative">
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100 z-10"
//           aria-label="Close modal"
//         >
//           <X size={20} />
//         </button>

//         {/* Header */}
//         <div className="px-8 pt-6 pb-4 border-b border-gray-200">
//           <h2 className="text-xl font-semibold text-pinkclr">User Card</h2>
//         </div>

//         {/* Content */}
//         <div className="px-8 py-6">
//           <div className="flex ">
//             {/* Left side - Profile */}
//             <div className="flex flex-col items-center mr-8">
//               <div className="w-24 h-24 bg-gray-500 rounded-full flex items-center justify-center mb-4">
//                 <span className="text-white text-2xl font-medium">
//                   {customer?.fullName?.charAt(0)?.toUpperCase() || customer?.name?.charAt(0)?.toUpperCase() || 'U'}
//                 </span>
//               </div>
//               <h3 className="text-xl font-semibold text-textclr text-center">
//                 {customer?.fullName}
//               </h3>
//             </div>

//             {/* Right side - Information */}
//             <div className="flex-1 space-y-4">
//               <div className="flex justify-evenly items-center ">
//                 <span className="text-textclr font-medium">ID:</span>
//                 <span className="text-textclr font-semibold">{customer?.id}</span>
//               </div>

//               <div className="flex justify-evenly items-center">
//                 <span className="text-textclr font-medium">Card Name:</span>
//                 <span className="text-textclr font-semibold">{customer?.cardName}</span>
//               </div>

//               <div className="flex justify-evenly items-center">
//                 <span className="text-textclr font-medium">Brand:</span>
//                 <span className="text-textclr font-semibold">{customer?.brand}</span>
//               </div>

//               <div className="flex justify-evenly items-center">
//                 <span className="text-textclr font-medium">Last four digit:</span>
//                 <span className="text-textclr font-semibold">{customer?.lastFourDigits}</span>
//               </div>

//               <div className="flex justify-evenly items-center">
//                 <span className="text-textclr font-medium">Expiry Month:</span>
//                 <span className="text-textclr font-semibold">{customer?.expiryMonth}</span>
//               </div>

//               <div className="flex justify-evenly items-center">
//                 <span className="text-textclr font-medium">Expiry Year:</span>
//                 <span className="text-textclr font-semibold">{customer?.expiryYear}</span>
//               </div>

//               <div className="flex justify-evenly items-center">
//                 <span className="text-textclr font-medium">Is Default:</span>
//                 <span className="text-textclr font-semibold">{customer?.isDefault}</span>
//               </div>

//               <div className="flex justify-evenly items-center">
//                 <span className="text-textclr font-medium">Created at:</span>
//                 <span className="text-textclr font-semibold">
//                   {customer?.created_at}
//                 </span>
//               </div>

//               <div className="flex justify-evenly  items-center">
//                 <span className="text-textclr font-medium">Updated at:</span>
//                 <span className="text-textclr font-semibold">
//                   {customer?.updatedAt}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserCard;


const UserCard = () => {
    return(
      <>
       <DynamicTable
       tableTitle="User Cards"
       columns={columns}
       data={dummyCards}
       />
      </>
    )
}

export default UserCard