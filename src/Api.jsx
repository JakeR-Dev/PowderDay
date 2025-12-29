export async function searchResorts(query) {
  const res = await fetch(`https://ski-resorts-and-conditions.p.rapidapi.com/v1/resort/${encodeURIComponent(query)}`, {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "f90f2d45ecmshc00f319866e548fp1ee5afjsnc909d6c28584",
      "X-RapidAPI-Host": "ski-resorts-and-conditions.p.rapidapi.com",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch resorts");
  return res.json();
}

export async function getResortSnowReport(resortId) {
  const res = await fetch(`https://skiapi.p.ski-resorts-and-conditions.p.rapidapi.com/v1/resorts/${resortId}`, {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "f90f2d45ecmshc00f319866e548fp1ee5afjsnc909d6c28584",
      "X-RapidAPI-Host": "ski-resorts-and-conditions.p.rapidapi.com",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch snow report");
  return res.json();
}