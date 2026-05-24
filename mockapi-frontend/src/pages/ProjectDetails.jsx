import toast from "react-hot-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [endpoints, setEndpoints] = useState([]);
  const [selectedEndpoint, setSelectedEndpoint] =
    useState(null);

  const [responseBody, setResponseBody] =
    useState("");

  const [showSaved, setShowSaved] =
    useState(false);

  const [analytics, setAnalytics] =
    useState(null);

  const [logs, setLogs] = useState([]);

  const [testPath, setTestPath] =
    useState("");

  const [testMethod, setTestMethod] =
    useState("GET");

  const [testResponse, setTestResponse] =
    useState(null);

  const [loadingTest, setLoadingTest] =
    useState(false);

  const [responseStatus, setResponseStatus] =
    useState(null);

  const [responseTime, setResponseTime] =
    useState(null);

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [newEndpointPath, setNewEndpointPath] =
    useState("");

  const [newEndpointMethod, setNewEndpointMethod] =
    useState("GET");

  const [logSearch, setLogSearch] =
    useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {

    // FETCH PROJECT
    fetch(`http://localhost:5000/api/projects/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProject(data.project || data);
      });

    // FETCH ENDPOINTS
    fetch(
      `http://localhost:5000/api/projects/${id}/endpoints`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then(setEndpoints);

    // FETCH ANALYTICS
    fetch(
      `http://localhost:5000/api/projects/${id}/analytics`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setAnalytics(data);
      });

    // FETCH LOGS
    fetch(
      `http://localhost:5000/api/projects/${id}/logs`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setLogs(data.logs || data || []);
      });

  }, [id, token]);

  // CREATE ENDPOINT
  const createEndpoint = async () => {

    if (!newEndpointPath.trim()) return;

    try {

      const res = await fetch(
        `http://localhost:5000/api/projects/${id}/endpoints`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            path: newEndpointPath,
            method: newEndpointMethod,

            responseSchema: {
              count: 1,

              fields: [
                {
                  name: "message",
                  type: "string",
                },
              ],
            },
          }),
        }
      );

      const data = await res.json();

      setEndpoints((prev) => [...prev, data]);

      toast.success("Endpoint created");

      setShowCreateModal(false);

      setNewEndpointPath("");
      setNewEndpointMethod("GET");

    } catch (err) {
      console.error(err);
    }
  };

  // DELETE ENDPOINT
  const deleteEndpoint = async (endpointId) => {

    await fetch(
      `http://localhost:5000/api/endpoints/${endpointId}`,
      {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setEndpoints((prev) =>
      prev.filter((e) => e._id !== endpointId)
    );

    toast.success("Endpoint deleted");
  };

  // SAVE ENDPOINT
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
          ep._id === updated._id
            ? updated
            : ep
        )
      );

      setSelectedEndpoint(updated);

      toast.success("Endpoint saved");

      setShowSaved(true);

      setTimeout(() => {
        setShowSaved(false);
      }, 2000);

    } catch (err) {

      console.error(err);

      toast.error("Failed to save");
    }
  };

  // TEST API
  const handleTestApi = async () => {

    try {

      setLoadingTest(true);

      const start = Date.now();

      const response = await fetch(
        `http://localhost:5000/mock/${id}${testPath}`,
        {
          method: testMethod,

          headers: {
            "x-api-key": project?.apiKey || "",
          },
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        data = {
          error: "Invalid JSON response",
        };
      }

      const end = Date.now();

      setResponseStatus(response.status);
      setResponseTime(end - start);

      setTestResponse(data);

    } catch (err) {

      console.error(err);

      setTestResponse({
        error: "Request failed",
      });

    } finally {
      setLoadingTest(false);
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">

        <div className="animate-pulse space-y-4 w-[400px]">

          <div className="h-10 bg-zinc-800 rounded-lg"></div>

          <div className="h-6 bg-zinc-900 rounded-lg w-2/3"></div>

          <div className="h-40 bg-zinc-900 rounded-xl"></div>

          <div className="h-24 bg-zinc-900 rounded-xl"></div>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020202] via-[#0a0a0a] to-[#111111] text-white">

      <div className="max-w-5xl mx-auto px-4 md:px-10 py-6 relative z-10">

        <div className="bg-gradient-to-b from-[#0a0a0a] to-[#050505] border border-white/10 rounded-2xl p-8">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">

            <div>

              <button
                onClick={() => navigate("/dashboard")}
                className="text-gray-400 hover:text-white mb-4"
              >
                ← Back
              </button>

              <h1 className="text-4xl font-bold">
                {project.name}
              </h1>

              <p className="text-gray-500 mt-2">
                {project.description || "No description yet"}
              </p>

              <div className="mt-4 flex items-center gap-3">

                <div className="bg-black border border-white/10 px-4 py-2 rounded-lg text-sm font-mono text-gray-300 break-all">
                  {project.apiKey}
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      project.apiKey
                    );

                    toast.success("API Key copied");
                  }}
                  className="px-3 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition"
                >
                  Copy
                </button>

              </div>

            </div>

            <button
              onClick={() =>
                setShowCreateModal(true)
              }
              className="px-5 py-2 bg-white text-black rounded-lg"
            >
              + Add Endpoint
            </button>

          </div>

          {/* API TESTING */}
          <div className="mb-10">

            <h2 className="text-2xl font-bold mb-4">
              API Testing Console
            </h2>

            <div className="bg-[#111] border border-white/10 rounded-xl p-5">

              <div className="flex flex-col md:flex-row gap-3 mb-4">

                <select
                  value={testMethod}
                  onChange={(e) =>
                    setTestMethod(e.target.value)
                  }
                  className="bg-black border border-gray-700 rounded-lg px-4 py-2"
                >
                  <option>GET</option>
                  <option>POST</option>
                  <option>PUT</option>
                  <option>DELETE</option>
                </select>

                <input
                  type="text"
                  placeholder="/users"
                  value={testPath}
                  onChange={(e) =>
                    setTestPath(e.target.value)
                  }
                  className="flex-1 bg-black border border-gray-700 rounded-lg px-4 py-2"
                />

                <button
                  onClick={handleTestApi}
                  className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-lg font-semibold"
                >
                  {loadingTest
                    ? "Testing..."
                    : "Send"}
                </button>

              </div>

              {testResponse && (
                <>
                  <div className="flex gap-4 mb-3 text-sm">

                    <div className="bg-black px-3 py-1 rounded-lg border border-gray-700">
                      Status: {responseStatus}
                    </div>

                    <div className="bg-black px-3 py-1 rounded-lg border border-gray-700">
                      Time: {responseTime} ms
                    </div>

                  </div>

                  <pre className="bg-black p-4 rounded-lg overflow-auto text-sm">
                    {JSON.stringify(
                      testResponse,
                      null,
                      2
                    )}
                  </pre>
                </>
              )}

            </div>

          </div>

          {/* ANALYTICS */}
          {analytics && (
            <div className="mb-10">

              <h2 className="text-2xl font-bold mb-5">
                Analytics
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

                <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/10 rounded-xl p-5">

                  <p className="text-gray-400 text-sm">
                    Total Requests
                  </p>

                  <h3 className="text-3xl font-bold mt-2">
                    {analytics?.totalRequests || 0}
                  </h3>

                </div>

                <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/10 rounded-xl p-5">

                  <p className="text-gray-400 text-sm">
                    Top Endpoint
                  </p>

                  <h3 className="text-lg font-semibold mt-2 break-all">
                    {analytics?.topEndpoints?.[0]?._id || "N/A"}
                  </h3>

                </div>

              </div>

              <div className="bg-[#111] border border-white/10 rounded-xl p-5 h-[320px]">

                <ResponsiveContainer width="100%" height="100%">

                  <LineChart
                    data={
                      analytics?.requestsOverTime || []
                    }
                  >
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="_id.day" />

                    <YAxis />

                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#22c55e"
                      strokeWidth={3}
                    />

                  </LineChart>

                </ResponsiveContainer>

              </div>

            </div>
          )}

          {/* LOGS */}
          <div className="mt-10">

            <h2 className="text-2xl font-bold mb-4">
              Recent Logs
            </h2>

            <input
              type="text"
              placeholder="Search logs..."
              value={logSearch}
              onChange={(e) =>
                setLogSearch(e.target.value)
              }
              className="w-full mb-4 bg-black border border-white/10 rounded-lg px-4 py-3"
            />

            <div className="space-y-3">

              {logs
                .filter((log) =>
                  log.endpoint
                    .toLowerCase()
                    .includes(
                      logSearch.toLowerCase()
                    )
                )
                .map((log) => (

                  <div
                    key={log._id}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
                  >

                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">

                      <div>

                        <p className="font-semibold text-green-400">
                          {log.method}
                        </p>

                        <p className="text-sm text-zinc-300">
                          {log.endpoint}
                        </p>

                      </div>

                      <div className="text-right">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            log.statusCode >= 200 &&
                            log.statusCode < 300
                              ? "bg-green-500/10 text-green-400"
                              : log.statusCode >= 400 &&
                                log.statusCode < 500
                              ? "bg-yellow-500/10 text-yellow-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {log.statusCode}
                        </span>

                        <div className="text-xs text-zinc-500 mt-2">

                          <p>
                            {log.responseTime} ms
                          </p>

                          <p>
                            {new Date(
                              log.createdAt
                            ).toLocaleString()}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                ))}

            </div>

          </div>

          {/* ENDPOINT LIST */}
          <div className="space-y-5 mt-10">

            {endpoints.length === 0 ? (

              <div className="bg-[#111] border border-dashed border-white/10 rounded-2xl p-10 text-center">

                <p className="text-xl font-semibold mb-2">
                  No endpoints yet 🚀
                </p>

                <p className="text-gray-500">
                  Create your first mock API endpoint
                </p>

              </div>

            ) : (

              endpoints.map((ep) => (

                <div
                  key={ep._id}
                  onClick={() => {
                    setSelectedEndpoint(ep);
                    setResponseBody(
                      ep.response || "{}"
                    );
                  }}
                  className="p-5 bg-[#111] border border-white/10 rounded-xl flex flex-col md:flex-row justify-between md:items-center gap-4 cursor-pointer hover:border-white/20 hover:scale-[1.01] transition-all duration-200"
                >

                  <div>

                    <span
                      className={`px-2 py-1 text-xs rounded font-semibold ${
                        ep.method === "GET"
                          ? "bg-green-500/10 text-green-400"
                          : ep.method === "POST"
                          ? "bg-blue-500/10 text-blue-400"
                          : ep.method === "PUT"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {ep.method}
                    </span>

                    <div className="flex items-center gap-3 mt-2 flex-wrap">

                      <p className="text-gray-400">
                        {ep.path}
                      </p>

                      <button
                        onClick={(e) => {

                          e.stopPropagation();

                          navigator.clipboard.writeText(
                            `http://localhost:5000/mock/${id}${ep.path}`
                          );

                          toast.success(
                            "Mock URL copied"
                          );
                        }}
                        className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20"
                      >
                        Copy URL
                      </button>

                    </div>

                  </div>

                  <button
                    onClick={(e) => {

                      e.stopPropagation();

                      if (
                        window.confirm(
                          "Delete this endpoint?"
                        )
                      ) {
                        deleteEndpoint(ep._id);
                      }
                    }}
                    className="text-red-400 border border-red-400/30 px-3 py-1 rounded-md"
                  >
                    Delete
                  </button>

                </div>

              ))

            )}

          </div>

        </div>

      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (

        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-[400px]">

            <h2 className="text-2xl font-bold mb-6">
              Create Endpoint
            </h2>

            <div className="space-y-4">

              <input
                type="text"
                placeholder="/users"
                value={newEndpointPath}
                onChange={(e) =>
                  setNewEndpointPath(
                    e.target.value
                  )
                }
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3"
              />

              <select
                value={newEndpointMethod}
                onChange={(e) =>
                  setNewEndpointMethod(
                    e.target.value
                  )
                }
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3"
              >
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
              </select>

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() =>
                  setShowCreateModal(false)
                }
                className="px-4 py-2 border border-white/10 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={createEndpoint}
                className="px-4 py-2 bg-white text-black rounded-lg"
              >
                Create
              </button>

            </div>

          </div>

        </div>

      )}

      {/* SIDE PANEL */}
      {selectedEndpoint && (

        <div className="fixed right-0 top-0 h-full w-full md:w-[420px] bg-[#0a0a0a] border-l border-white/10 p-6 z-50">

          <button
            onClick={() =>
              setSelectedEndpoint(null)
            }
            className="text-gray-400 hover:text-white mb-4"
          >
            ✕ Close
          </button>

          <h2 className="text-xl font-semibold mb-6">
            {selectedEndpoint.method}{" "}
            {selectedEndpoint.path}
          </h2>

          <div className="mb-4">

            <label className="text-sm text-gray-400">
              Response Body (JSON)
            </label>

            <textarea
              value={responseBody}
              onChange={(e) =>
                setResponseBody(
                  e.target.value
                )
              }
              className="w-full mt-2 p-3 bg-black border border-white/10 rounded-lg h-40 text-green-400 font-mono text-sm"
            />

            {showSaved && (
              <p className="text-green-400 text-xs mt-3">
                ✔ Saved successfully
              </p>
            )}

            <button
              onClick={saveEndpoint}
              className="mt-4 w-full bg-white text-black py-2 rounded-lg"
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
