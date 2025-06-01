import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Home from "./paginas/home";
import Filmes from "./paginas/filmes";
import Series from "./paginas/series";
import Sobre from "./paginas/sobre";
import Detalhes from "./paginas/detalhes";
import Busca from "./paginas/Busca";

import Header from "./components/Header";

import "./styles/global.css";

function App() {
  return (
    <Router>
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/filmes" element={<Filmes />} />
          <Route path="/series" element={<Series />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/detalhes/:tipo/:id" element={<Detalhes />} />
          <Route path="/busca" element={<Busca />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
