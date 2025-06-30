import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import BlogItem from "./BlogItem";

const BlogList = () => {
  const [menu, setMenu] = useState("All");
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const response = await axiosInstance.get("/blog");
      setBlogs(response.data.blogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/category");
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  const filteredBlogs = blogs.filter((item) =>
    menu === "All" ? true : item.category === menu
  );

  return (
    <div>
      <div className="flex justify-center gap-4 my-8 text-bangladesh-green flex-wrap">
        {["All", ...categories.map((c) => c.name)].map((cat) => (
          <button
            key={cat}
            onClick={() => setMenu(cat)}
            className={`py-1 px-4 rounded-sm transition ${
              menu === cat
                ? "bg-bangladesh-green text-white"
                : "hover:bg-bangladesh-green/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 px-4 xl:px-24 mb-16 justify-items-center">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-10">
            <svg
              className="animate-spin h-8 w-8 text-bangladesh-green"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25 fill-[#faf9f6]"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="mt-3 text-gray-500 text-lg">Loading blog posts...</p>
          </div>
        ) : blogs.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 text-lg py-10">
            No blog posts available yet. Check back soon!
          </p>
        ) : filteredBlogs.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 text-lg py-10">
            No blog posts found in <span className="font-semibold">{menu}</span>
          </p>
        ) : (
          filteredBlogs.map((item, index) => (
            <BlogItem
              key={index}
              id={item._id}
              image={item.image}
              title={item.title}
              description={item.description}
              category={item.category}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default BlogList;