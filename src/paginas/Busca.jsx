import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "../styles/busca.module.css";

export default function Busca() {
  const [resultados, setResultados] = useState([]);
  const [termo, setTermo] = useState("");
  const [loading, setLoading] = useState(false);

  const buscarTudo = async () => {
    if (!termo.trim()) {
      setResultados([]);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        "https://api.themoviedb.org/3/search/multi",
        {
          params: {
            api_key: process.env.REACT_APP_TMDB_API_KEY,
            language: "pt-BR",
            query: termo,
            include_adult: false,
          },
        }
      );
      setResultados(res.data.results);
    } catch (err) {
      console.error("Erro na busca:", err);
      setResultados([]);
    } finally {
      setLoading(false);
    }
  };

  // Separar resultados em arrays de filmes e séries
  const filmes = resultados.filter((item) => item.media_type === "movie");
  const series = resultados.filter((item) => item.media_type === "tv");

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Buscar Filmes e Séries</h2>
      <div className={styles.searchBox}>
        <input
          type="text"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          placeholder="Digite o nome do filme ou série"
          className={styles.searchInput}
          onKeyDown={(e) => {
            if (e.key === "Enter") buscarTudo();
          }}
        />
        <button onClick={buscarTudo} className={styles.searchButton}>
          Buscar
        </button>
      </div>

      {loading && <p>Carregando...</p>}

      {!loading && resultados.length === 0 && termo.trim() !== "" && (
        <p>Nenhum resultado encontrado.</p>
      )}

      {filmes.length > 0 && (
        <>
          <h3 className={styles.subTitle}>Filmes</h3>
          <div className={styles.scrollContainer}>
            {filmes.map((item) => (
              <Link
                to={`/detalhes/${item.media_type}/${item.id}`}
                key={item.id}
                className={styles.card}
                title={item.title}
              >
                <img
                  src={
                    item.poster_path
                      ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                      : "https://via.placeholder.com/150x220?text=Sem+Imagem"
                  }
                  alt={item.title}
                />
              </Link>
            ))}
          </div>
        </>
      )}

      {series.length > 0 && (
        <>
          <h3 className={styles.subTitle}>Séries</h3>
          <div className={styles.scrollContainer}>
            {series.map((item) => (
              <Link
                to={`/detalhes/${item.media_type}/${item.id}`}
                key={item.id}
                className={styles.card}
                title={item.name}
              >
                <img
                  src={
                    item.poster_path
                      ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                      : "https://via.placeholder.com/150x220?text=Sem+Imagem"
                  }
                  alt={item.name}
                />
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
