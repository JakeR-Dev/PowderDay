export default function getStatusClass(status) {
  // open
  if (status === "1") return 'status-open bg-green';
  // open for activities, opening soon
  if (status === "8" || status === "6") return 'status-summer bg-blue';
  // no recent / current info, no details
  if (status === "3" || status === "4") return 'status-warning bg-gold';
  // fall back to closed
  return 'status-closed bg-red';
}