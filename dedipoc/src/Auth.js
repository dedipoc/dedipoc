import React, { useRef, useState } from "react";
import useAuth from "./hooks/useAuth";

export default function Auth(props) {
  const { user, loading, error, login, signUp, logout } = useAuth();

  const username = useRef();
  const password = useRef();

  function handleSubmit(event) {
    event.preventDefault();
    login(username.current?.value, password?.current.value);
  }

  console.debug("user", user);

  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={handleSubmit}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Connexion</h3>
          <div>
            {error && (
              <span style={{ color: "red" }}>Erreur d'authentification</span>
            )}
          </div>
          <div className="form-group mt-3">
            <label>Utilisateur</label>
            <input
              ref={username}
              type="text"
              className="form-control mt-1"
              placeholder="utilisateur"
            />
          </div>
          <div className="form-group mt-3">
            <label>Mot de passe</label>
            <input
              ref={password}
              type="password"
              className="form-control mt-1"
              placeholder="motdepasse"
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Valider
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
