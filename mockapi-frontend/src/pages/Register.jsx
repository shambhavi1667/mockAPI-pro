import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020202] via-[#0a0a0a] to-[#111111] flex items-center justify-center relative overflow-hidden">

      {/* 🔙 Back Button */}
      <div
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 text-gray-400 hover:text-white cursor-pointer text-sm z-10"
      >
        ← Back to Home
      </div>

      {/* 🌈 Glow Background */}
      <div className="absolute w-[500px] h-[500px] bg-purple-500/10 blur-[140px] rounded-full top-[-120px] left-[-120px] pointer-events-none"></div>
      <div className="absolute w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full bottom-[-120px] right-[-120px] pointer-events-none"></div>

      {/* 💳 Card */}
      <div className="relative w-full max-w-md p-[1px] rounded-2xl bg-gradient-to-b from-white/10 to-transparent">

        <div className="bg-[#050505]/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-[0_25px_80px_rgba(0,0,0,0.9)]">

          <h1 className="text-3xl font-bold text-white text-center mb-2 tracking-tight">
            Create Account
          </h1>

          <p className="text-gray-400 text-center mb-6">
            Get started with MockAPI Pro
          </p>

          <form className="space-y-4">

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#0b0b0b] border border-[#1f1f1f] text-white placeholder-gray-600 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-white/30 transition"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#0b0b0b] border border-[#1f1f1f] text-white placeholder-gray-600 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-white/30 transition"
            />

            <button
              type="submit"
              className="w-full p-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition active:scale-[0.98] shadow-lg shadow-white/10"
            >
              Register
            </button>

          </form>

          <p className="text-gray-500 text-sm text-center mt-5">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-gray-300 hover:text-white cursor-pointer"
            >
              Login
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Register; 