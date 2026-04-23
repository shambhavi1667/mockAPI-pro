import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [endpoints, setEndpoints] = useState([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [responseBody, setResponseBody] = useState("");
  const [showSaved, setShowSaved] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`http://localhost:5000/api/projects/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setProject);

    fetch(`http://localhost:5000/api/projects/${id}/endpoints`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setEndpoints);
  }, [id, token]);

  const createEndpoint = async () => {
    const path = prompt("Enter endpoint path");
    if (!path) return;

    const method = prompt("Enter method (GET, POST, etc)");
    if (!method) return;

    const res = await fetch(
      `http://localhost:5000/api/projects/${id}/endpoints`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ path, method }),
      }
    );

    const data = await res.json();
    setEndpoints((prev) => [...prev, data]);
  };

  const deleteEndpoint = async (endpointId) => {
    await fetch(`http://localhost:5000/api/endpoints/${endpointId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setEndpoints((prev) => prev.filter((e) => e._id !== endpointId));
  };
  const saveEndpoint = async () => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/endpoints/${selectedEndpoint._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          response: responseBody,
        }),
      }
    );

    const updated = await res.json();

    setEndpoints((prev) =>
      prev.map((ep) =>
        ep._id === updated._id ? updated : ep
      )
    );

    setSelectedEndpoint(updated);

    setShowSaved(true);
setTimeout(() => setShowSaved(false), 2000);
  } catch (err) {
    console.error(err);
    alert("Failed to save");
  }
};

  if (!project) return <div className="text-white p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020202] via-[#0a0a0a] to-[#111111] text-white">

      <div className="max-w-5xl mx-auto p-10 relative z-10">
         {/* 🔥 BACKGROUND GLOW */}
  <div className="absolute w-[600px] h-[600px] bg-purple-500/10 blur-[160px] rounded-full top-[-200px] left-[-200px]"></div>
  <div className="absolute w-[500px] h-[500px] bg-blue-500/10 blur-[140px] rounded-full bottom-[-200px] right-[-200px]"></div>

        {/* PANEL */}
        <div className="bg-gradient-to-b from-[#0a0a0a] to-[#050505] backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-[0_40px_120px_rgba(0,0,0,0.95)] ring-1 ring-white/5 relative">

          {/* top glow */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

          {/* HEADER */}
          <div className="flex justify-between items-start mb-12">

            <div>
              <button
                onClick={() => navigate("/dashboard")}
                className="text-gray-400 hover:text-white transition mb-4"
              >
                ← Back
              </button>

              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                {project.name}
              </h1>

              <p className="text-gray-500 mt-2">
                {project.description || "No description yet"}
              </p>
            </div>

            <button
              onClick={createEndpoint}
              className="px-5 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition shadow-lg shadow-white/30 hover:scale-[1.03]"
            >
              + Add Endpoint
            </button>

          </div>

          {/* divider */}
          <div className="border-t border-white/10 mb-6"></div>

          {/* TITLE */}
          <h2 className="text-lg font-semibold mb-4 text-gray-300">
            Endpoints
          </h2>

          {/* LIST */}
          {endpoints.length === 0 ? (
            <p className="text-gray-500">No endpoints yet 🚀</p>
          ) : (
            <div className="space-y-5">

     {endpoints.map((ep) => (
  <div
    key={ep._id}
    onClick={() => {
        setSelectedEndpoint(ep);
        setResponseBody(ep.response || "{}");
    }}
    className="group relative p-5 bg-gradient-to-b from-[#111111] to-[#070707] border border-white/10 rounded-xl hover:border-white/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.8)] hover:-translate-y-1 transition flex justify-between items-center overflow-hidden cursor-pointer"
  >

                  {/* LEFT ACCENT BAR */}
                  <div
                    className={`absolute left-0 top-0 h-full w-[3px] ${
                      ep.method === "GET"
                        ? "bg-green-400"
                        : ep.method === "POST"
                        ? "bg-blue-400"
                        : ep.method === "PUT"
                        ? "bg-yellow-400"
                        : ep.method === "DELETE"
                        ? "bg-red-400"
                        : "bg-gray-400"
                    }`}
                  ></div>

                  {/* LEFT CONTENT */}
                  <div>
                    <span
                      className={`px-2 py-1 text-xs rounded font-semibold shadow-sm ${
                        ep.method === "GET"
                          ? "bg-green-500/10 text-green-400 shadow-green-500/20"
                          : ep.method === "POST"
                          ? "bg-blue-500/10 text-blue-400 shadow-blue-500/20"
                          : ep.method === "PUT"
                          ? "bg-yellow-500/10 text-yellow-400 shadow-yellow-500/20"
                          : ep.method === "DELETE"
                          ? "bg-red-500/10 text-red-400 shadow-red-500/20"
                          : "bg-gray-500/10 text-gray-300"
                      }`}
                    >
                      {ep.method}
                    </span>

                    <p className="text-gray-400 mt-2 group-hover:text-gray-300 transition">
                      {ep.path}
                    </p>
                  </div>

                  {/* RIGHT BUTTON */}
                  <button
  onClick={(e) => {
    e.stopPropagation(); // 🔥 prevents card click
    deleteEndpoint(ep._id);
  }}
  className="text-red-400 border border-red-400/30 px-3 py-1 rounded-md hover:bg-red-500/10 hover:shadow-md hover:shadow-red-500/20 transition"
>
  Delete
</button>

                </div>
              ))}

            </div>
          )}

        </div>
      </div>
            {/* 🧠 EDITOR PANEL */}
      {selectedEndpoint && (
        <div className="fixed right-0 top-0 h-full w-[420px] bg-gradient-to-b from-[#0a0a0a] to-[#050505] border-l border-white/10 p-6 z-50 shadow-[0_40px_120px_rgba(0,0,0,0.9)]">

          {/* CLOSE */}
          <button
            onClick={() => setSelectedEndpoint(null)}
            className="text-gray-400 hover:text-white mb-4"
          >
            ✕ Close
          </button>

          {/* TITLE */}
          <h2 className="text-xl font-semibold mb-6">
            {selectedEndpoint.method} {selectedEndpoint.path}
          </h2>

          {/* METHOD */}
          <div className="mb-4">
            <label className="text-sm text-gray-400">Method</label>
            <input
              value={selectedEndpoint.method}
              readOnly
              className="w-full mt-1 p-2 bg-[#111] border border-white/10 rounded"
            />
          </div>

          {/* PATH */}
          <div className="mb-4">
            <label className="text-sm text-gray-400">Path</label>
            <input
              value={selectedEndpoint.path}
              readOnly
              className="w-full mt-1 p-2 bg-[#111] border border-white/10 rounded"
            />
          </div>

          {/* RESPONSE */}
          <div className="mb-4">
            <label className="text-xs uppercase tracking-wider text-gray-500">
  Response Body (JSON)
</label>

           <textarea
  value={responseBody}
  onChange={(e) => setResponseBody(e.target.value)}
  className="w-full mt-2 p-3 bg-black border border-white/10 rounded-lg h-40 text-green-400 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-white/20"
/>

{/* ✅ SUCCESS MESSAGE */}
{showSaved && (
 <p className="text-green-400 text-xs mt-3 flex items-center gap-1 opacity-80">
  ✔ Saved successfully
</p>
)}

{/* ✅ SAVE BUTTON */}
<button
  onClick={saveEndpoint}
  className="mt-4 w-full bg-white text-black py-2 rounded-lg hover:bg-gray-200 transition shadow-lg shadow-white/20 hover:scale-[1.02]"
>
  Save Changes
</button>
          </div>

        </div>
      )}

    </div>
  );
}

export default ProjectDetails;
