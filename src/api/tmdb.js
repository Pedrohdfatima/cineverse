import axios from "axios";

const apiKey = process.env.REACT_APP_TMDB_API_KEY;
const baseURL = "https://api.themoviedb.org/3";

export const getPopularMovies = async () => {
  const response = await axios.get(`${baseURL}/movie/popular`, {
    params: {
      api_key: apiKey,
      language: "pt-BR",
    },
  });
  return response.data.results;
};

export const getPopularSeries = async () => {
  const response = await axios.get(`${baseURL}/tv/popular`, {
    params: {
      api_key: apiKey,
      language: "pt-BR",
    },
  });
  return response.data.results;
};
