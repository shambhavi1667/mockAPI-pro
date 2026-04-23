import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  const token = localStorage.getItem("token");

  // 📡 Fetch projects from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/projects", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("FETCH PROJECTS:", data);
        setProjects(data);
      })
      .catch((err) => console.error(err));
  }, []);

  // ➕ Create new project
  const createProject = async () => {
    const name = prompt("Enter project name");
    if (!name) return;

    try {
      const res = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      console.log("CREATE RESPONSE:", data);

      // refresh list instead of manual push (safer)
      fetch("http://localhost:5000/api/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setProjects(data));

    } catch (err) {
      console.error(err);
    }
  };

  // 📊 Stats
  const totalProjects = projects.length;

  const totalEndpoints = projects.reduce(
    (acc, p) => acc + (p.endpoints?.length || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020202] via-[#0a0a0a] to-[#111111] text-white flex">

      {/* SIDEBAR */}
      <div className="w-64 bg-[#050505] border-r border-white/10 p-6 flex flex-col justify-between">

        <div>
          <h1
            onClick={() => navigate("/")}
            className="text-xl font-semibold mb-10 cursor-pointer"
          >
            MockAPI Pro 🚀
          </h1>

          <nav className="space-y-4 text-gray-400">
            <p className="hover:text-white cursor-pointer">Dashboard</p>
            <p className="hover:text-white cursor-pointer">Projects</p>
            <p className="hover:text-white cursor-pointer">Settings</p>
          </nav>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("token"); // logout fix
            navigate("/");
          }}
          className="text-sm text-gray-500 hover:text-white transition"
        >
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-10 space-y-10">

        {/* TOP BAR */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Dashboard</h2>

          <button
            onClick={createProject}
            className="px-5 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition"
          >
            + New Project
          </button>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6">

          <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-xl">
            <p className="text-gray-500 text-sm">Total Projects</p>
            <h3 className="text-2xl font-semibold mt-2">{totalProjects}</h3>
          </div>

          <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-xl">
            <p className="text-gray-500 text-sm">Total Endpoints</p>
            <h3 className="text-2xl font-semibold mt-2">{totalEndpoints}</h3>
          </div>

          <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-xl">
            <p className="text-gray-500 text-sm">API Calls</p>
            <h3 className="text-2xl font-semibold mt-2">—</h3>
          </div>

        </div>

        {/* PROJECT SECTION */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Your Projects</h3>

          {projects.length === 0 ? (
            <p className="text-gray-500">No projects yet 🚀</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              {projects.map((project) => (
                <div
                  key={project._id}
                  onClick={() => navigate(`/project/${project._id}`)}
                  className="p-6 bg-[#0a0a0a] border border-white/10 rounded-xl hover:border-white/20 hover:scale-[1.02] transition cursor-pointer"
                >
                  <h3 className="text-lg font-semibold mb-2">
                    {project.name}
                  </h3>

                  <p className="text-gray-500 text-sm">
                    {project.description || "No description"}
                  </p>
                </div>
              ))}

            </div>
          )}
        </div>

        {/* ACTIVITY */}
        <div className="p-8 bg-[#050505] border border-white/10 rounded-xl text-center">
          <p className="text-gray-500">
            No recent activity yet 🚀
          </p>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;