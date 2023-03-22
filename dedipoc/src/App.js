import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Auth from "./Auth";
import Explore from "./Explore";
import useAuth, { AuthProvider } from "./hooks/useAuth";
import Menu from "./Menu";
import VideoForm from "./VideoForm";
import Videos from "./Videos";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import Users from "./Users";
import UserForm from "./UserForm";

function Toast() {
  const { error } = useAuth();
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  return <ToastContainer />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Menu />
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Videos />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/edit" element={<UserForm />} />
          <Route path="/video/edit" element={<VideoForm />} />
        </Routes>
        <Toast />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
