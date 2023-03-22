export async function getVideos({ token, data, params }) {
  const response = await fetch(`/video?${params}`, {
    method: "GET",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }),
  });
  if (response.status !== 200) {
    throw new Error("Authentication failed");
  }
  return await response.json();
}

export async function explore({ token, data }) {
  const response = await fetch(`/video/explore`, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }),
    body: JSON.stringify(data),
  });
  if (response.status !== 200) {
    throw new Error("Authentication failed");
  }
  return await response.json();
}

export async function createVideo({ token, data }) {
  const response = await fetch(`/video/`, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }),
    body: JSON.stringify(data),
  });
  if (response.status !== 200) {
    throw new Error("Authentication failed");
  }
  return await response.json();
}

export async function updateVideo({ token, data, params }) {
  const response = await fetch(`/video/${params}`, {
    method: "PUT",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }),
    body: JSON.stringify(data),
  });
  if (response.status !== 200) {
    throw new Error("Authentication failed");
  }
  return await response.json();
}

export async function getDownloadToken({ token }) {
  const response = await fetch(`/video/dl-token`, {
    method: "GET",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }),
  });
  if (response.status !== 200) {
    throw new Error("Authentication failed");
  }
  return await response.json();
}

export async function downloadVideo({ token, params, query }) {
  const response = await fetch(`/video/${params}/download${query}`, {
    method: "GET",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }),
  });
  if (response.status !== 200) {
    throw new Error("Authentication failed");
  }
  const reader = response.body.getReader();
  return await response.blob();
}
