export function fmtDate(d) {
  if (!d) return "-";
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return "-";
  }
}

export function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}
