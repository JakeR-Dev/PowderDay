export default function getStatusClass(status) {
  if (status === "1") return 'status-open bg-green';
  if (status === "3" || status === "4") return 'status-warning bg-gold';
  return 'status-closed bg-red';
}