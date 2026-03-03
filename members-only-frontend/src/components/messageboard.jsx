import { useEffect, useState } from "react";

function MessageBoard({ user }) {
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

      const response = await fetch("http://localhost:8080/api/messages");

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
    if (!window.confirm("Are you sure you want to delete this message?")) {
      return;
    }
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/api/messages/${messageId}`,
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

      setMessages((prev) =>
        prev.filter((message) => message.id !== messageId),
      );
    } catch (error) {
      console.error(error);
      alert("Failed to delete message");
    }
  };

  return (
    <div>
      <h1>Messageboard</h1>

      {loading && <div>Loading messages...</div>}

      {errors && <div>{errors}</div>}

      {messages.length === 0 ? (
        <p>No messages found</p>
      ) : (
        messages.map((message) => (
          <div key={message.id}>
            <h3>{message.title}</h3>
            <p>{message.text}</p>
            <p>
              By: {message.first_name} {message.last_name}
            </p>

            {user && user.isAdmin && (
                <button onClick={() => deleteMessage(message.id)}>delete</button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default MessageBoard;
