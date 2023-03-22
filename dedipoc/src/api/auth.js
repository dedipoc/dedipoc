export async function login({ username, password }) {
  const response = await fetch(`http://localhost:3001/auth/login`, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });
  if (response.status !== 200) {
    throw new Error("Authentication failed");
  }
  const user = await response.json();
  return user;
}

export async function logout() {
  const response = await fetch(`http://localhost:3001/auth/logout`, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    credentials: "include",
  });
  if (response.status !== 200) {
    throw new Error("Authentication failed");
  }
  return true;
}
