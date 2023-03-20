import "./Videos.css";
import { useEffect } from "react";
import useAuth from "./hooks/useAuth";
import { Download } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
export default function Videos() {
  const { user, loading, error, login, signUp, logout, videos, getVideos } =
    useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      navigate("/auth");
    }
  }, [error]);

  useEffect(() => {
    getVideos();
  }, []);

  useEffect(() => {
    console.log("Videos", videos);
  }, [videos]);

  return (
    <div className="videos-container">
      <div></div>
      {videos &&
        videos.map((v) => (
          <a href={`/api/video/${v._id}/download`}>
            <div className="videos-element">
              <h2>{v.displayName}</h2>
              <Download />
            </div>
          </a>
        ))}
    </div>
  );
}
