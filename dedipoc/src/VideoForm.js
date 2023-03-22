import { useRef } from "react";
import { useLocation } from "react-router-dom";
import { createVideo, updateVideo } from "./api/videos";
import useAuth from "./hooks/useAuth";

import "./VideoForm.css";

export default function VideoForm() {
  const { fetchWithAuth } = useAuth();

  const nameRef = useRef();
  const rawFileRef = useRef();
  const streamFileRef = useRef();
  const groupRef = useRef();

  const location = useLocation();

  function handleSubmit(event) {
    event.preventDefault();
    if (location?.state?.isEdit) {
      fetchWithAuth(
        updateVideo,
        {
          displayName: nameRef.current?.value,
          rawFile: rawFileRef.current?.value,
          streamFile: streamFileRef.current?.value,
          group: groupRef.current?.value,
        },
        location.state.id
      );
    } else {
      fetchWithAuth(createVideo, {
        displayName: nameRef.current?.value,
        rawFile: rawFileRef.current?.value,
        streamFile: streamFileRef.current?.value,
        group: groupRef.current?.value,
      });
    }
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-input-container">
          <label>Nom</label>
          <input
            type="text"
            ref={nameRef}
            defaultValue={location?.state?.displayName}
          />
        </div>
        <div className="form-input-container">
          <label>Ficher brut</label>
          <input
            type="text"
            ref={rawFileRef}
            defaultValue={location?.state?.rawFile}
          />
        </div>
        <div className="form-input-container">
          <label>Ficher stream</label>
          <input
            type="text"
            ref={streamFileRef}
            defaultValue={location?.state?.streamFile}
          />
        </div>
        <div className="form-input-container">
          <label>Groupe</label>
          <input
            type="text"
            ref={groupRef}
            defaultValue={location?.state?.group}
          />
        </div>
        <div className="form-button-container">
          <button type="submit">Envoyer</button>
        </div>
      </form>
    </div>
  );
}
