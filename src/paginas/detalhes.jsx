// src/pages/detalhes.js
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Detalhes() {
  const { tipo, id } = useParams();
  const [dados, setDados] = useState(null);

  useEffect(() => {
    const buscarDetalhes = async () => {
      try {
        const res = await axios.get(`https://api.themoviedb.org/3/${tipo}/${id}`, {
          params: {
            api_key: process.env.REACT_APP_TMDB_API_KEY,
            language: "pt-BR",
          },
        });
        setDados(res.data);
      } catch (err) {
        console.error("Erro ao buscar detalhes:", err);
      }
    };

    buscarDetalhes();
  }, [tipo, id]);

  if (!dados) return <div className="container">Carregando...</div>;

  return (
    <div className="container">
      <h1 className="sectionTitle">{dados.title || dados.name}</h1>
      <img
        src={`https://image.tmdb.org/t/p/w500${dados.poster_path}`}
        alt={dados.title || dados.name}
        className="mb-4 rounded"
        style={{ maxWidth: "300px" }}
      />
      <p className="mb-4 text-lg">{dados.overview}</p>
      <p><strong>Popularidade:</strong> {dados.popularity}</p>
      <p><strong>Nota:</strong> {dados.vote_average} ({dados.vote_count} votos)</p>
      {dados.homepage && (
        <p className="mt-2">
          <a
            href={dados.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-500 underline"
          >
            Página oficial
          </a>
        </p>
      )}
    </div>
  );
}
