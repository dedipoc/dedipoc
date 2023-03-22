import { useEffect, useState } from "react";
import { deleteUser, getUsers } from "./api/user";
import useAuth from "./hooks/useAuth";
import { PlusCircle, Trash } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

export default function Users() {
  const { fetchWithAuth } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchWithAuth(getUsers, null).then((users) => setUsers(users));
  }, []);

  function handleDelete(id) {
    console.debug("DELTE", id);
    fetchWithAuth(deleteUser, null, id).then(() => {
      fetchWithAuth(getUsers, null).then((users) => setUsers(users));
    });
  }
  console.debug("USERS", users);
  return (
    <div className="videos-container">
      <Link className="back-button" to="/users/edit">
        <PlusCircle />
        Nouveau
      </Link>
      <div className="videos-column">
        {users &&
          users
            .sort((a, b) => a.username.localeCompare(b.username))
            .map((user) => (
              <div>
                <div className="videos-element">
                  {/* <Link
                    className="videos-link"
                    onClick={() => handleLink(video._id)}
                  /> */}
                  <h2>{user.username}</h2>
                  <Trash
                    className="videos-link"
                    onClick={() => handleDelete(user.id)}
                  />
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
