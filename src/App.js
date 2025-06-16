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
import Perfil from "./paginas/Perfil";
import EditarPerfil from "./paginas/EditarPerfil";
import Assistir from "./paginas/Assistir";

import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

import { AuthProvider } from "./contexts/AuthContext";
import { WatchLaterProvider } from "./contexts/WatchLaterContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { RatingsProvider } from "./contexts/RatingsContext";
import { HistoryProvider } from "./contexts/HistoryContext"; 

import "./styles/global.css";

function App() {
  return (
    <AuthProvider>
      <HistoryProvider> 
      <WatchLaterProvider>
        <FavoritesProvider>
         <RatingsProvider>
          <Router basename="/cineverse">
              <Header />
                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/cadastro" element={<Cadastro />} />
                    <Route path="/sobre" element={<Sobre />} />
                    <Route path="/detalhes/:tipo/:id" element={<Detalhes />} />
                    <Route path="/busca" element={<Busca />} />
                    <Route path="/filmes" element={<Filmes />} />
                    <Route path="/series" element={<Series />} />
                    <Route path="/assistir/:tipo/:id" element={<Assistir />} />
                    <Route path="/assistir/:tipo/:id/:season/:episode" element={<Assistir />} />
                    
                    <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
                    <Route path="/perfil/editar" element={<ProtectedRoute><EditarPerfil /></ProtectedRoute>} />
                    
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </main>
            </Router>
          </RatingsProvider>
        </FavoritesProvider>
      </WatchLaterProvider>
      </HistoryProvider>
    </AuthProvider>
  );
}

export default App;