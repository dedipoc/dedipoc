import { NavLink } from "react-router-dom";
import useAuth from "./hooks/useAuth";

export default function Menu() {
  const { user } = useAuth();

  return (
    <nav>
      <div>
        {user && user.roles.includes("ROLE_ADMIN") && (
          <>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/explore">Fichiers</NavLink>
            <NavLink to="/users">Utilisateurs</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
