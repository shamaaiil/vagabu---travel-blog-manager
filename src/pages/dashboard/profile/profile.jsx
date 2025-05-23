import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Avatar,
  Typography,
  Button,
} from "@material-tailwind/react";
import { PencilIcon } from "@heroicons/react/24/solid";
import { usePostMutation } from "@/services/apiService";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "@/features/AuthSlice/authSlice";
import EditProfile from "./components/EditProfile";

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [postMutation, { isLoading }] = usePostMutation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    image: "",
  });

  useEffect(() => {
    setFormData({
      full_name: user?.full_name || "",
      email: user?.email || "",
      phone_number: user?.phone_number || "",
      image: user?.image || "", 
    });
  }, [user]);

  const saveProfileChanges = async (values) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("full_name", values.full_name);
      formDataToSend.append("phone_number", values.phone_number)

      if (formData.imageFile) {
        formDataToSend.append("image", formData.imageFile);
      }

      const profileResponse = await postMutation({
        path: "/profile/update?_method=patch",
        body: formDataToSend,
        method: "POST",
      });

      if (profileResponse.error) {
        toast.error(
          profileResponse?.error?.data?.message || "Profile update failed.",
        );
      } else {
        setIsEditing(false);
        dispatch(updateProfile(profileResponse));
        toast.success("Profile updated successfully.");
      }
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        image: URL.createObjectURL(file), // Preview
        imageFile: file, // Store the file
      }));
    }
  };

  return (
    <div className="container mx-auto px-8 pt-10 ">
<Card className="w-full px-2 shadow-md rounded-lg">
  <CardBody className="">
    
   <div className="flex items-center justify-between mb-2">
   <Typography variant="h5" className="text-pink-600 font-semibold text-lg ">
    {isEditing ? "Edit Profile" : "Profile"}
    </Typography>
    {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center mb-3 text-blue-500 hover:text-blue-700 "
              >
                <PencilIcon className="h-4 w-4 mr-1 " />
                <span>Edit</span>
                
              </button>
            )}
            
   </div>
   <div className="w-full border border-gray-300  mb-3"></div>

      {isEditing ? (
            <EditProfile
              formData={formData}
              saveChanges={saveProfileChanges}
              cancelEdit={() => setIsEditing(false)}
              handleImageChange={handleImageChange}
            />
          ) : (

    <div className="">
       
     
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5  mb-8">
        <div className="col-span-1 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Name:</label>
          <input
            type="text"
            value={formData.full_name}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="col-span-1 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
          <input
            type="email"
            value={formData.email}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="col-span-1 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone:</label>
          <input
            type="text"
            value={formData.phone_number}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* <div className="col-span-1 md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name:</label>
          <input
            type="text"
            value={formData.shop_name}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div> */}
      </div>

      <div className="flex flex-col items-center justify-center">
        <Typography variant="small" className="text-gray-600 mb-2 text-center">
          Customer Profile Image
        </Typography>
        <div className="w-[150px] h-[150px] border border-gray-300 rounded-md flex items-center justify-center mb-2">
        {formData.image ? (
              <img
             src={formData.image}
            alt="Profile"
           className="w-full h-full object-cover rounded-md"
             />
            ) : (
             <span className="text-gray-400">No image</span>
               )}
        </div>
        <Typography variant="small" className="text-gray-500 text-center mb-2">
          Preferred size:(600x600 Square size)
        </Typography>
      </div>
    </div>
    )}
  </CardBody>
</Card>

    </div>
  );
}

export default Profile;