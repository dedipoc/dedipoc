import { useRef } from "react";
import { createUser } from "./api/user";
import useAuth from "./hooks/useAuth";

export default function UserForm() {
  const { fetchWithAuth } = useAuth();

  const usernameRef = useRef();
  const passwordRef = useRef();

  function handleSubmit(event) {
    event.preventDefault();
    fetchWithAuth(createUser, {
      username: usernameRef.current?.value,
      password: passwordRef.current?.value,
      roles: ["ROLE_USER"],
    });
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-input-container">
          <label>Nom</label>
          <input autoComplete="off" type="text" ref={usernameRef} />
        </div>
        <div className="form-input-container">
          <label>Mot de passe</label>
          <input autoComplete="off" type="password" ref={passwordRef} />
        </div>
        <div className="form-button-container">
          <button type="submit">Envoyer</button>
        </div>
      </form>
    </div>
  );
}
