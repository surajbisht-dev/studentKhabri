import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function LoginPage() {
  const nav = useNavigate();

  const [email, setEmail] = useState("demo@crm.com");
  const [password, setPassword] = useState("Demo@12345");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await api.post("/api/auth/login", { email, password });
      nav("/leads", { replace: true }); // ✅ important
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h1 className="text-xl font-semibold">Lead Dashboard Login</h1>
        <p className="text-sm text-gray-500 mt-1">
          Basic login (demo credentials).
        </p>

        {err ? (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
            {err}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              className="w-full mt-1 border rounded-lg p-2 focus:outline-none focus:ring"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              className="w-full mt-1 border rounded-lg p-2 focus:outline-none focus:ring"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-black text-white rounded-lg p-2 hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-xs text-gray-500 mt-4">
          Demo: <span className="font-medium">demo@crm.com / Demo@12345</span>
        </div>
      </div>
    </div>
  );
}
