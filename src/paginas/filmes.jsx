import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "../styles/filmes.module.css";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const LANG = "pt-BR";

// Gêneros estendidos
const GENRES = [
  { id: 28, name: "Ação" },
  { id: 35, name: "Comédia" },
  { id: 18, name: "Drama" },
  { id: 27, name: "Terror" },
  { id: 878, name: "Ficção Científica" },
  { id: 10749, name: "Romance" },
  { id: 16, name: "Animação" },
  { id: 12, name: "Aventura" },
  { id: 14, name: "Fantasia" },
];

// Componente reutilizável com infinite scroll horizontal
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
            to={`/detalhes/movie/${item.id}`}
            key={item.id}
            className={styles.card}
            title={item.title}
          >
            <img
              src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
              alt={item.title}
            />
            <p className={styles.cardTitle}>{item.title || "Sem título"}</p>
          </Link>
        ))}
        <div ref={loader} style={{ width: "30px" }} />
      </div>
    </>
  );
}

export default function Filmes() {
  return (
    <div className={styles.container}>
      {/* Categorias principais */}
      <HorizontalScroll
        title="Filmes Populares"
        fetchUrl="https://api.themoviedb.org/3/movie/popular"
      />
      <HorizontalScroll
        title="Melhores Avaliados"
        fetchUrl="https://api.themoviedb.org/3/movie/top_rated"
      />
      <HorizontalScroll
        title="Em Cartaz"
        fetchUrl="https://api.themoviedb.org/3/movie/now_playing"
      />
      <HorizontalScroll
        title="Próximos Lançamentos"
        fetchUrl="https://api.themoviedb.org/3/movie/upcoming"
      />
      <HorizontalScroll
        title="Tendências da Semana"
        fetchUrl="https://api.themoviedb.org/3/trending/movie/week"
      />

      {/* Filmes por gêneros */}
      {GENRES.map(({ id, name }) => (
        <HorizontalScroll
          key={id}
          title={`Filmes de ${name}`}
          fetchUrl="https://api.themoviedb.org/3/discover/movie"
          params={{ with_genres: id }}
        />
      ))}

      {/* Filmes para crianças (certificação US = G) */}
      <HorizontalScroll
        title="Filmes para Crianças"
        fetchUrl="https://api.themoviedb.org/3/discover/movie"
        params={{ certification_country: "US", certification: "G", sort_by: "popularity.desc" }}
      />

      {/* Filmes com maior receita */}
      <HorizontalScroll
        title="Filmes com Maior Receita"
        fetchUrl="https://api.themoviedb.org/3/discover/movie"
        params={{ sort_by: "revenue.desc" }}
      />

      {/* Filmes recentes (últimos 6 meses)
      <HorizontalScroll
        title="Filmes Recentes"
        fetchUrl="https://api.themoviedb.org/3/discover/movie"
        params={{
          "primary_release_date.gte": getSixMonthsAgoDate(),
          sort_by: "primary_release_date.desc",
        }}
      /> */}
    </div>
  );
}

// Função para calcular a data de 6 meses atrás no formato yyyy-mm-dd
function getSixMonthsAgoDate() {
  const date = new Date();
  date.setMonth(date.getMonth() - 6);
  return date.toISOString().slice(0, 10);
}
