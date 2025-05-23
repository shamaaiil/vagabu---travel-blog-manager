import React, { useEffect, useState } from "react";
import { Card, Typography, Button, Input } from "@material-tailwind/react";
import { usePostMutation } from "@/services/apiService";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "@/features/AuthSlice/authSlice";

export function EditProfile() {
  const [postMutation] = usePostMutation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    shopName: "",
    image: "",
    imageFile: null,
  });

  useEffect(() => {
    setFormData({
      full_name: user?.full_name || "",
      email: user?.email || "",
      phone_number: user?.phone_number || "",
      shopName: user?.shopName || "",
      image: user?.image || "",
      imageFile: null,
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: URL.createObjectURL(file),
        imageFile: file,
      }));
    }
  };

  const saveProfileChanges = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("full_name", formData.full_name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone_number", formData.phone_number);
      formDataToSend.append("shopName", formData.shopName);

      if (formData.imageFile) {
        formDataToSend.append("image", formData.imageFile);
      }

      const response = await postMutation({
        path: "/authentication/update-profile",
        body: formDataToSend,
        method: "POST",
      });

      if (response.error) {
        toast.error(response.error.data?.message || "Profile update failed.");
      } else {
        dispatch(updateProfile(response.data)); // ✅ Correct payload
        toast.success("Profile updated successfully.");
      }
    } catch {
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="w-full">
      <Card className="w-full rounded-none shadow-none">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="col-span-1">
            <Typography className="text-sm text-gray-800 mb-1">
              Name:
            </Typography>
            <Input
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="!border-gray-300"
            />
          </div>
          <div className="col-span-1">
            <Typography className="text-sm text-gray-800 mb-1">
              Email:
            </Typography>
            <Input
              name="email"
              value={formData.email}
              disabled
              className="bg-gray-100 !border-gray-300"
            />
          </div>
          <div className="col-span-1">
            <Typography className="text-sm text-gray-800 mb-1">
              Phone:
            </Typography>
            <Input
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="!border-gray-300"
            />
          </div>
        </div>

        <div className="flex flex-col items-center mb-8">
          <Typography className="text-sm text-gray-700 mb-2 text-center">
            Customer Profile Image
          </Typography>
          <div className="w-[150px] h-[150px] border border-gray-300 rounded-md flex items-center justify-center overflow-hidden mb-2">
            {formData.image ? (
              <img
                src={formData.image}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={() =>
                  console.log("Image failed to load:", formData.image)
                }
              />
            ) : (
              <span className="text-gray-400">No image</span>
            )}
          </div>
          <Typography className="text-xs text-gray-500 mb-4 text-center">
            Preferred size: (600x600 Square size)
          </Typography>
          <Button
            className="px-6 py-2 bg-white text-teal-600 border border-teal-600 normal-case"
            size="sm"
            type="button"
          >
            <label htmlFor="profileImageUpload" className="cursor-pointer">
              Upload Image
            </label>
          </Button>
          <input
            type="file"
            id="profileImageUpload"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <div className="flex justify-end">
          <Button
            onClick={saveProfileChanges}
            className="bg-teal-600 text-white px-6 py-2 normal-case"
          >
            Save
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default EditProfile;
