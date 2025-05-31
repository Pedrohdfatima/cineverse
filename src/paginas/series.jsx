import { useEffect, useState } from "react";
import { getPopularSeries } from "../api/tmdb";
import styles from "../styles/series.module.css";

export default function Series() {
  const [series, setSeries] = useState([]);

  useEffect(() => {
    getPopularSeries().then(setSeries);
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.sectionTitle}>Séries em alta</h1>
      <div className={styles.scrollContainer}>
        {series.map((serie) => (
          <div key={serie.id} className={styles.card}>
            {serie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w200${serie.poster_path}`}
                alt={serie.name}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
