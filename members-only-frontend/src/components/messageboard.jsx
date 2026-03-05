import { useEffect, useState } from "react";
import styles from "./messageboard.module.css";

function MessageBoard({ user }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const displayedMessages = messages.slice(0, 20);

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

      setMessages((prev) => prev.filter((message) => message.id !== messageId));
    } catch (error) {
      console.error(error);
      alert("Failed to delete message");
    }
  };

  if (loading) {
    return (
      <main className={styles.messageboardMain}>
        <header className={styles.messageboardHeader}>
          <h1 id="messageboard-title">Message Board</h1>
        </header>

        <div className={styles.loadingMessage} role="status" aria-live="polite">
          Loading messages...
        </div>
      </main>
    );
  } else if (messages.length === 0) {
    return <p className={styles.noMessages}>No messages found</p>;
  }

  return (
    <main className={styles.messageboardMain}>
      <header className={styles.messageboardHeader}>
        <h1 id="messageboard-title">Message Board</h1>
      </header>
      {errors && (
        <div className={styles.errorMessage} role="alert" aria-live="assertive">
          {errors}
        </div>
      )}

      <section
        className={styles.messagesGrid}
        aria-labelledby="messageboard-title"
        role="feed"
        aria-label={`${displayedMessages.length} messages displayed`}
      >
        {displayedMessages.map((message) => (
          <article
            key={message.id}
            className={styles.messageCard}
            tabIndex="0"
            aria-labelledby={`message-title-${message.id}`}
          >
            <h3
              id={`message-title-${message.id}`}
              className={styles.messageTitle}
            >
              {message.title}
            </h3>
            <p className={styles.messageText}>{message.text}</p>
            <footer className={styles.messageFooter}>
              <span
                className={styles.messageAuthor}
                aria-label={`Message by ${message.first_name} ${message.last_name}`}
              >
                By: {message.first_name} {message.last_name}
              </span>
              {user && user.isAdmin && (
                <button
                  className={styles.deleteBtn}
                  onClick={() => deleteMessage(message.id)}
                  aria-label={`Delete message "${message.title}" by ${message.first_name} ${message.last_name}`}
                >
                  Delete
                </button>
              )}
            </footer>
          </article>
        ))}
      </section>
    </main>
  );
}

export default MessageBoard;
