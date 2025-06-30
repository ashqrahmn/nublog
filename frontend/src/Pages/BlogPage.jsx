import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";
import Footer from "../components/Footer";
import axiosInstance from "../utils/axiosInstance";
import Nublog from "../assets/Nublog.png";

const BlogPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("");

  const fetchBlogData = async () => {
    try {
      const response = await axiosInstance.get(`/blog?id=${id}`);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching blog:", error);
    }
  };

  useEffect(() => {
    fetchBlogData();
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, [id]);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <svg
          className="animate-spin h-12 w-12 text-bangladesh-green"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25 fill-[#faf9f6]"
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
      </div>
    );
  }

  return (
    <>
      <div className="bg-light-green py-5 px-5 md:px-12 lg:px-28">
        <div className="flex justify-between items-center">
          <Link to="/">
            <img
              src={Nublog}
              alt="NuBlog"
              style={{ width: "100px" }}
              className="md:w-[120px] h-auto"
            />
          </Link>
        </div>

        <div className="text-center my-24">
          <h1 className="text-2xl sm:text-5xl font-semibold max-w-[700px] mx-auto">
            {data.title}
          </h1>
          <img
            className="mx-auto mt-6 border border-white rounded-full"
            src={data.authorImg}
            alt="Author"
            style={{ width: "60px", height: "60px" }}
          />
          <p className="mt-1 pb-2 text-lg max-w-[740px] mx-auto">
            {data.author}
          </p>
        </div>
      </div>

      <div className="mx-5 max-w-[800px] md:mx-auto mt-[-100px] mb-10">
        <div className="relative w-full aspect-video border-4 border-white rounded-md overflow-hidden">
          <img
            src={`${data.image}?tr=w-1280,h-720,c-maintain_ratio,fo-auto,pr-true`}
            alt="Blog"
            className="object-cover w-full h-full"
          />
        </div>

        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: data.description }}
        />

        <p className="text-black font-semibold my-4">
          Share this article on social media
        </p>
        <div className="flex gap-4 flex-wrap">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              currentUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-full p-2 w-10 h-10 flex items-center justify-center shadow-md"
          >
            <FaFacebookF className="text-bangladesh-green" />
          </a>

          <a
            href={`twitter://post?message=${encodeURIComponent(
              data.title
            )}%20${encodeURIComponent(currentUrl)}`}
            onClick={(e) => {
              if (!/Android|iPhone|iPad/i.test(navigator.userAgent)) {
                e.preventDefault();
                window.open(
                  `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    currentUrl
                  )}&text=${encodeURIComponent(data.title)}`,
                  "_blank"
                );
              }
            }}
            className="bg-white rounded-full p-2 w-10 h-10 flex items-center justify-center shadow-md"
          >
            <RiTwitterXLine className="text-bangladesh-green text-lg" />
          </a>

          <a
            href={`whatsapp://send?text=${encodeURIComponent(
              `${data.title} ${currentUrl}`
            )}`}
            onClick={(e) => {
              if (!/Android|iPhone|iPad/i.test(navigator.userAgent)) {
                e.preventDefault();
                window.open(
                  `https://web.whatsapp.com/send?text=${encodeURIComponent(
                    `${data.title} ${currentUrl}`
                  )}`,
                  "_blank"
                );
              }
            }}
            className="bg-white rounded-full p-2 w-10 h-10 flex items-center justify-center shadow-md"
          >
            <FaWhatsapp className="text-bangladesh-green text-lg" />
          </a>

          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              currentUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-full p-2 w-10 h-10 flex items-center justify-center shadow-md"
          >
            <FaLinkedinIn className="text-bangladesh-green text-lg" />
          </a>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BlogPage;