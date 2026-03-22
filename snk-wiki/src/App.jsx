import { Routes, Route } from "react-router-dom";
import Character from "./pages/Character";

function App() {
  return (
    <Routes>
      <Route path="/perso" element={<Character />} />
    </Routes>
  );
}

export default App;
