import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import axiosInstance from "../../utils/axiosInstance";

const Settings = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowCurrentPassword, setIsShowCurrentPassword] = useState(false);
  const [isShowNewPassword, setIsShowNewPassword] = useState(false);
  const fileInputRef = useRef(null);
  const toggleTimeoutRef = useRef(null);

  const toggleCurrentPasswordVisibility = () => {
    if (toggleTimeoutRef.current) return;
    setIsShowCurrentPassword((prev) => !prev);
    toggleTimeoutRef.current = setTimeout(() => {
      toggleTimeoutRef.current = null;
    }, 200);
  };

  const toggleNewPasswordVisibility = () => {
    if (toggleTimeoutRef.current) return;
    setIsShowNewPassword((prev) => !prev);
    toggleTimeoutRef.current = setTimeout(() => {
      toggleTimeoutRef.current = null;
    }, 200);
  };

  const handleImageChange = (e) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword && !image) return;

    setIsLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        toast.error("You are not authenticated.");
        setIsLoading(false);
        return;
      }

      if (image) {
        try {
          const formData = new FormData();
          formData.append("image", image);
          formData.append("fileName", "author_img.jpg");

          const res = await axiosInstance.post("/upload-image", formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
            timeout: 30000,
          });

          if (!res.data?.success) {
            toast.error(res.data?.msg || "Image upload failed");
          } else {
            toast.success("Profile picture updated successfully");
            setImage(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }
        } catch (error) {
          toast.error(
            error.response?.data?.msg || error.message || "Image upload failed"
          );
        }
      }

      if (newPassword) {
        if (!currentPassword) {
          toast.error("Please provide your current password.");
          setIsLoading(false);
          return;
        }

        if (newPassword.length < 8) {
          toast.error("New password must be at least 8 characters long.");
          setIsLoading(false);
          return;
        }

        try {
          const res = await axiosInstance.post(
            "/update-password",
            { currentPassword, newPassword },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!res.data?.success) {
            toast.error(res.data?.msg || "Failed to update password");
          } else {
            toast.success(res.data?.msg || "Password updated successfully");
            setCurrentPassword("");
            setNewPassword("");
          }
        } catch (error) {
          toast.error(
            error.response?.data?.msg ||
              error.message ||
              "Password update failed"
          );
        }
      }
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start pt-6">
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-lg">
        <h1 className="text-2xl font-semibold text-gray-700 mb-6 ">Settings</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="currentPassword"
              className="block mb-2 font-medium text-gray-700"
            >
              Current Password
            </label>
            <div className="relative flex items-center border border-gray-300 rounded px-3 py-2">
              <input
                id="currentPassword"
                type={isShowCurrentPassword ? "text" : "password"}
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full outline-none pr-10"
              />
              <button
                type="button"
                onClick={toggleCurrentPasswordVisibility}
                className="absolute right-3 text-gray-500 hover:text-gray-800"
                aria-label={
                  isShowCurrentPassword ? "Hide password" : "Show password"
                }
              >
                {isShowCurrentPassword ? (
                  <FaRegEye size={18} />
                ) : (
                  <FaRegEyeSlash size={18} />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block mb-2 font-medium text-gray-700"
            >
              New Password
            </label>
            <div className="relative flex items-center border border-gray-300 rounded px-3 py-2">
              <input
                id="newPassword"
                type={isShowNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full outline-none pr-10"
              />
              <button
                type="button"
                onClick={toggleNewPasswordVisibility}
                className="absolute right-3 text-gray-500 hover:text-gray-800"
                aria-label={
                  isShowNewPassword ? "Hide password" : "Show password"
                }
              >
                {isShowNewPassword ? (
                  <FaRegEye size={18} />
                ) : (
                  <FaRegEyeSlash size={18} />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="authorImage"
              className="block mb-2 font-medium text-gray-700"
            >
              Profile Picture
            </label>
            <input
              id="authorImage"
              type="file"
              accept="image/jpeg, image/jpg"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />
            <div className="flex items-center gap-3">
              <input
                type="text"
                disabled
                value={image ? image.name : "No file selected"}
                className="flex-grow border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
              />
              <label
                htmlFor="authorImage"
                className="cursor-pointer bg-bangladesh-green font-medium text-white px-4 py-2 rounded shadow hover:bg-bangladesh-green/90"
              >
                Browse
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={(!newPassword && !image) || isLoading}
            className={`w-full font-medium text-white py-2 rounded shadow transition ${
              (!newPassword && !image) || isLoading
                ? "bg-bangladesh-green opacity-50 cursor-not-allowed"
                : "bg-bangladesh-green hover:bg-bangladesh-green/90 cursor-pointer"
            }`}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;