import { useState } from "react";
import { useMessages } from "../contexts/messagescontext";
import styles from "./createmessage.module.css";

function CreateMessage() {
  const { refreshMessages } = useMessages();

  const [formData, setFormData] = useState({
    title: "",
    text: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");

  const sanitizeInput = (input) => {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+="[^"]*"/gi, "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: sanitizeInput(value),
    }));
    setErrors("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.text) {
      setErrors("Both fields are required");
      return;
    }

    if (formData.title.length > 40) {
      setErrors("Title must be 40 character or less");
      return;
    }

    if (formData.text.length > 200) {
      setErrors("Message must be 200 characters or less");
      return;
    }

    try {
      setLoading(true);
      setErrors("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://members-only-production-b018.up.railway.app/api/messages",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            text: formData.text,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to create message");
      }

      setFormData({ title: "", text: "" });

      refreshMessages();
    } catch (error) {
      setErrors(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section
        className={styles.createMessageSection}
        aria-labelledby="create-message-title"
      >
        <h2 id="create-message-title" className={styles.createMessageTitle}>
          Create New Message
        </h2>

        {errors && (
          <div
            className={styles.createMessageError}
            role="alert"
            aria-live="assertive"
          >
            {errors}
          </div>
        )}

        <div
          className={styles.createMessageLoading}
          role="status"
          aria-live="polite"
        >
          Creating message...
        </div>
      </section>
    );
  }

  return (
    <section
      className={styles.createMessageSection}
      aria-labelledby="create-message-title"
    >
      <h2 id="create-message-title" className={styles.createMessageTitle}>
        Create New Message
      </h2>

      <form className={styles.createMessageForm} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label
            htmlFor="message-title"
            className={`${styles.createMessageLabel} visually-hidden`}
          >
            Title *
          </label>
          <input
            id="message-title"
            type="text"
            name="title"
            className={styles.createMessageInput}
            onChange={handleChange}
            value={formData.title}
            placeholder="Enter message title..."
            maxLength="40"
            aria-describedby="title-counter title-help"
          />
          <div
            id="title-counter"
            className={`${styles.characterCounter} ${formData.title.length > 30 ? styles.warning : ""}`}
          >
            {formData.title.length}/40 characters
          </div>
        </div>

        <div className={styles.formGroup}>
          <label
            htmlFor="message-text"
            className={`${styles.createMessageLabel} visually-hidden`}
          >
            Message *
          </label>
          <textarea
            id="message-text"
            name="text"
            className={styles.createMessageTextarea}
            onChange={handleChange}
            value={formData.text}
            placeholder="Enter your message here..."
            maxLength="200"
            required
            aria-describedby="text-counter text-help"
          />
          <div
            id="text-counter"
            className={`${styles.characterCounter} ${formData.text.length > 180 ? styles.warning : ""}`}
          >
            {formData.text.length}/200 characters
          </div>
        </div>

        <button
          type="submit"
          className={styles.createMessageBtn}
          disabled={loading}
          aria-label="Post your message to the message board"
        >
          {loading ? "Posting..." : "Post Message"}
        </button>
      </form>
    </section>
  );
}

export default CreateMessage;
