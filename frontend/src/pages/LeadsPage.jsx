import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import MetricCard from "../components/MetricCard";
import Badge from "../components/Badge";
import { api } from "../lib/api";
import { clamp, fmtDate } from "../lib/format";

const STAGES = ["new", "contacted", "qualified", "converted", "lost"];
const SOURCES = ["website", "referral", "linkedin", "ads", "cold-email"];
const OWNERS = ["Aman", "Neha", "Rahul", "Pooja"];

export default function LeadsPage() {
  const nav = useNavigate();

  // filters
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("");
  const [source, setSource] = useState("");
  const [owner, setOwner] = useState("");

  // for sorting staet
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // for pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // for data
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    if (search.trim()) p.set("search", search.trim());
    if (stage) p.set("stage", stage);
    if (source) p.set("source", source);
    if (owner) p.set("owner", owner);
    p.set("sortBy", sortBy);
    p.set("sortOrder", sortOrder);
    p.set("page", String(page));
    p.set("limit", String(limit));
    return p.toString();
  }, [search, stage, source, owner, sortBy, sortOrder, page, limit]);

  async function fetchLeads() {
    setLoading(true);
    setErr("");
    try {
      const res = await api.get(`/api/leads?${qs}`);
      setData(res.data);
    } catch (e) {
      if (e?.response?.status === 401) nav("/login");
      setErr(e?.response?.data?.message || "Failed to load leads");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeads();
  }, [qs]);

  const totalPages = data?.pagination?.totalPages ?? 1;
  const curPage = data?.pagination?.page ?? 1;

  const topStage = data?.metrics?.byStage?.[0]
    ? `${data.metrics.byStage[0]._id} (${data.metrics.byStage[0].count})`
    : "-";

  const onLogout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch {
      // ignore
    }
    nav("/login");
  };

  const right = (
    <>
      <button
        onClick={onLogout}
        className="text-sm border rounded-lg px-3 py-2 bg-white hover:bg-gray-50"
      >
        Logout
      </button>
    </>
  );

  return (
    <PageShell title="Leads Dashboard" right={right}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MetricCard
          title="Total Leads"
          value={data?.metrics?.totalLeads ?? "-"}
        />
        <MetricCard
          title="Converted Leads"
          value={data?.metrics?.convertedLeads ?? "-"}
        />
        <MetricCard
          title="Top Stage"
          value={topStage}
          subtitle="From leads by stage"
        />
      </div>

      {/* Filters + sort  applied here */}
      <div className="mt-4 bg-white rounded-xl shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <input
            className="border rounded-lg p-2 md:col-span-2"
            placeholder="Search name/email/company/phone..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />

          <select
            className="border rounded-lg p-2"
            value={stage}
            onChange={(e) => {
              setPage(1);
              setStage(e.target.value);
            }}
          >
            <option value="">All stages</option>
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            className="border rounded-lg p-2"
            value={source}
            onChange={(e) => {
              setPage(1);
              setSource(e.target.value);
            }}
          >
            <option value="">All sources</option>
            {SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            className="border rounded-lg p-2"
            value={owner}
            onChange={(e) => {
              setPage(1);
              setOwner(e.target.value);
            }}
          >
            <option value="">All owners</option>
            {OWNERS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <select
              className="border rounded-lg p-2 w-full"
              value={sortBy}
              onChange={(e) => {
                setPage(1);
                setSortBy(e.target.value);
              }}
            >
              <option value="createdAt">Sort: createdAt</option>
              <option value="score">Sort: score</option>
              <option value="name">Sort: name</option>
            </select>

            <select
              className="border rounded-lg p-2"
              value={sortOrder}
              onChange={(e) => {
                setPage(1);
                setSortOrder(e.target.value);
              }}
            >
              <option value="desc">desc</option>
              <option value="asc">asc</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">Rows</label>
            <select
              className="border rounded-lg p-2 text-sm"
              value={limit}
              onChange={(e) => {
                setPage(1);
                setLimit(clamp(parseInt(e.target.value, 10) || 10, 1, 100));
              }}
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <button
            className="text-sm border rounded-lg px-3 py-2 bg-white hover:bg-gray-50"
            onClick={() => {
              setSearch("");
              setStage("");
              setSource("");
              setOwner("");
              setSortBy("createdAt");
              setSortOrder("desc");
              setLimit(10);
              setPage(1);
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 bg-white rounded-xl shadow overflow-hidden">
        {err ? (
          <div className="p-4 text-sm text-red-600 bg-red-50 border-b border-red-100">
            {err}
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <Th>Name</Th>
                <Th>Company</Th>
                <Th>Stage</Th>
                <Th>Source</Th>
                <Th>Owner</Th>
                <Th>Score</Th>
                <Th>Created</Th>
                <Th>Action</Th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td className="p-4" colSpan={8}>
                    Loading...
                  </td>
                </tr>
              ) : data?.items?.length ? (
                data.items.map((l) => (
                  <tr key={l._id} className="border-t">
                    <Td>
                      <div className="font-medium">{l.name}</div>
                      <div className="text-xs text-gray-500 break-all">
                        {l.email}
                      </div>
                      <div className="text-xs text-gray-500">{l.phone}</div>
                    </Td>
                    <Td>{l.company || "-"}</Td>
                    <Td>
                      <Badge text={l.stage} />
                    </Td>
                    <Td>{l.source || "-"}</Td>
                    <Td>{l.owner || "-"}</Td>
                    <Td>{l.score ?? "-"}</Td>
                    <Td>{l.createdAtISO || fmtDate(l.createdAt)}</Td>
                    <Td>
                      <Link
                        to={`/leads/${l._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </Link>
                    </Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-4" colSpan={8}>
                    No leads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination feature is here */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-t text-sm">
          <div>
            Page <b>{curPage}</b> of <b>{totalPages}</b>
            <span className="text-gray-500">
              {" "}
              · Total {data?.pagination?.total ?? 0}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              className="border rounded-lg px-3 py-2 bg-white hover:bg-gray-50 disabled:opacity-50"
              disabled={curPage <= 1 || loading}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            >
              Prev
            </button>

            <button
              className="border rounded-lg px-3 py-2 bg-white hover:bg-gray-50 disabled:opacity-50"
              disabled={curPage >= totalPages || loading}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-white rounded-xl shadow p-4">
        <div className="text-sm font-semibold">Leads by Stage</div>
        <div className="text-xs text-gray-500 mt-1">
          This data is coming from server-side aggregation.
        </div>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
          {(data?.metrics?.byStage || []).map((x) => (
            <div key={x._id} className="border rounded-lg p-3">
              <div className="text-xs text-gray-500">Stage</div>
              <div className="text-sm font-medium mt-1">{x._id}</div>
              <div className="text-xs text-gray-500 mt-2">Count</div>
              <div className="text-lg font-semibold">{x.count}</div>
            </div>
          ))}
          {!data?.metrics?.byStage?.length ? (
            <div className="text-sm text-gray-500">No analytics available</div>
          ) : null}
        </div>
      </div>
    </PageShell>
  );
}

function Th({ children }) {
  return (
    <th className="text-left font-medium text-gray-600 p-3 whitespace-nowrap">
      {children}
    </th>
  );
}
function Td({ children }) {
  return <td className="p-3 align-top">{children}</td>;
}
