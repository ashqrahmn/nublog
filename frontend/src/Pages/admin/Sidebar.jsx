import { Link, useNavigate } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { TfiEmail } from "react-icons/tfi";
import { IoLogOutOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { MdList } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";
import Nublog from "../../assets/Nublog.png";

const Sidebar = ({ className = "", closeSidebar }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (closeSidebar) {
      closeSidebar();
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/admin/logout");
      localStorage.removeItem("adminToken");
      if (closeSidebar) closeSidebar();
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("adminToken");
      navigate("/admin/login");
    }
  };

  return (
    <div
      className={`flex flex-col bg-light-green w-80 h-full text-bangladesh-green ${className}`}
    >
      <div className="flex items-center justify-center h-[80px] border border-bangladesh-green">
  <img src={Nublog} alt="NuBlog" className="w-24 h-auto" />
</div>


      <div className="flex-grow relative py-12 border border-bangladesh-green">
        <div className="w-[80%] absolute right-0 space-y-5">
          <Link
            to="/admin/addblog"
            onClick={handleClick}
            className="flex items-center border border-bangladesh-green gap-3 font-medium px-3 py-2 bg-white text-sm shadow-greenn whitespace-nowrap rounded"
          >
            <IoIosAddCircleOutline className="w-6 h-6 flex-shrink-0" />
            <p className="truncate">Add Blogs</p>
          </Link>

          <Link
            to="/admin/bloglist"
            onClick={handleClick}
            className="flex items-center border border-bangladesh-green gap-3 font-medium px-3 py-2 bg-white text-sm shadow-greenn whitespace-nowrap rounded"
          >
            <HiOutlinePencilSquare className="w-6 h-6 flex-shrink-0" />
            <p className="truncate">Blogs List</p>
          </Link>

          <Link
            to="/admin/subscriptions"
            onClick={handleClick}
            className="flex items-center border border-bangladesh-green gap-3 font-medium px-3 py-2 bg-white text-sm shadow-greenn whitespace-nowrap rounded"
          >
            <TfiEmail className="w-5 h-5 flex-shrink-0" />
            <p className="truncate">Subscriptions</p>
          </Link>

          <Link
            to="/admin/category"
            onClick={handleClick}
            className="flex items-center border border-bangladesh-green gap-3 font-medium px-3 py-2 bg-white text-sm shadow-greenn whitespace-nowrap rounded"
          >
            <MdList className="w-6 h-6 flex-shrink-0" />
            <p className="truncate">Add Category</p>
          </Link>

          <Link
            to="/admin/settings"
            onClick={handleClick}
            className="flex items-center border border-bangladesh-green gap-3 font-medium px-3 py-2 bg-white text-sm shadow-greenn whitespace-nowrap rounded"
          >
            <IoSettingsOutline className="w-6 h-6 flex-shrink-0" />
            <p className="truncate">Settings</p>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center border border-bangladesh-green gap-3 font-medium px-3 py-2 bg-white text-sm shadow-greenn whitespace-nowrap text-left cursor-pointer rounded"
          >
            <IoLogOutOutline className="w-6 h-6 flex-shrink-0" />
            <p className="truncate">Logout</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;