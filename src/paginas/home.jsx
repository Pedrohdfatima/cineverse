import { useEffect, useState } from "react";
import axios from "axios";
import BannerSlider from "../components/BannerSlider";
import { Link } from "react-router-dom";
import styles from "../styles/home.module.css";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const LANG = "pt-BR";

const categorias = [
  { id: 28, nome: "Ação" },
  { id: 35, nome: "Comédia" },
  { id: 27, nome: "Terror" },
  { id: 10749, nome: "Romance" },
  { id: 16, nome: "Animação" },
  { id: 99, nome: "Documentário" },
  { id: 18, nome: "Drama" },
  { id: 878, nome: "Ficção Científica" },
];

export default function Home() {
  const [dadosCategorias, setDadosCategorias] = useState({});
  const [tendencias, setTendencias] = useState([]);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const tendenciasRes = await axios.get(
          "https://api.themoviedb.org/3/trending/all/week",
          {
            params: { api_key: API_KEY, language: LANG },
          }
        );
        setTendencias(tendenciasRes.data.results);

        const promises = categorias.map((cat) =>
          axios.get("https://api.themoviedb.org/3/discover/movie", {
            params: {
              api_key: API_KEY,
              language: LANG,
              with_genres: cat.id,
            },
          })
        );

        const results = await Promise.all(promises);
        const novosDados = {};
        results.forEach((res, idx) => {
          novosDados[categorias[idx].nome] = res.data.results;
        });
        setDadosCategorias(novosDados);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchDados();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.sliderWrapper}>
        <BannerSlider dados={tendencias.slice(0, 5)} />
      </div>

      <h2 className={styles.sectionTitle}>Tendências da Semana</h2>
      <div className={styles.scrollContainer}>
        {tendencias.map((item) => (
          <Link
            to={`/detalhes/${item.media_type || "movie"}/${item.id}`}
            key={item.id}
            className={styles.card}
            title={item.title || item.name}
          >
            <img
              src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
              alt={item.title || item.name}
            />
            <p className={styles.cardTitle}>{item.title || item.name}</p>
          </Link>
        ))}
      </div>

      {categorias.map((cat) => (
        <div key={cat.id} className={styles.section}>
          <h2 className={styles.sectionTitle}>{cat.nome}</h2>
          <div className={styles.scrollContainer}>
            {(dadosCategorias[cat.nome] || []).map((filme) => (
              <Link
                to={`/detalhes/movie/${filme.id}`}
                key={filme.id}
                className={styles.card}
                title={filme.title}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w300${filme.poster_path}`}
                  alt={filme.title}
                />
                <p className={styles.cardTitle}>{filme.title}</p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
