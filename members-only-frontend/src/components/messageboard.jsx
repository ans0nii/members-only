import { useEffect, useState } from "react";

function MessageBoard() {
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
          </div>
        ))
      )}
    </div>
  );
}
