import { useState, useRef, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Modal from "react-modal";

import Header from "./components/Header";
import BlogList from "./components/BlogList";
import Footer from "./components/Footer";
import BlogPage from "./Pages/BlogPage";
import Login from "./components/Login";
import Dashboard from "./Pages/admin/Dashboard";
import AddBlog from "./Pages/admin/AddBlog";
import AllBlogs from "./Pages/admin/AllBlogs";
import AddCategory from "./Pages/admin/AddCategory";
import Subscription from "./Pages/admin/Subscription";
import Settings from "./Pages/admin/Settings";
import Unsubscribe from "./Pages/Unsubscribe";

const MainLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (rootRef.current) {
      Modal.setAppElement(rootRef.current);
    }
  }, []);

  useEffect(() => {
    if (location.pathname === "/admin/login") {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [location.pathname]);

  const closeModal = () => {
    setIsOpen(false);
    if (location.pathname === "/admin/login") {
      navigate("/");
    }
  };

  const handleLoginSuccess = () => {
    setIsOpen(false);
    navigate("/admin/");
  };

  useEffect(() => {
    const disableContextMenu = (event) => {
      event.preventDefault();
    };

    const handleClick = (event) => {
      if (
        event.target.id === "submitBtn" ||
        event.target.closest("#submitBtn")
      ) {
        console.log("Submit button clicked");
      }
    };

    document.addEventListener("contextmenu", disableContextMenu);
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("contextmenu", disableContextMenu);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div ref={rootRef}>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <BlogList />
            </MainLayout>
          }
        />
        <Route path="/blogs/:id" element={<BlogPage />} />
        <Route path="/unsubscribe" element={<Unsubscribe />} />
        <Route
          path="*"
          element={
            <MainLayout>
              <BlogList />
            </MainLayout>
          }
        />
        <Route path="/admin" element={<Dashboard />}>
          <Route path="addblog" element={<AddBlog />} />
          <Route path="bloglist" element={<AllBlogs />} />
          <Route path="category" element={<AddCategory />} />
          <Route path="subscriptions" element={<Subscription />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>

      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        overlayClassName="fixed inset-0 backdrop-blur-[4px] bg-black/30 flex items-center justify-center z-50"
        className="outline-none"
      >
        <div className="bg-white p-6 rounded-lg w-full max-w-lg relative">
          <Login onClose={closeModal} onLoginSuccess={handleLoginSuccess} />
        </div>
      </Modal>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <ToastContainer />
      <AppContent />
    </Router>
  );
};

export default App;