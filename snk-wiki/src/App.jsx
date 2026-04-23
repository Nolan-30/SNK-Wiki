import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

// import des composants

import Header from "./components/Header";
import Home from "./components/Home";
import Footer from "./components/Footer";
import History from "./components/History";
import Characters from "./components/Characters";
import Seasons from "./components/Seasons";
import Titans from "./components/Titans";
import Register from "./components/Register.jsx";
import Login from "./components/Login";
import Profile from "./components/Profile";

function App() {
  useEffect(() => {
    AOS.init({ duration: 1500 });
  }, []);

  return (
    <Router>
      <Header />
      <main style={{ minHeight: "80vh" }}>
        {" "}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Histoire" element={<History />} />
          <Route path="/Personnages" element={<Characters />} />
          <Route path="/Titans" element={<Titans />} />
          <Route path="/Saisons" element={<Seasons />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
