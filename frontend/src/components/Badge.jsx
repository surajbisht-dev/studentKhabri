export default function Badge({ text }) {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 border text-xs">
      {text}
    </span>
  );
}
