import { useState } from "react";
import styles from "./signupform.module.css";

function SignupForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors) {
      setErrors("");
    }

    if (success) {
      setSuccess("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      setErrors("All fields are required");
      return;
    }

    if (!formData.email.includes("@")) {
      setErrors("Email must contain @");
      return;
    }

    try {
      setLoading(true);
      setErrors("");

      const response = await fetch("https://members-only-production-b018.up.railway.app/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create account");
      }

      setSuccess("Account created successfully! You can now login");

      setFormData({
        firstName: "",
        lastName: "",
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
      <div className={styles.signupContainer}>
        <header>
          <h1 className={styles.signupTitle}>Sign Up Form</h1>
        </header>

        {errors && (
          <div className={styles.signupError} role="alert" aria-live="polite">
            {errors}
          </div>
        )}

        {success && (
          <div className={styles.signupSuccess} role="alert" aria-live="polite">
            {success}
          </div>
        )}

        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.signupContainer}>
      <header>
        <h1 className={styles.signupTitle}>Sign Up Form</h1>
      </header>

      {errors && (
        <div className={styles.signupError} role="alert" aria-live="polite">
          {errors}
        </div>
      )}

      {success && (
        <div className={styles.signupSuccess} role="alert" aria-live="polite">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.signupForm}>
        <div className="visually-hidden">Account Information</div>

        <input
          className={styles.signupInput}
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Enter first name..."
          aria-describedby="firstName-error"
        />
        <input
          className={styles.signupInput}
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Enter last name..."
          aria-describedby="lastName-error"
        />
        <input
          className={styles.signupInput}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter email..."
          aria-describedby="email-error"
        />

        <label htmlFor="password" className="visually-hidden">
          Password
        </label>
        <input
          className={styles.signupInput}
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter password..."
          aria-describedby="password-error"
        />

        <footer>
          <button
            type="submit"
            className={styles.signupBtn}
            disabled={loading}
            aria-label="Create new account"
          >
            Sign Up
          </button>
        </footer>
      </form>
    </div>
  );
}

export default SignupForm;
