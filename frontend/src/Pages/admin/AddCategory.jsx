import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import CategoryTable from "../table/CategoryTable";

const AddCategory = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/get-categories");
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch {
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async () => {
    if (!newCategory.trim()) return;

    try {
      const res = await axiosInstance.post("/category", {
        name: newCategory.trim(),
      });
      if (res.data.success) {
        toast.success("Category added successfully");
        setNewCategory("");
        fetchCategories();
      } else {
        toast.error(res.data.message || "Error adding category");
      }
    } catch {
      toast.error("Request failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axiosInstance.delete(`/category?id=${id}`);
      if (res.data.success) {
        toast.success("Category deleted successfully");
        fetchCategories();
      } else {
        toast.error("Error deleting category");
      }
    } catch {
      toast.error("Request failed");
    }
  };

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">
        Manage Categories
      </h1>

      <div className="max-w-[850px] mb-8">
        <div className="flex gap-3 items-center">
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="w-full sm:w-[400px] px-4 py-2.5 border border-gray-300 rounded placeholder:text-gray-400 focus:outline-none"
            placeholder="Enter new category name"
          />
          <button
            onClick={handleAdd}
            disabled={!newCategory.trim()}
            className={`h-11 px-5 font-medium text-white rounded shadow transition ${
              newCategory.trim()
                ? "bg-bangladesh-green hover:bg-bangladesh-green/90 cursor-pointer"
                : "bg-bangladesh-green opacity-50 cursor-not-allowed"
            }`}
          >
            Add
          </button>
        </div>
      </div>

      <div className="relative h-[60vh] max-w-[850px] overflow-x-auto border border-gray-300 rounded-lg shadow-sm">
        <table className="w-full text-sm text-gray-700">
          <thead className="text-xs text-white uppercase bg-bangladesh-green">
            <tr>
              <th className="px-6 py-4 text-left">Category Name</th>
              <th className="px-6 py-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <CategoryTable
                key={cat._id}
                id={cat._id}
                name={cat.name}
                handleDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddCategory;