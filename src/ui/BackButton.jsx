import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // Optional icon

const BackButton = ({ label = "Go Back", className = "" }) => {
  const navigate = useNavigate();

  return (
    <button
      variant="outline"
      onClick={() => navigate(-1)}
      className={`flex items-center gap-2 bg-teelclr px-4 py-2 m-2 rounded text-white ${className}`}
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </button>
  );
};

export default BackButton;
