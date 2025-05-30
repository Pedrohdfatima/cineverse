import { useEffect, useState } from "react";
import axios from "axios";

export default function Series() {
  const [series, setSeries] = useState([]);

  useEffect(() => {
    const fetchSeries = async () => {
      const res = await axios.get("https://api.themoviedb.org/3/tv/popular", {
        params: {
          api_key: process.env.REACT_APP_TMDB_API_KEY,
          language: "pt-BR",
        },
      });
      setSeries(res.data.results);
    };

    fetchSeries();
  }, []);

  return (
    <div
      className="min-h-screen px-4 py-6 sm:px-6 md:px-10"
      style={{
        background: "linear-gradient(to right, black, #7b0f17)",
        color: "gold",
      }}
    >
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Séries em alta</h1>

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
