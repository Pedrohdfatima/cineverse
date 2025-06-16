import React, { useContext, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { WatchLaterContext } from '../contexts/WatchLaterContext';
import { FavoritesContext } from '../contexts/FavoritesContext';
import { RatingsContext } from '../contexts/RatingsContext';
import styles from '../styles/perfil.module.css';

export default function Perfil() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const { list: watchLaterList } = useContext(WatchLaterContext);
  const { favorites } = useContext(FavoritesContext);
  const { ratings } = useContext(RatingsContext);

  const stats = useMemo(() => {
    // A lógica das estatísticas que usa o watchLaterList já está correta
    const todosItens = [...watchLaterList, ...favorites, ...ratings.map(r => r.item)];
    const totalHoras = todosItens.reduce((acc, item) => acc + (item.runtime || 0), 0) / 60;
    
    const generos = todosItens.flatMap(item => item.genres || []).map(g => g.name);
    const contagemGeneros = generos.reduce((acc, genero) => {
        acc[genero] = (acc[genero] || 0) + 1;
        return acc;
    }, {});

    const generoFavorito = Object.keys(contagemGeneros).sort((a,b) => contagemGeneros[b] - contagemGeneros[a])[0];

    return {
      totalAssistirDepois: watchLaterList.length,
      totalFavoritos: favorites.length,
      totalAvaliados: ratings.length,
      totalHoras: totalHoras.toFixed(2),
      generoFavorito: generoFavorito || "Nenhum",
    }
  }, [watchLaterList, favorites, ratings]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileHeader}>
        <h1>Perfil de {usuario?.nome}</h1>
        <p>Email: {usuario?.email}</p>
        <div className={styles.buttonContainer}>
          <Link to="/perfil/editar" className={styles.editButton}>Editar Perfil</Link>
          <button onClick={handleLogout} className={styles.logoutButton}>Sair</button>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Estatísticas</h2>
        <div className={styles.statsGrid}>
            <div className={styles.statCard}><h3>{stats.totalAssistirDepois}</h3><p>Para Assistir</p></div>
            <div className={styles.statCard}><h3>{stats.totalFavoritos}</h3><p>Favoritos</p></div>
            <div className={styles.statCard}><h3>{stats.totalAvaliados}</h3><p>Avaliados</p></div>
            <div className={styles.statCard}><h3>{stats.totalHoras}</h3><p>Horas na Lista</p></div>
            <div className={styles.statCard}><h3>{stats.generoFavorito}</h3><p>Gênero Favorito</p></div>
        </div>
      </div>
      
      {/* --- SEÇÃO "PARA ASSISTIR DEPOIS" ADICIONADA AQUI --- */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Para Assistir Depois</h2>
        {watchLaterList.length > 0 ? (
          <div className={styles.grid}>
            {watchLaterList.map((item) => (
              <Link key={`watch-${item.id}`} to={`/detalhes/${item.tipo}/${item.id}`} className={styles.card}>
                <img src={`https://image.tmdb.org/t/p/w300${item.poster_path}`} alt={item.title || item.name}/>
                <div className={styles.cardOverlay}><p>{item.title || item.name}</p></div>
              </Link>
            ))}
          </div>
        ) : <p>Sua lista para assistir depois está vazia.</p>}
      </div>
      
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Favoritos</h2>
        {favorites.length > 0 ? (
          <div className={styles.grid}>
            {favorites.map((item) => (
              <Link key={`fav-${item.id}`} to={`/detalhes/${item.tipo}/${item.id}`} className={styles.card}>
                <img src={`https://image.tmdb.org/t/p/w300${item.poster_path}`} alt={item.title || item.name}/>
                <div className={styles.cardOverlay}><p>{item.title || item.name}</p></div>
              </Link>
            ))}
          </div>
        ) : <p>Você ainda não favoritou nenhum item.</p>}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Conteúdo Avaliado</h2>
        {ratings.length > 0 ? (
          <div className={styles.grid}>
            {ratings.map((ratedItem) => (
              <Link key={`rat-${ratedItem.id}`} to={`/detalhes/${ratedItem.tipo}/${ratedItem.id}`} className={styles.card}>
                <img src={`https://image.tmdb.org/t/p/w300${ratedItem.poster_path}`} alt={ratedItem.title || ratedItem.name}/>
                <div className={styles.cardOverlay}><p>Sua nota: {ratedItem.rating} ★</p></div>
              </Link>
            ))}
          </div>
        ) : <p>Você ainda não avaliou nenhum item.</p>}
      </div>
    </div>
  );
}