import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import axiosInstance from "../utils/axiosInstance";

const Login = ({ onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toggleTimeoutRef = useRef(null);
  const passwordRef = useRef(null);
  const usernameRef = useRef(null);

  const toggleShowPassword = () => {
    if (toggleTimeoutRef.current) return;
    setIsShowPassword((prev) => !prev);
    toggleTimeoutRef.current = setTimeout(() => {
      toggleTimeoutRef.current = null;
    }, 200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/admin/login", {
        username,
        password,
      });

      if (response.data.success) {
        localStorage.setItem("adminToken", response.data.accessToken);
        console.log(response.data.msg);
        onLoginSuccess();
      } else {
        toast.error(response.data.msg);
        setPassword("");
      }
    } catch (error) {
      const errorField = error?.response?.data?.errorField;
      const errorMsg =
        error?.response?.data?.msg || "An unexpected error occurred.";
      toast.error(errorMsg);

      if (errorField === "username") {
        setUsername("");
        setTimeout(() => usernameRef.current?.focus(), 0);
      } else if (errorField === "password") {
        setPassword("");
        setTimeout(() => passwordRef.current?.focus(), 0);
      } else {
        setUsername("");
        setPassword("");
        setTimeout(() => usernameRef.current?.focus(), 0);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-w-[320px] w-full p-4">
      <button
        onClick={onClose}
        className="absolute top-2 right-5 text-2xl text-gray-400 hover:text-gray-900 cursor-pointer"
        aria-label="Close"
      >
        &times;
      </button>
      <h2 className="text-xl font-semibold mb-6 text-center">
        <span className="text-bangladesh-green">Admin</span> Login
      </h2>
      <form onSubmit={handleSubmit}>
        <input
          ref={usernameRef}
          type="text"
          placeholder="Username"
          autoComplete="username"
          className="w-full p-2 mb-3 border border-gray-300 rounded-md focus:outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoFocus
          disabled={isLoading}
        />
        <div className="relative w-full mb-4">
          <input
            ref={passwordRef}
            type={isShowPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />

          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-800 cursor-pointer"
            aria-label={isShowPassword ? "Hide password" : "Show password"}
          >
            {isShowPassword ? (
              <FaRegEye size={18} />
            ) : (
              <FaRegEyeSlash size={18} />
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading || !username || !password}
          className={`w-full p-2 rounded-md font-medium text-white flex justify-center items-center gap-2 transition duration-200
            ${
              isLoading || !username || !password
                ? "bg-bangladesh-green opacity-60 cursor-not-allowed"
                : "bg-bangladesh-green text-white hover:bg-bangladesh-green/90 active:bg-bangladesh-green/80 shadow-md hover:shadow-lg cursor-pointer"
            }`}
        >
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;