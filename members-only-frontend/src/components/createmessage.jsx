import { useState } from "react";

function CreateMessage({ onMessageCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    text: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.text) {
      setErrors("Both fields are required");
      return;
    }

    try {
      setLoading(true);
      setErrors("");

      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8080/api/messages", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          text: formData.text,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create message");
      }

      setFormData({ title: "", text: "" });
      onMessageCreated();
    } catch (error) {
      setErrors(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create Message</h1>

      {loading && <div>Loading...</div>}

      {errors && <div>{errors}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          onChange={handleChange}
          value={formData.title}
          placeholder="Enter title here"
        />
        <textarea
          type="text"
          name="text"
          onChange={handleChange}
          value={formData.text}
          placeholder="Enter text here"
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
}

export default CreateMessage;
