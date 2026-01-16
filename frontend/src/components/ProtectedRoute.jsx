import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        await api.get("/api/auth/me");
        if (alive) setAuthed(true);
      } catch {
        if (alive) setAuthed(false);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
          <div className="text-lg font-semibold">Loading...</div>
          <div className="text-sm text-gray-500 mt-1">Checking session</div>
        </div>
      </div>
    );
  }

  if (!authed) return <Navigate to="/login" replace />;
  return children;
}
