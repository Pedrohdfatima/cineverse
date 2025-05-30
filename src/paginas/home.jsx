import { useEffect, useState } from "react";
import { getPopularMovies, getPopularSeries } from "../api/tmdb";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);

  useEffect(() => {
    getPopularMovies().then(setMovies);
    getPopularSeries().then(setSeries);
  }, []);

  return (
    <div
      className="min-h-screen px-4 py-6 sm:px-6 md:px-10"
      style={{
        background: "linear-gradient(to right, black, #7b0f17)",
        color: "gold",
      }}
    >
      {/* Título Filmes */}
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Filmes em alta</h1>

      {/* Carrossel filmes */}
      <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-red-700 scrollbar-track-black pb-4">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="min-w-[120px] sm:min-w-[150px] md:min-w-[180px] h-[180px] sm:h-[220px] bg-white rounded overflow-hidden flex-shrink-0"
          >
            {movie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-full object-cover rounded"
              />
            )}
          </div>
        ))}
      </div>

      {/* Título Séries */}
      <h1 className="text-xl sm:text-2xl font-bold my-6">Séries em alta</h1>

      {/* Carrossel séries */}
      <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-red-700 scrollbar-track-black pb-4">
        {series.map((serie) => (
          <div
            key={serie.id}
            className="min-w-[120px] sm:min-w-[150px] md:min-w-[180px] h-[180px] sm:h-[220px] bg-white rounded overflow-hidden flex-shrink-0"
          >
            {serie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w200${serie.poster_path}`}
                alt={serie.name}
                className="w-full h-full object-cover rounded"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
