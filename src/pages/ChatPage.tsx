import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Bot, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  time: string;
}

const AUTO_REPLIES: Record<string, string> = {
  hello: "Hi there! 👋 How can I help you with your learning today?",
  help: "I can assist you with:\n• Course navigation\n• Technical issues\n• Account settings\n• General questions\n\nJust type your question!",
  course: "You can browse all courses from your dashboard. Use the filter chips to narrow down by category. Need help with a specific course?",
  progress: "Your progress is saved automatically. You can see it on each course card and in the stats bar at the top of your dashboard.",
  default: "Thanks for your message! Our support team typically responds within a few minutes. Is there anything specific I can help with?",
};

const getReply = (text: string): string => {
  const lower = text.toLowerCase();
  for (const [key, reply] of Object.entries(AUTO_REPLIES)) {
    if (key !== "default" && lower.includes(key)) return reply;
  }
  return AUTO_REPLIES.default;
};

const now = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const ChatPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "👋 Welcome to LearnHub Help Centre! How can I assist you today?",
      sender: "bot",
      time: now(),
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), text: input, sender: "user", time: now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const botMsg: Message = {
        id: Date.now() + 1,
        text: getReply(input),
        sender: "bot",
        time: now(),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="gradient-primary px-4 sm:px-6 py-4 flex items-center gap-4 shadow-md">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="text-primary-foreground hover:bg-primary-foreground/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
          <Bot className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-semibold text-primary-foreground text-lg">Help Centre</h1>
          <p className="text-primary-foreground/70 text-xs">Online • Typically replies instantly</p>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-3xl w-full mx-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 animate-fade-in ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "bot" && (
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4 text-primary" />
              </div>
            )}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm whitespace-pre-line ${
                msg.sender === "user"
                  ? "bg-chat-user text-chat-user-foreground rounded-br-md"
                  : "bg-chat-bubble text-chat-bubble-foreground rounded-bl-md"
              }`}
            >
              {msg.text}
              <p
                className={`text-[10px] mt-1 ${
                  msg.sender === "user" ? "text-chat-user-foreground/60" : "text-muted-foreground"
                }`}
              >
                {msg.time}
              </p>
            </div>
            {msg.sender === "user" && (
              <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t bg-card p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex gap-2 max-w-3xl mx-auto"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 h-11 bg-secondary/50 border-0"
          />
          <Button type="submit" size="icon" className="h-11 w-11 gradient-primary shrink-0">
            <Send className="w-4 h-4 text-primary-foreground" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
