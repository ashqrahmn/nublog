import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import upload from "../../assets/upload_area.png";
import { FaChevronDown } from "react-icons/fa";

const AddBlog = () => {
  const [image, setImage] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const textareaRef = useRef();
  const dropdownRef = useRef();
  const [data, setData] = useState({
    title: "",
    description: "",
    category: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/category");
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch {
        toast.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const applyTag = (tag) => {
    const textarea = textareaRef.current;

    const scrollTop = textarea.scrollTop;
    const { selectionStart, selectionEnd, value } = textarea;

    if (selectionStart === selectionEnd && tag !== "hr" && tag !== "br") return;

    const selected = value.slice(selectionStart, selectionEnd);
    const before = value.slice(0, selectionStart);
    const after = value.slice(selectionEnd);

    let newText = "";
    let newCursorPos = 0;

    if (tag === "ul" || tag === "ol") {
      const lines = selected
        .split("\n")
        .map((line) => `  <li>${line.trim()}</li>`)
        .join("\n");
      const insert = `<${tag}>\n${lines}\n</${tag}>`;
      newText = `${before}${insert}${after}`;
      newCursorPos = before.length + insert.length;
    } else if (tag === "pre") {
      const insert = `<pre>${selected}</pre>`;
      newText = `${before}${insert}${after}`;
      newCursorPos = before.length + insert.length;
    } else if (tag === "hr") {
      const insert = `<hr />`;
      newText = `${before}${insert}${after}`;
      newCursorPos = before.length + insert.length;
    } else if (tag === "br") {
      const insert = `<br />`;
      newText = `${before}${insert}${after}`;
      newCursorPos = before.length + insert.length;
    } else if (tag === "a") {
      const insert = `<a href="">${selected}</a>`;
      newText = `${before}${insert}${after}`;
      newCursorPos = before.length + insert.length;
    } else if (tag === "p") {
      const insert = `<p>${selected}</p>`;
      newText = `${before}${insert}${after}`;
      newCursorPos = before.length + insert.length;
    } else {
      const insert = `<${tag}>${selected}</${tag}>`;
      newText = `${before}${insert}${after}`;
      newCursorPos = before.length + insert.length;
    }

    setData((prev) => ({ ...prev, description: newText }));

    setTimeout(() => {
      textarea.focus();
      textarea.scrollTop = scrollTop;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!data.title || !data.description || !data.category || !image) {
      toast.error("Please fill out all fields.");
      return;
    }

    const wordCount = data.description
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    if (wordCount < 120) {
      toast.error("Description must be at least 120 words.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("image", image);

    try {
      const token = localStorage.getItem("adminToken");
      const response = await axiosInstance.post("/blog", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        toast.success(response.data.msg);
        setImage(false);
        setData({ title: "", description: "", category: "" });
      } else {
        toast.error(response.data.msg || "Error");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.msg) {
        toast.error(err.response.data.msg);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="pt-6 px-6 sm:pt-12 sm:px-14 max-w-2xl pb-4"
    >
      <p className="text-[18px] font-medium text-gray-700">Upload Thumbnail</p>
      <label htmlFor="image" className="block mt-3 w-fit cursor-pointer">
        <img
          className="rounded-md border border-gray-300 shadow-sm"
          src={!image ? upload : URL.createObjectURL(image)}
          alt="NuBlog"
          style={{ width: "140px", height: "75px", objectFit: "cover" }}
        />
      </label>
      <input
        name="image"
        onChange={(e) => setImage(e.target.files[0])}
        type="file"
        id="image"
        hidden
        required
      />

      <p className="text-[18px] font-medium text-gray-700 mt-6 mb-2">Title</p>
      <input
        name="title"
        onChange={onChangeHandler}
        value={data.title}
        className="w-full sm:w-[500px] mt-2 px-3 py-2.5 border border-gray-300 rounded placeholder:text-gray-400 focus:outline-none"
        type="text"
        placeholder="Enter title"
        required
      />

      <p className="text-[18px] font-medium text-gray-700 mt-6 mb-4">
        Description
      </p>
      <div className="max-w-2xl w-full">
        <div className="flex flex-wrap gap-2 p-2 font-medium text-gray-700">
          {[
            "h1",
            "h2",
            "h3",
            "p",
            "strong",
            "b",
            "em",
            "a",
            "ul",
            "ol",
            "blockquote",
            "pre",
            "code",
            "hr",
            "br",
          ].map((tag) => (
            <button
              key={tag}
              onClick={(e) => {
                e.preventDefault();
                applyTag(tag);
              }}
              className="px-3 py-1.5 text-xs rounded-full border border-gray-300 hover:bg-bangladesh-green/5 cursor-pointer bg-white"
            >
              {tag}
            </button>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          name="description"
          onChange={onChangeHandler}
          value={data.description}
          className="mt-3 w-full h-64 p-3 border border-gray-300 rounded placeholder:text-gray-400 resize focus:outline-none"
          placeholder="Write content..."
          rows={6}
          required
        />
      </div>

      <p className="text-[18px] font-medium text-gray-700 mt-6 mb-2">
        Category
      </p>
      <div ref={dropdownRef} className="relative w-44 mt-2">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setIsOpen(false);
          }}
          className="w-full flex justify-between items-center rounded border border-gray-300 bg-gray-100 text-gray-700 px-3 py-2.5 focus:outline-none"
        >
          {data.category
            ? categories.find((cat) => cat.name === data.category)?.name
            : "select category"}
          <FaChevronDown
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            } text-xs`}
          />
        </button>
        {isOpen && (
          <div
            className="absolute bottom-full mb-1 w-full rounded border border-gray-300 bg-white shadow-lg z-10 animate-slide-up"
            role="listbox"
          >
            {categories.map((cat, index) => (
              <div
                key={cat._id}
                role="option"
                tabIndex={0}
                onClick={() => {
                  setData((prev) => ({ ...prev, category: cat.name }));
                  setIsOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setData((prev) => ({ ...prev, category: cat.name }));
                    setIsOpen(false);
                  } else if (e.key === "Escape") {
                    setIsOpen(false);
                  }
                }}
                className={`cursor-pointer p-3 hover:bg-bangladesh-green/5 focus:outline-none ${
                  data.category === cat.name
                    ? "bg-bangladesh-green/5 font-medium"
                    : ""
                }`}
              >
                {cat.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-full mt-8">
        <button
          type="submit"
          disabled={
            !data.title ||
            !data.description ||
            !data.category ||
            !image ||
            isLoading
          }
          className={`w-44 h-11 font-medium text-white py-2 rounded shadow transition ${
            !data.title ||
            !data.description ||
            !data.category ||
            !image ||
            isLoading
              ? "bg-bangladesh-green opacity-50 cursor-not-allowed"
              : "bg-bangladesh-green hover:bg-bangladesh-green/90 cursor-pointer"
          }`}
        >
          {isLoading ? "Saving..." : "Add"}
        </button>
      </div>
    </form>
  );
};

export default AddBlog;