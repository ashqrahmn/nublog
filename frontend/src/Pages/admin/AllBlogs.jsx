import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BlogTable from "../table/BlogTable";
import axiosInstance from "../../utils/axiosInstance";

const AllBlogs = () => {
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    try {
      const response = await axiosInstance.get("/get-blogs");
      setBlogs(response.data.blogs);
    } catch (error) {
      toast.error("Failed to fetch blogs");
    }
  };

  const deleteBlog = async (mongoId) => {
    try {
      const response = await axiosInstance.delete("/blog", {
        params: { id: mongoId },
      });
      if (response.data.success) {
        toast.success(response.data.msg);
        fetchBlogs();
      } else {
        toast.error("Error deleting blog");
      }
    } catch (error) {
      toast.error("Request failed");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16">
      <h1 className="text-xl font-semibold text-gray-700 mb-4">All Blogs</h1>

      <div className="relative h-[70vh] max-w-[850px] overflow-x-auto border border-gray-300 rounded-lg shadow-sm">
        <table className="w-full text-sm text-gray-700">
          <thead className="text-xs text-white uppercase bg-bangladesh-green">
            <tr>
              <th className="px-6 py-4 text-left hidden sm:table-cell">
                Author Name
              </th>
              <th className="px-6 py-4 text-left">Blog Title</th>
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((item, index) => (
              <BlogTable
                key={item._id}
                mongoId={item._id}
                title={item.title}
                author={item.author}
                authorImg={item.authorImg}
                date={item.date}
                deleteBlog={deleteBlog}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllBlogs;