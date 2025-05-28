import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed");
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-4 max-w-md mx-auto mt-10"
    >
      <h2 className="text-2xl font-bold">Sign Up</h2>
      <input
        type="name"
        placeholder="Enter Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2"
      />
      <input
        type="email"
        placeholder="Enter Your E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2"
      />
      <input
        type="password"
        placeholder="Enter Your Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2"
      />
      <button type="submit" className="bg-green-500 text-white p-2 rounded">
        Signup
      </button>
    </form>
  );
}
