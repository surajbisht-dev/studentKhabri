export default function MetricCard({ title, value, subtitle }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value ?? "-"}</div>
      {subtitle ? (
        <div className="text-xs text-gray-500 mt-1">{subtitle}</div>
      ) : null}
    </div>
  );
}
