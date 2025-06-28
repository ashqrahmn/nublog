import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";
import Nublog from "../assets/Nublog_light.png";

const Footer = () => {
  return (
    <div className="flex justify-around flex-col gap-2 sm:gap-0 sm:flex-row bg-bangladesh-green py-5 items-center">
      <img
        src={Nublog}
        alt="NuBLog"
        style={{ width: "100px", height: "30px" }}
      />
      <p className="text-sm text-white">© 2025 NuBlog. All rights reserved.</p>
      <div className="flex gap-4">
        <a
          href="https://www.facebook.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-full p-2 w-7 h-7 flex items-center justify-center"
        >
          <FaFacebookF className="text-bangladesh-green text-[14px]" />
        </a>
        <a
          href="https://twitter.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-full p-2 w-7 h-7 flex items-center justify-center"
        >
          <RiTwitterXLine className="text-bangladesh-green text-lg" />
        </a>
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-full p-2 w-7 h-7 flex items-center justify-center"
        >
          <FaInstagram className="text-bangladesh-green text-lg" />
        </a>
      </div>
    </div>
  );
};

export default Footer;