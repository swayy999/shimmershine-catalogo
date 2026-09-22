export default function AvailabilityTag({ value }: { value: string }) {
  if (!value) return null;
  const v = value.trim().toLowerCase();
  let cls = "tag";
  if (v.includes("disponible") && !v.includes("no ")) cls += " tag-available";
  else if (v.includes("última") || v.includes("ultima") || v.includes("agotad")) cls += " tag-last";
  return <span className={cls}>{value}</span>;
}
