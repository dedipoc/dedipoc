import { useEffect, useState } from "react";
import useAuth from "./hooks/useAuth";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import { explore } from "./api/videos";
import { useNavigate } from "react-router-dom";

export default function Explore() {
  const { fetchWithAuth } = useAuth();
  const [currentDir, setCurrentDir] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentDir) {
      fetchWithAuth(explore, { path: "/" }).then((res) => setCurrentDir(res));
    }
  }, [currentDir]);

  const handleClick = (file) => {
    if (file.isDirectory) {
      fetchWithAuth(explore, { path: file.fullPath }).then((res) =>
        setCurrentDir(res)
      );
    } else {
      navigate("/video/edit", {
        state: {
          isEdit: false,
          displayName: file.name,
          rawFile: file.fullPath,
          streamFile: "",
        },
      });
    }
  };

  const handleBackClicked = () => {
    let newPath = "";
    const depth = currentDir.path.split("/");
    depth.pop();
    newPath = depth.join("/");
    fetchWithAuth(explore, { path: newPath }).then((res) => setCurrentDir(res));
  };

  return (
    <div className="videos-container">
      {currentDir && currentDir.path !== "" && (
        <div className="back-button" onClick={handleBackClicked}>
          <ChevronLeft />
          Retour
        </div>
      )}
      <div className="videos-column">
        {currentDir &&
          currentDir.directory.map((e) => (
            <div className="videos-element" onClick={() => handleClick(e)}>
              <h2>{e.name}</h2>
              {e.isDirectory && <ChevronRight />}
            </div>
          ))}
      </div>
    </div>
  );
}
