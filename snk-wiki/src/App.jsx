import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

// import des composants

import Header from "./components/Header";
import Home from "./components/Home";
import Footer from "./components/Footer";
import Characters from "./components/Characters";

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
          <Route path="/perso" element={<Characters />} />
        </Routes>
      </main>
      <Footer /> {/* <--- Il doit être ICI, après les Routes */}
    </Router>
  );
}

export default App;
