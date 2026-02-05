import { useEffect, useState } from "react";
import { api } from "../api/client";
import { Link } from "react-router-dom";

export default function Admin() {
  const [me, setMe] = useState(null);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    try {
      const meRes = await api("/api/auth/me");
      setMe(meRes.user);

      const u = await api("/api/admin/users");
      setUsers(u.users);

      const t = await api("/api/admin/tasks");
      setTasks(t.tasks);
    } catch (e) {
      setErr(e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function setRole(userId, role) {
    setErr("");
    try {
      await api(`/api/admin/users/${userId}/role`, { method: "PATCH", body: { role } });
      await load();
    } catch (e) {
      setErr(e.message);
    }
  }

  if (me && me.role !== "admin") {
    return (
      <div style={{ maxWidth: 900, margin: "30px auto", fontFamily: "system-ui" }}>
        <h2>Admin</h2>
        <p style={{ color: "crimson" }}>Forbidden: you are not an admin.</p>
        <Link to="/tasks">Back to Tasks</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "30px auto", fontFamily: "system-ui" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Admin Panel</h2>
        <Link to="/tasks">Back to Tasks</Link>
      </div>

      {err && <div style={{ color: "crimson", marginTop: 12 }}>{err}</div>}

      <h3 style={{ marginTop: 18 }}>Users</h3>
      <div style={{ border: "1px solid #ddd", borderRadius: 10, overflow: "hidden" }}>
        {users.map((u) => (
          <div key={u.id} style={{ display: "flex", justifyContent: "space-between", padding: 10, borderTop: "1px solid #eee" }}>
            <div>
              <div style={{ fontWeight: 600 }}>{u.email}</div>
              <div style={{ fontSize: 13, opacity: 0.75 }}>{u.name || "-"}</div>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 13, opacity: 0.8 }}>role: <b>{u.role}</b></span>
              <button onClick={() => setRole(u.id, "user")} disabled={u.role === "user"}>Set user</button>
              <button onClick={() => setRole(u.id, "admin")} disabled={u.role === "admin"}>Set admin</button>
            </div>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: 18 }}>All Tasks</h3>
      <div style={{ display: "grid", gap: 10 }}>
        {tasks.map((t) => (
          <div key={t.id} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div>
                <div style={{ fontWeight: 700 }}>{t.title}</div>
                <div style={{ fontSize: 13, opacity: 0.8 }}>{t.description}</div>
              </div>
              <div style={{ fontSize: 13, opacity: 0.8 }}>
                {t.status} • {t.priority}
              </div>
            </div>

            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 8 }}>
              owner: {t.owner?.email || "unknown"} ({t.owner?.role || "-"})
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
