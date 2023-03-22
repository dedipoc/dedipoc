import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Link,
} from "react-bootstrap-icons";
import { toast } from "react-toastify";
import { getDownloadToken, getVideos } from "./api/videos";
import useAuth from "./hooks/useAuth";
import "./Videos.css";

export default function Videos() {
  const { fetchWithAuth } = useAuth();

  const [filter, setFilter] = useState(null);
  const [groups, setGroups] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchWithAuth(getVideos, null, filter ? `group=${filter}` : "").then(
      (v) => {
        let groups = [];
        let videos = [];
        v.groups.forEach((group) => {
          if (group._id) {
            groups.push(group._id);
          } else {
            videos = [...videos, ...group.videos];
          }
        });
        setGroups(groups);
        setVideos(videos);
      }
    );
  }, [filter]);

  async function handleDownload(id, name) {
    fetchWithAuth(getDownloadToken, null).then((dlToken) => {
      const link = document.createElement("a");
      link.href = `https://www.dedipoc.fr/api/video/${id}/download?token=${dlToken.token}`;
      link.setAttribute("download", name);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    });
  }

  async function handleLink(id) {
    fetchWithAuth(getDownloadToken, null).then((dlToken) => {
      navigator.clipboard.writeText(
        `https://www.dedipoc.fr/api/video/${id}/download?token=${dlToken.token}`
      );
      toast.success(
        "Lien copié! Collez-le dans VLC pour lire la video (Ce lien expire dans 1 minute)",
        {
          position: "top-center",
        }
      );
    });
  }

  async function filterGroup(group) {
    setFilter(group);
  }

  return (
    <div className="videos-container">
      {filter && (
        <div className="back-button" onClick={() => setFilter(null)}>
          <ChevronLeft />
          Retour
        </div>
      )}
      <div className="videos-column">
        {groups &&
          groups
            .sort((a, b) => a.localeCompare(b))
            .map((group) => (
              <div>
                <div
                  className="videos-element"
                  onClick={() => filterGroup(group)}
                >
                  <h2>{group}</h2>
                  <ChevronRight />
                </div>
              </div>
            ))}
        {videos &&
          videos
            .sort((a, b) => a.displayName.localeCompare(b.displayName))
            .map((video) => (
              <div>
                <div className="videos-element">
                  <Link
                    className="videos-link"
                    onClick={() => handleLink(video.id)}
                  />
                  <h2>{video.displayName}</h2>
                  <Download
                    className="videos-link"
                    onClick={() => handleDownload(video.id, video.displayName)}
                  />
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
