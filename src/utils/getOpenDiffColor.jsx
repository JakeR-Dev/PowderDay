// helper to return an indication color based on resort open percent
export default function getOpenDiffColor(openPercent, statusClass) {
  return (openPercent === 0 || statusClass === 'status-closed bg-red') ? 'open-gray' :
         (openPercent <= 25 && statusClass === 'status-open bg-green') ? 'open-red' :
         (openPercent <= 50 && statusClass === 'status-open bg-green') ? 'open-gold' :
         (openPercent >= 95 && statusClass === 'status-open bg-green') ? 'open-green' :
         'open-blue';
}