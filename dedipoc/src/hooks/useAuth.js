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
      .getCurrentUser()
      .then((user) => setUser(user))
      .catch((_error) => {})
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
        console.debug("ERROR", error);
        setError(error);
      })
      .finally(() => setLoading(false));
  }

  function signUp(username, password) {
    setLoading(true);

    usersApi
      .createUser({ username, password })
      .then((videos) => setVideos(videos))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }

  function getVideos() {
    setLoading(true);

    videosApi
      .getVideos()
      .then((videos) => setVideos(videos))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
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
