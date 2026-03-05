import { useState, useEffect } from "react";
import MessageBoard from "./components/messageboard";
import SignupForm from "./components/signupform";
import LoginForm from "./components/loginform";
import CreateMessage from "./components/createmessage";
import styles from "./app.module.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [showCreateMessage, setShowCreateMessage] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  if (isAuthenticated) {
    return (
      <div>
        <header className={styles.authHeader}>
          <button
            className={styles.authToggleBtn}
            onClick={() => setShowCreateMessage(!showCreateMessage)}
          >
            {showCreateMessage ? "Hide Create Message" : "Create Message"}
          </button>
          <div className={styles.headerButtons}>
            <span className={styles.welcomeMessage}>
              Welcome, {user.firstName}!
            </span>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </header>
        {showCreateMessage && (
          <CreateMessage onMessageCreated={() => window.location.reload()} />
        )}
        <MessageBoard user={user} />
      </div>
    );
  }

  return (
    <div>
      <div className={styles.authContainer}>
        <LoginForm onLogin={handleLogin} />
        <div className={styles.authDivider}>
          <span className={styles.authText}>Not signed up?</span>
          <button
            className={styles.authToggleBtn}
            onClick={() => setShowSignup(!showSignup)}
            aria-expanded={showSignup}
          >
            {showSignup ? "Hide Signup" : "Sign Up"}
          </button>
        </div>
        {showSignup && <SignupForm />}
      </div>
    </div>
  );
}

export default App;
