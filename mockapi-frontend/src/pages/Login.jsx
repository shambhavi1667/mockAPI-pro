import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020202] via-[#0a0a0a] to-[#111111] flex items-center justify-center relative overflow-hidden">

      {/* 🔙 Back to Home */}
      <div
  onClick={() => navigate("/")}
  className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white cursor-pointer transition z-10"
>
  ← <span className="font-medium">Back to Home</span>
</div>

      {/* 🌈 Glow Backgrounds */}
      <div className="absolute w-[500px] h-[500px] bg-purple-500/10 blur-[140px] rounded-full top-[-120px] left-[-120px]"></div>
      <div className="absolute w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full bottom-[-120px] right-[-120px]"></div>

      {/* 💳 Card Wrapper */}
      <div className="relative w-full max-w-md p-[1px] rounded-2xl bg-gradient-to-b from-white/10 to-transparent">

        {/* 💳 Card */}
        <div className="bg-[#050505]/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-[0_25px_80px_rgba(0,0,0,0.9)]">

          {/* 🧠 Heading */}
          <h1 className="text-3xl font-bold text-white text-center mb-2 tracking-tight">
            Welcome Back
          </h1>

          <p className="text-gray-400 text-center mb-6">
            Login to continue
          </p>

          {/* 🧾 Form */}
         <form
  className="space-y-4"
  onSubmit={async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      console.log("LOGIN RESPONSE:", data);

      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed");
      }

    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong");
    }
  }}
>

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
    Login
  </button>

</form>

          {/* 🔗 Footer */}
          <p className="text-gray-500 text-sm text-center mt-5">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-gray-300 hover:text-white cursor-pointer"
            >
              Register
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;