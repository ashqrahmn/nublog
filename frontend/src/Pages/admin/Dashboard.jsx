import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { IoMdMenu } from "react-icons/io";
import axiosInstance from "../../utils/axiosInstance";
import Sidebar from "./Sidebar";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => setShowSidebar((prev) => !prev);
  const closeSidebar = () => setShowSidebar(false);

  useEffect(() => {
    const loadAdminData = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      try {
        const response = await axiosInstance.get("/admin");
        if (response.data?.success) {
          setAdminData(response.data.admin);
          setIsAuthenticated(true);
        } else {
          navigate("/admin/login");
        }
      } catch (error) {
        localStorage.clear();
        navigate("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };
    loadAdminData();
  }, [navigate]);

  if (isLoading || !isAuthenticated || !adminData) return null;

  return (
    <div className="flex relative min-h-screen">
      <ToastContainer />

      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div
        onClick={closeSidebar}
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          showSidebar
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        className={`fixed top-0 left-0 w-80 h-full bg-light-green shadow-lg z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar closeSidebar={closeSidebar} />
      </div>

      <div className="flex flex-col w-full">
        <div className="flex items-center w-full h-[80px] px-4 border-b border-bangladesh-green md:px-8">
          <button
            className="block md:hidden text-2xl cursor-pointer"
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
          >
            <IoMdMenu className="text-bangladesh-green" />
          </button>
          <img
            src={adminData.authorImg}
            alt="profile"
            className="rounded-full object-cover ml-auto"
            style={{ width: 45, height: 45 }}
          />
        </div>
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;