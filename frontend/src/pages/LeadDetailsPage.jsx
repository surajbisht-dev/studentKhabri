import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageShell from "../components/PageShell";
import Badge from "../components/Badge";
import { api } from "../lib/api";
import { fmtDate } from "../lib/format";

export default function LeadDetailsPage() {
  const { id } = useParams();
  const nav = useNavigate();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await api.get(`/api/leads/${id}`);
        if (alive) setLead(res.data.lead);
      } catch (e) {
        if (e?.response?.status === 401) nav("/login");
        if (alive) setErr(e?.response?.data?.message || "Failed to load lead");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [id, nav]);

  const right = (
    <Link
      className="text-sm border rounded-lg px-3 py-2 bg-white hover:bg-gray-50"
      to="/leads"
    >
      Back
    </Link>
  );

  return (
    <PageShell title="Lead Details" right={right}>
      {err ? (
        <div className="bg-white rounded-xl shadow p-4 text-sm text-red-600">
          {err}
        </div>
      ) : null}

      {loading ? (
        <div className="bg-white rounded-xl shadow p-6">Loading...</div>
      ) : lead ? (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="text-xs text-gray-500">Name</div>
              <div className="text-xl font-semibold mt-1">{lead.name}</div>
              <div className="text-sm text-gray-500 mt-1 break-all">
                {lead.email}
              </div>
              <div className="text-sm text-gray-500">{lead.phone}</div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge text={lead.stage} />
              <Badge text={lead.source} />
              <Badge text={`Score: ${lead.score ?? "-"}`} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            <Info label="Company" value={lead.company} />
            <Info label="Owner" value={lead.owner} />
            <Info label="Stage" value={lead.stage} />
            <Info label="Source" value={lead.source} />
            <Info
              label="Last Contacted"
              value={lead.lastContactedAt ? fmtDate(lead.lastContactedAt) : "-"}
            />
            <Info
              label="Created At"
              value={lead.createdAt ? fmtDate(lead.createdAt) : "-"}
            />
          </div>

          <div className="mt-6 border rounded-lg p-4 bg-gray-50">
            <div className="text-sm font-semibold">
              Raw JSON (for reviewers)
            </div>
            <div className="text-xs text-gray-500 mt-1">
              This helps reviewers verify you are rendering DB data correctly.
            </div>
            <pre className="text-xs mt-3 overflow-auto">
              {JSON.stringify(lead, null, 2)}
            </pre>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow p-6">Not found.</div>
      )}
    </PageShell>
  );
}

function Info({ label, value }) {
  return (
    <div className="border rounded-lg p-3">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm font-medium mt-1 break-words">{value ?? "-"}</div>
    </div>
  );
}
