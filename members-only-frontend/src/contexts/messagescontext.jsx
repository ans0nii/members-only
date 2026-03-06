import { createContext, useContext, useState, useEffect } from "react";

const MessageContext = createContext();

export function MessagesProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setErrors("");

      const response = await fetch(
        "https://members-only-production-b018.up.railway.app/api/messages",
      );

      if (!response.ok) {
        throw new Error("Failed to GET messages");
      }

      const data = await response.json();
      setMessages(data);
    } catch (error) {
      setErrors(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (messageId) => {
    if (!window.confirm("Are you sure you want to delete this message")) {
      return;
    }
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://members-only-production-b018.up.railway.app/api/messages/${messageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete message");
      }

      setMessages((prev) => prev.filter((message) => message.id !== messageId));
    } catch (error) {
      console.error(error);
      alert("Failed to delete message");
    }
  };

  const refreshMessages = () => {
    fetchMessages();
  };

  const value = {
    messages,
    setMessages,
    loading,
    errors,
    deleteMessage,
    refreshMessages,
  };

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessageContext);

  if (!context) {
    throw new Error("useMessages must be used within MessagesProvider");
  }
  return context;
}
