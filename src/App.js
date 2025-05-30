import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home";
import Filmes from "./pages/filmes";
import Series from "./pages/series";
import Sobre from "./pages/sobre";

function App() {
  return (
    <Router>
      <header className="bg-[#0d0d1a] text-white flex items-center justify-between px-6 py-4">
        <div className="text-red-500 font-bold text-xl">CineVerse</div>
        <nav className="flex gap-6">
          <Link to="/">Home</Link>
          <Link to="/filmes">Filmes</Link>
          <Link to="/series">Séries</Link>
          <Link to="/sobre">Sobre Nós</Link>
        </nav>
        <div>
          <input
            type="text"
            placeholder="Pesquisar"
            className="px-2 py-1 rounded"
          />
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/filmes" element={<Filmes />} />
          <Route path="/series" element={<Series />} />
          <Route path="/sobre" element={<Sobre />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
