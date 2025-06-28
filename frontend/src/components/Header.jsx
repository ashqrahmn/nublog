import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import Nublog from "../assets/Nublog.png";

const Header = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post("/email", { email });

      if (response.data.success) {
        toast.success(response.data.msg);
        setEmail("");
      } else {
        toast.error(response.data.msg);
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error(error.response.data.msg);
      } else {
        toast.error("Failed to subscribe. Try again later.");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 px-5 md:px-12 lg:px-28">
      <div className="flex justify-between items-center">
        <img
          src={Nublog}
          alt="NuBlog"
          style={{ width: "100px", height: "auto" }}
        />
      </div>
      <div className="text-center mt-6 mb-1">
        <h1 className="text-3xl sm:text-5xl font-medium text-bangladesh-green">
          Latest Blogs
        </h1>
        <p className="mt-10 max-w-[740px] mx-auto text-xs sm:text-base">
          Fresh ideas, real stories and smart thinking in one place. Whether
          you're here to learn, get inspired or explore something new, the
          latest blogs have something for everyone.
        </p>

        <form
          onSubmit={onSubmitHandler}
          className="flex justify-between items-center max-w-[500px] scale-75 sm:scale-100 mx-auto mt-10 border border-bangladesh-green shadow-green rounded overflow-hidden"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-4 py-3 outline-none w-full text-sm bg-[#faf9f6]"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`border-l border-bangladesh-green py-4 px-4 sm:px-8 text-sm transition-colors text-bangladesh-green ${
              loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-bangladesh-green hover:text-white cursor-pointer"
            }`}
          >
            {loading ? "Submitting..." : "Subscribe"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Header;