import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useLocation, useNavigate } from "react-router-dom";
import * as authApi from "../api/auth";
import * as usersApi from "../api/user";
import * as videosApi from "../api/videos";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [videos, setVideos] = useState();
  const [explore, setExplore] = useState();
  const [user, setUser] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (error) setError(null);
  }, [location.pathname]);

  useEffect(() => {
    usersApi
      .getCurrentUser(user?.token)
      .then((user) => setUser(user))
      .catch((_error) => {
        navigate("/auth");
      })
      .finally(() => setLoadingInitial(false));
  }, []);

  function login(username, password) {
    setLoading(true);

    authApi
      .login({ username, password })
      .then((user) => {
        setUser(user);
        navigate("/");
      })
      .catch((error) => {
        setError("Erreur d'authentification");
      })
      .finally(() => setLoading(false));
  }

  function signUp(username, password) {
    setLoading(true);

    usersApi
      .createUser({ username, password })
      .then((videos) => setVideos(videos))
      .catch((error) => setError("Impossible de créer le compte"))
      .finally(() => setLoading(false));
  }

  function getVideos() {
    setLoading(true);

    videosApi
      .getVideos(user?.token)
      .then((videos) => setVideos(videos))
      .catch((error) => setError("Erreur lors du chargement des videos"))
      .finally(() => setLoading(false));
  }

  function explorePath(path = "") {
    setLoading(true);

    videosApi
      .explore(user?.token, path)
      .then((explore) => setExplore(explore))
      .catch((error) => setError("Erreur lors du chargement des fichiers"))
      .finally(() => setLoading(false));
  }

  async function fetchWithAuth(apiCall, data, params = "") {
    setLoading(true);

    let result = null;

    try {
      result = await apiCall({ token: user?.token, data, params });
    } catch (error) {
      setError("Erreur lors de la connexion au serveur.");
    }

    setLoading(false);

    return result;
  }

  function logout() {
    authApi.logout().then(() => setUser(undefined));
  }

  const memoedValue = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      signUp,
      logout,
      getVideos,
      videos,
      explorePath,
      explore,
      fetchWithAuth,
    }),
    [user, loading, error]
  );

  return (
    <AuthContext.Provider value={memoedValue}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
}

// Let's only export the `useAuth` hook instead of the context.
// We only want to use the hook directly and never the context component.
export default function useAuth() {
  return useContext(AuthContext);
}
