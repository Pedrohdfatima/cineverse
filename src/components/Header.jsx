import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../img/logo.png";
import styles from "../styles/header.module.css";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const rotaAtual = location.pathname;
  const [termo, setTermo] = useState("");

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
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Link to="/" className={styles.logoLink}>
          <img src={logo} alt="CineVerse Logo" className={styles.logo} />
          <span className={styles.siteName}>CineVerse</span>
        </Link>
      </div>

      <nav className={styles.nav}>
        {navLinks
          .filter((link) => link.path !== rotaAtual)
          .map((link) => (
            <Link key={link.path} to={link.path} className={styles.navLink}>
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
    </header>
  );
}
