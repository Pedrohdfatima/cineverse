import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../img/logo.png";
import perfil from "../img/perfil.png"
import styles from "../styles/header.module.css";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [termo, setTermo] = useState("");

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/filmes", label: "Filmes" },
    { path: "/series", label: "Séries" },
    { path: "/sobre", label: "Sobre Nós" },
  ];

 const handleSubmit = (e) => {
    e.preventDefault();
    if (termo.trim()) {
      navigate(`/busca?q=${encodeURIComponent(termo.trim())}`);
      // Limpa o termo apenas se não estiver na página de busca
      if (location.pathname !== "/busca") {
        setTermo("");
      }
    }
  };

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logoContainer}>
        <img src={logo} alt="CineVerse Logo" className={styles.logo} />
        <span className={styles.siteName}>CineVerse</span>
      </Link>

      <nav className={styles.nav}>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`${styles.navLink} ${
              location.pathname === link.path ? styles.active : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Pesquisar"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          className={styles.searchInput}
        />
      </form>


        <Link to="/Perfil" className={styles.logoContainer}>
        <img src={perfil} alt="PerfilLogo" className={styles.perfil} />
      </Link>
    </header>
  );
}
