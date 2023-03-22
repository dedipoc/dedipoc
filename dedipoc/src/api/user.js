export async function getCurrentUser(token) {
  const response = await fetch(`/user`, {
    method: "GET",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }),
  });
  if (response.status !== 200) {
    throw new Error("Vous n'êtes pas connecté");
  }
  return await response.json();
}

export async function createUser({ token, data }) {
  const response = await fetch(`/user`, {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }),
    body: JSON.stringify(data),
  });
  if (response.status !== 200) {
    throw new Error("Erreur lors de la création de l'utilisateur");
  }
  return true;
}

export async function getUsers({ token }) {
  const response = await fetch(`/user/all`, {
    method: "GET",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }),
  });
  if (response.status !== 200) {
    throw new Error("Erreur lors de la récupération des utilisateurs");
  }
  return await response.json();
}

export async function deleteUser({ token, params }) {
  const response = await fetch(`/user/${params}`, {
    method: "DELETE",
    headers: new Headers({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }),
  });
  if (response.status !== 200) {
    throw new Error("Erreur lors de la suppression de l'utilisateur");
  }
  return true;
}
