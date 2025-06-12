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
import Login from "./paginas/Login";
import Cadastro from "./paginas/Cadastro";
import Perfil from "./paginas/Perfil"; // Importe a página de Perfil
import EditarPerfil from "./paginas/EditarPerfil"; // Importe a nova página

import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

import { AuthProvider } from "./contexts/AuthContext";
import { WatchLaterProvider } from "./contexts/WatchLaterContext"; // Importe o Provider
import { FavoritesProvider } from "./contexts/FavoritesContext"; // Importe o Provider
import { RatingsProvider } from "./contexts/RatingsContext"; // Importe o Provider

import "./styles/global.css";

function App() {
  return (
    <AuthProvider>
      <WatchLaterProvider>
        <FavoritesProvider>
         <RatingsProvider>
          <Router>
              <Header />
                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/cadastro" element={<Cadastro />} />
                    <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
                    <Route path="/filmes" element={<Filmes />} />
                    <Route path="/series" element={<Series />} />
                    <Route path="/sobre" element={<Sobre />} />
                    <Route path="/detalhes/:tipo/:id" element={<Detalhes />} />
                    <Route path="/busca" element={<Busca />} />
                    <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
                    <Route path="/perfil/editar" element={<ProtectedRoute><EditarPerfil /></ProtectedRoute>} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </main>
            </Router>
          </RatingsProvider>
        </FavoritesProvider>
      </WatchLaterProvider>
    </AuthProvider>
  );
}

export default App;