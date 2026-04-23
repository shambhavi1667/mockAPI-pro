import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#020202] text-white relative overflow-hidden">

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 border-b border-white/10 relative z-10">
        <h1 className="text-lg font-semibold">MockAPI Pro 🚀</h1>

        <div className="space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10 transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition"
          >
            Register
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative z-10">

        {/* Glow */}
        <div className="absolute w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full pointer-events-none"></div>

        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          Build APIs in seconds
        </h1>

        <p className="text-gray-400 mt-6 text-lg">
          No backend. No waiting. Just APIs.
        </p>

        <button
          onClick={() => navigate("/register")}
          className="mt-8 px-8 py-3 bg-gradient-to-b from-[#2a2a2a] to-[#0f0f0f] border border-[#3a3a3a] rounded-xl hover:scale-105 transition"
        >
          Get Started →
        </button>

        <div className="mt-12 flex gap-6 text-gray-500 text-sm">
          <span>⚡ Instant APIs</span>
          <span>🧠 Smart Mock Data</span>
          <span>🚀 No Backend Needed</span>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 px-6 border-t border-white/10 relative z-10">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Why MockAPI Pro?
        </h2>

        <div className="grid md:grid-cols-3 gap-8 w-full max-w-7xl mx-auto">

          <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-xl aspect-square flex flex-col justify-center">
            <h3 className="text-2xl font-semibold mb-3">⚡ Instant Setup</h3>
            <p className="text-gray-500 text-base leading-relaxed">
              Create APIs in seconds with zero backend configuration.
            </p>
          </div>

          <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-xl aspect-square flex flex-col justify-center">
            <h3 className="text-2xl font-semibold mb-3">🧠 Smart Data</h3>
            <p className="text-gray-500 text-base leading-relaxed">
              Generate realistic mock data using intelligent schemas.
            </p>
          </div>

          <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-xl aspect-square flex flex-col justify-center">
            <h3 className="text-2xl font-semibold mb-3">🚀 Developer Friendly</h3>
            <p className="text-gray-500 text-base leading-relaxed">
              Plug & play APIs for faster frontend development.
            </p>
          </div>

        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 text-center border-t border-white/10 relative z-10">
        <h2 className="text-3xl font-semibold">
          Start building today
        </h2>

        <p className="text-gray-500 mt-4">
          Turn your ideas into APIs instantly.
        </p>

        <button
          onClick={() => navigate("/register")}
          className="mt-6 px-8 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition"
        >
          Create Account
        </button>
      </section>

    </div>
  );
}

export default Landing;