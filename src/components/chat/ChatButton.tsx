import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";

const ChatButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/chat")}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-primary shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center"
      aria-label="Open chat"
    >
      <MessageCircle className="w-6 h-6 text-primary-foreground" />
    </button>
  );
};

export default ChatButton;
