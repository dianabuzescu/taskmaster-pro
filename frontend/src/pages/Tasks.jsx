import { useEffect, useState } from "react";
import { api, clearToken } from "../api/client";
import { useNavigate, Link } from "react-router-dom";

export default function Tasks() {
  const nav = useNavigate();
  const [me, setMe] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [err, setErr] = useState("");

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("todo");

  async function load() {
    setErr("");
    try {
      const meRes = await api("/api/auth/me");
      setMe(meRes.user);

      const res = await api("/api/tasks");
      setTasks(res.tasks);
    } catch (e) {
      setErr(e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function logout() {
    clearToken();
    nav("/login");
  }

  async function createTask(e) {
    e.preventDefault();
    setErr("");
    try {
      await api("/api/tasks", {
        method: "POST",
        body: { title, priority, status }
      });
      setTitle("");
      await load();
    } catch (e) {
      setErr(e.message);
    }
  }

  async function patchTask(id, body) {
    setErr("");
    try {
      await api(`/api/tasks/${id}`, { method: "PATCH", body });
      await load();
    } catch (e) {
      setErr(e.message);
    }
  }

  async function deleteTask(id) {
    setErr("");
    try {
      await api(`/api/tasks/${id}`, { method: "DELETE" });
      await load();
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "30px auto", fontFamily: "system-ui" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <div>
          <h2 style={{ margin: 0 }}>My Tasks</h2>
          {me && (
            <div style={{ fontSize: 14, opacity: 0.75 }}>
              Logged in as <b>{me.email}</b> ({me.role})
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {me?.role === "admin" && <Link to="/admin">Admin</Link>}
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <hr style={{ margin: "16px 0" }} />

      <form onSubmit={createTask} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New task title"
          style={{ flex: "1 1 260px" }}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="todo">todo</option>
          <option value="in_progress">in_progress</option>
          <option value="done">done</option>
        </select>
        <button>Create</button>
      </form>

      {err && <div style={{ color: "crimson", marginTop: 12 }}>{err}</div>}

      <div style={{ marginTop: 18, display: "grid", gap: 10 }}>
        {tasks.map((t) => (
          <div key={t.id} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div>
                <div style={{ fontWeight: 700 }}>{t.title}</div>
                <div style={{ fontSize: 13, opacity: 0.8 }}>{t.description}</div>
              </div>
              <button onClick={() => deleteTask(t.id)}>Delete</button>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
              <label>
                Status{" "}
                <select value={t.status} onChange={(e) => patchTask(t.id, { status: e.target.value })}>
                  <option value="todo">todo</option>
                  <option value="in_progress">in_progress</option>
                  <option value="done">done</option>
                </select>
              </label>

              <label>
                Priority{" "}
                <select value={t.priority} onChange={(e) => patchTask(t.id, { priority: e.target.value })}>
                  <option value="low">low</option>
                  <option value="medium">medium</option>
                  <option value="high">high</option>
                </select>
              </label>
            </div>

            <div style={{ fontSize: 12, opacity: 0.65, marginTop: 8 }}>
              updated: {new Date(t.updatedAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
