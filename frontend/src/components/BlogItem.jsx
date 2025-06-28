import { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const BlogItem = ({ title, description, category, image, id }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <article
      className="rounded-xl overflow-hidden shadow-md max-w-sm w-full group bg-white border border-gray-200 hover:shadow-lg transition-shadow"
      onTouchStart={() => setIsZoomed(true)}
      onTouchEnd={() => setIsZoomed(false)}
    >
      <figure className="relative w-full h-56 overflow-hidden">
        <img
          src={image}
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-500 
            ${isZoomed ? "scale-110" : ""} group-hover:scale-110`}
          style={{ objectFit: "cover" }}
        />
      </figure>

      <div className="p-4">
        <p className="inline-block bg-bangladesh-green text-white text-xs px-2 py-1 rounded mb-3">
          {category}
        </p>

        <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {title}
        </h2>

        <p
          className="text-sm text-gray-700 mb-4 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: description }}
        />

        <Link
          to={`/blogs/${id}`}
          className="inline-flex items-center text-sm font-semibold text-bangladesh-green"
        >
          Read more
          <FaArrowRight className="ml-2 w-3 h-3" />
        </Link>
      </div>
    </article>
  );
};

export default BlogItem;