import { useState } from "react";
import axios from "axios";

export default function Login({ onAuth }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignup ? "signup" : "login";
    try {
      const { data } = await axios.post(`http://localhost:8080/${endpoint}`, {
        username,
        password,
      });
      if (data.success) {
        onAuth(username);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Authentication error");
    }
  };

  return (
    <div className="flex flex-row justify-center items-center w-screen h-screen">
      <form
        className="backdrop-blur-xl p-16 rounded-md shadow-xl z-10 absolute flex flex-col justify-center"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-bold text-center">
          {isSignup ? "Sign Up" : "Login"}
        </h2>
        <input
          className="bg-white/70 p-2 rounded-md shadow-md mt-4"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="bg-white/70 p-2 rounded-md shadow-md mt-4"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-[#E1C09D] hover:bg-gray-900 hover:text-white hover:scale-105 duration-300 p-2 rounded-md shadow-md mt-4"
          type="submit"
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>
        <p
          className="mt-4 text-center text-gray-900 hover:underline cursor-pointer"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
        </p>
      </form>
    </div>
  );
}
