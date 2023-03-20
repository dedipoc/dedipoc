export async function getVideos() {
  const response = await fetch("http://localhost:8085/video", {
    method: "GET",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    credentials: "include",
  });
  if (response.status !== 200) {
    throw new Error("Authentication failed");
  }
  const videos = await response.json();
  return videos.videos;
}

// export async function downloadVideo(id) {
//   const response = await fetch(`http://localhost:8085/video/${id}/download`, {
//     method: "GET",
//     headers: new Headers({
//       "Content-Type": "application/json",
//     }),
//     credentials: "include",
//   });
//   if (response.status !== 200) {
//     throw new Error("Authentication failed");
//   }
//   const videos = await response.json();
//   return videos.videos;
// }
