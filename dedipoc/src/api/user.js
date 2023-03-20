export async function getCurrentUser() {
  const response = await fetch("http://localhost:8085/user", {
    method: "GET",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    credentials: "include",
  });
  if (response.status !== 200) {
    throw new Error("Authentication failed");
  }
  const user = await response.json();
  return user;
}

export async function createUser(params) {
  const response = await fetch("http://localhost:8085/user", {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    credentials: "include",
    body: JSON.stringify(params),
  });
  if (response.status !== 200) {
    throw new Error("Authentication failed");
  }
  return true;
}
