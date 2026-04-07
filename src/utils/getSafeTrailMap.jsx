// helper to make sure trailmap url is safe and usable
export default function getSafeTrailMap(trailMapUrl) {
  if (!trailMapUrl) return null;

  try {
    const parsedUrl = new URL(trailMapUrl);
    return (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') ? parsedUrl.toString() : null;
  } catch {
    return null;
  }
}