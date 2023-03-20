import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Auth from "./Auth";
import { AuthProvider } from "./hooks/useAuth";
import Videos from "./Videos";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Videos />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
