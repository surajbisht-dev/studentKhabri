import { Link, useLocation } from "react-router-dom";

export default function PageShell({ title, right, children }) {
  const loc = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold">{title}</h1>
            <div className="text-xs text-gray-500 mt-1 break-all">
              {loc.pathname}
            </div>
          </div>
          <div className="flex gap-2 items-center">{right}</div>
        </div>

        <div className="mt-4">{children}</div>

        <div className="mt-10 text-xs text-gray-400">
          <div className="flex flex-wrap gap-2">
            <span>Mini CRM Lead Dashboard</span>
            <span>•</span>
            <Link className="hover:underline" to="/leads">
              Leads
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
