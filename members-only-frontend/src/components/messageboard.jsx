import styles from "./messageboard.module.css";
import { useMessages } from "../contexts/messagescontext";

function MessageBoard({ user }) {
  const { messages, loading, errors, deleteMessage } = useMessages();

  const displayedMessages = messages.slice(0, 20);

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
              {user && (user.isAdmin || message.user_id === user.id) && (
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
