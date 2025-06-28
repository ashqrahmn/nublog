import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const Unsubscribe = () => {
  const location = useLocation();
  const [message, setMessage] = useState("Processing your request...");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Invalid unsubscribe request.");
      return;
    }

    fetch(`${import.meta.env.VITE_BASE_URL}/unsubscribe?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
        setStatus(data.success ? "success" : "error");
      })
      .catch(() => {
        setMessage("Something went wrong.");
        setStatus("error");
      });
  }, [location]);

  const renderIcon = () => {
    if (status === "loading")
      return (
        <Loader2 className="animate-spin text-gray-400 w-12 h-12 mx-auto mb-4" />
      );
    if (status === "success")
      return <CheckCircle className="text-green-500 w-12 h-12 mx-auto mb-4" />;
    return <XCircle className="text-red-500 w-12 h-12 mx-auto mb-4" />;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center animate-fadeIn">
        {renderIcon()}
        <h1 className="text-2xl font-semibold mb-2">Unsubscribe</h1>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default Unsubscribe;