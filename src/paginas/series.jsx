import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "../styles/series.module.css";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const LANG = "pt-BR";

// Gêneros de séries (baseado na TMDB)
const GENRES = [
  { id: 10759, name: "Ação & Aventura" },
  { id: 16, name: "Animação" },
  { id: 35, name: "Comédia" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentário" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Família" },
  { id: 10762, name: "Infantil" },
  { id: 9648, name: "Mistério" },
  { id: 10763, name: "Notícias" },
  { id: 10764, name: "Reality" },
  { id: 10765, name: "Sci-Fi & Fantasia" },
  { id: 10766, name: "Soap" },
  { id: 10767, name: "Talk" },
  { id: 10768, name: "Guerra & Política" },
];

function HorizontalScroll({ title, fetchUrl, params = {} }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const loader = useRef(null);

  const fetchItems = async () => {
    try {
      const res = await axios.get(fetchUrl, {
        params: { api_key: API_KEY, language: LANG, page, ...params },
      });
      setItems((prev) => [...prev, ...res.data.results]);
    } catch (error) {
      console.error(`Erro ao buscar itens da seção ${title}:`, error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: "100px" }
    );

    if (loader.current) observer.observe(loader.current);
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, []);

  return (
    <>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.scrollContainer}>
        {items.map((item) => (
          <Link
            to={`/detalhes/tv/${item.id}`}
            key={item.id}
            className={styles.card}
            title={item.name}
          >
            <img
              src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
              alt={item.name}
            />
            <p className={styles.cardTitle}>{item.name || "Sem título"}</p>
          </Link>
        ))}
        <div ref={loader} style={{ width: "30px" }} />
      </div>
    </>
  );
}

export default function Series() {
  return (
    <div className={styles.container}>
      {/* Categorias principais */}
      <HorizontalScroll
        title="Séries Populares"
        fetchUrl="https://api.themoviedb.org/3/tv/popular"
      />
      <HorizontalScroll
        title="Melhores Avaliadas"
        fetchUrl="https://api.themoviedb.org/3/tv/top_rated"
      />
      <HorizontalScroll
        title="No Ar Agora"
        fetchUrl="https://api.themoviedb.org/3/tv/on_the_air"
      />
      <HorizontalScroll
        title="Séries Em Breve"
        fetchUrl="https://api.themoviedb.org/3/tv/airing_today"
      />

      {/* Séries por gêneros */}
      {GENRES.map(({ id, name }) => (
        <HorizontalScroll
          key={id}
          title={`Séries de ${name}`}
          fetchUrl="https://api.themoviedb.org/3/discover/tv"
          params={{ with_genres: id }}
        />
      ))}
    </div>
  );
}
