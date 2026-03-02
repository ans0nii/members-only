import { useState } from "react";
import "./App.css";
import MessageBoard from "./components/messageboard";
import SignupForm from "./components/signupform";
import LoginForm from "./components/loginform";
import { useEffect } from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

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

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <span>Welcome, {user.firstName} </span>
          <button onClick={handleLogout}>Logout</button>
          <MessageBoard />
        </div>
      ) : (
        <div>
          <SignupForm />
          <LoginForm onLogin={handleLogin} />
        </div>
      )}
      <MessageBoard />
    </div>
  );
}

export default App;
