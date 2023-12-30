import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "./components/SharedLayout";
import SharedLayout from "./components/SharedLayout";
import AddEtudiant from "./pages/AddEtudiant";
import ListeEtudiants from "./pages/ListeEtudiants";
import Error from "./pages/Error";
import Dashboard from "./pages/Dashboard";
import AddProfessor from "./pages/AddProfessor";
import ListProfesseurs from "./pages/ListeProfesseurs";
import AddGroup from "./pages/AddGroup";
import ListeGroupes from "./pages/ListeGroupes";
import AddTooth from "./pages/AddTooth";
import ListeTeeth from "./pages/ListeTeeth";
import AddPW from "./pages/AddPW";
import ListePWs from "./pages/ListePWs";
import Login from "./pages/Login";
import { useEffect, useState } from "react";
import ProtectedRoute from "./pages/ProtectedRoute";
import Profil from "./pages/Profil";
import axios from "./api/axios";

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [photo, setPhoto] = useState("");

  useEffect(() => {
    if (user && user.id) {
      axios
        .get(`/api/professors/professor/${user.id}/image`, {
          responseType: "arraybuffer",
        })
        .then((response) => {
          const blob = new Blob([response.data], { type: "image/jpeg" });
          const imageUrl = URL.createObjectURL(blob);
          setPhoto(imageUrl);
        })
        .catch((error) => {
          console.error("Error fetching image:", error);
        });
    }
  }, [user]);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute user={user}>
                <SharedLayout photo={photo} setUser={setUser} user={user} />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="add-prof" element={<AddProfessor />} />
            <Route path="professors-list" element={<ListProfesseurs />} />
            <Route path="add-group" element={<AddGroup />} />
            <Route path="groups-list" element={<ListeGroupes />} />
            <Route path="add-etud" element={<AddEtudiant />} />
            <Route path="etuds-list" element={<ListeEtudiants />} />
            <Route path="add-tooth" element={<AddTooth />} />
            <Route path="teeth-list" element={<ListeTeeth />} />
            <Route path="add-pw" element={<AddPW />} />
            <Route path="pws-list" element={<ListePWs />} />
            <Route
              path="profil"
              element={
                <Profil
                  setPhoto={setPhoto}
                  photo={photo}
                  user={user}
                  setUser={setUser}
                />
              }
            />
          </Route>
          <Route path="login" element={<Login setUser={setUser} />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
