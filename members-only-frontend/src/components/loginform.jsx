import { useState } from "react";
import styles from "./loginform.module.css";

function LoginForm({ onLogin }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors) {
      setErrors("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setErrors("All fields required");
      return;
    }

    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      setErrors("Enter a valid email");
      return;
    }

    try {
      setLoading(true);
      setErrors("");

      const response = await fetch("https://members-only-production-b018.up.railway.app/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to POST login");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      onLogin(data.user);

      setFormData({
        email: "",
        password: "",
      });
    } catch (error) {
      setErrors(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loginContainer}>
        <h2 className={styles.loginTitle}>Login</h2>
        <p>Logging in...</p>
      </div>
    );
  }

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.loginTitle}>Login</h2>
      {errors && (
        <div className={styles.loginError} role="alert" aria-live="polite">
          {errors}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <label htmlFor="login-email" className="visually-hidden">
          Email address
        </label>
        <input
          className={styles.loginInput}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email..."
          aria-describedby="email-error"
          autoComplete="email"
        />
        <label htmlFor="login-password" className="visually-hidden">
          Password
        </label>
        <input
          className={styles.loginInput}
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password..."
          aria-describedby="password-error"
          autoComplete="current-password"
        />
        <button
          type="submit"
          className={styles.loginBtn}
          disabled={loading}
          aria-label="Sign into your account"
        >
          {loading ? "Signing In..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
