import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import Home from "./paginas/home";
import Filmes from "./paginas/filmes";
import Series from "./paginas/series";
import Sobre from "./paginas/sobre";
import Detalhes from "./paginas/detalhes";
import Busca from "./paginas/Busca";
import "./styles/global.css";

function Navbar() {
  const location = useLocation();
  const rotaAtual = location.pathname;
  const [termo, setTermo] = useState("");
  const navigate = useNavigate();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/filmes", label: "Filmes" },
    { path: "/series", label: "Séries" },
    { path: "/sobre", label: "Sobre Nós" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (termo.trim() !== "") {
      navigate(`/busca?q=${encodeURIComponent(termo.trim())}`);
      setTermo("");
    }
  };

  return (
    <header className="bg-[#0d0d1a] text-white flex items-center justify-between px-6 py-4">
      <div className="text-red-500 font-bold text-xl">CineVerse</div>
      <nav className="flex gap-6">
        {navLinks
          .filter((link) => link.path !== rotaAtual)
          .map((link) => (
            <Link key={link.path} to={link.path}>
              {link.label}
            </Link>
          ))}
      </nav>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Pesquisar"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          className="px-2 py-1 rounded"
        />
      </form>
    </header>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/filmes" element={<Filmes />} />
          <Route path="/series" element={<Series />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/detalhes/:tipo/:id" element={<Detalhes />} />
          <Route path="/busca" element={<Busca />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
