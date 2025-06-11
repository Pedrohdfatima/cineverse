import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import styles from "../styles/horizontalScroll.module.css";

// Chave da API e idioma
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const LANG = "pt-BR";
const SCROLL_OFFSET_PERCENTAGE = 0.9; // Rolar 90% da largura visível para mostrar mais itens novos

/**
 * Componente HorizontalScroll estilizado similar à Netflix,
 * com setas sobrepostas e transições fluidas.
 */
export default function HorizontalScroll({ title, fetchUrl, params = {}, mediaType }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  const scrollContainerRef = useRef(null);
  const initialFetchDone = useRef(false);
  const currentFetchUrl = useRef(fetchUrl);
  const currentParamsString = useRef(JSON.stringify(params));
  const sectionRef = useRef(null);

  const fetchItems = async (currentPage) => {
    if (loading) return;
    if (currentPage > 1 && !hasMore) return;

    setLoading(true);
    try {
      const res = await axios.get(fetchUrl, {
        params: { api_key: API_KEY, language: LANG, page: currentPage, ...params },
      });
      if (res.data.results && res.data.results.length > 0) {
        setItems((prevItems) => {
          const newItems = res.data.results.filter(
            (newItem) => !prevItems.some((prevItem) => prevItem.id === newItem.id)
          );
          return currentPage === 1 ? res.data.results : [...prevItems, ...newItems];
        });
        setHasMore(res.data.page < res.data.total_pages);
      } else {
        if (currentPage === 1) setItems([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error(`Erro ao buscar itens da seção "${title}":`, error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchUrl !== currentFetchUrl.current || JSON.stringify(params) !== currentParamsString.current) {
      setItems([]);
      setPage(1);
      setHasMore(true);
      initialFetchDone.current = false;
      currentFetchUrl.current = fetchUrl;
      currentParamsString.current = JSON.stringify(params);
    }
  }, [fetchUrl, params]);

  useEffect(() => {
    if (!initialFetchDone.current && (items.length === 0 || fetchUrl !== currentFetchUrl.current || JSON.stringify(params) !== currentParamsString.current)) {
      fetchItems(1);
      initialFetchDone.current = true;
    }
  }, [items.length, fetchUrl, params]);


  const updateScrollButtonsState = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const scrollableWidth = scrollWidth - clientWidth;
      
      setCanScrollLeft(scrollLeft > 10); // Pequena tolerância para ativar
      // Considera "canScrollRight" se o scrollLeft for menor que o máximo possível OU se houver mais itens para carregar
      setCanScrollRight(scrollLeft < scrollableWidth - 10 || (hasMore && items.length > 0));
    } else {
      setCanScrollLeft(false);
      setCanScrollRight(items.length > 0 && hasMore);
    }
  };

  useEffect(() => {
    updateScrollButtonsState();
    const currentScrollContainer = scrollContainerRef.current;
    if (currentScrollContainer) {
      currentScrollContainer.addEventListener('scroll', updateScrollButtonsState, { passive: true });
      window.addEventListener('resize', updateScrollButtonsState);
      return () => {
        currentScrollContainer.removeEventListener('scroll', updateScrollButtonsState);
        window.removeEventListener('resize', updateScrollButtonsState);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, hasMore, loading]);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = scrollContainerRef.current;
      const scrollAmountValue = clientWidth * SCROLL_OFFSET_PERCENTAGE;
      const newScrollLeft = scrollLeft + (direction === "right" ? scrollAmountValue : -scrollAmountValue);
      scrollContainerRef.current.scrollTo({ left: newScrollLeft, behavior: "smooth" });

      const isNearEndForLoad = scrollWidth - (scrollLeft + clientWidth) < clientWidth * 2; // Perto do fim se resta menos de duas "telas"
      if (direction === "right" && isNearEndForLoad && hasMore && !loading) {
        setPage(prevPage => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    if (page > 1 && initialFetchDone.current) {
      fetchItems(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    const sectionElement = sectionRef.current;
    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    if (sectionElement) {
      sectionElement.addEventListener('mouseenter', handleMouseEnter);
      sectionElement.addEventListener('mouseleave', handleMouseLeave);
    }
    return () => {
      if (sectionElement) {
        sectionElement.removeEventListener('mouseenter', handleMouseEnter);
        sectionElement.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  // Mostrar skeleton ou mensagem de carregamento inicial
  if (!initialFetchDone.current && loading && items.length === 0) {
    return (
      <section className={styles.section} ref={sectionRef}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {/* Placeholder para simular cards carregando */}
        <div className={styles.scrollContainer}>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={`skeleton-${index}`} className={`${styles.card} ${styles.skeletonCard}`}></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section} ref={sectionRef}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={`${styles.scrollWrapper} ${isHovering ? styles.hoverActive : ''}`}>
        {items.length > 0 && canScrollLeft && ( // Só mostra se houver itens e puder rolar
          <button
            onClick={() => handleScroll("left")}
            className={`${styles.arrowButton} ${styles.arrowLeft}`}
            aria-label="Rolar para esquerda"
          >
            <FaChevronLeft size="1.8em" />
          </button>
        )}
        <div className={styles.scrollContainer} ref={scrollContainerRef}>
          {items.map((item) => (
            <Link
              to={`/detalhes/${mediaType}/${item.id}`}
              key={`${mediaType}-${item.id}-${item.title || item.name || Math.random()}`}
              className={styles.card}
              title={item.title || item.name}
            >
              <img
                src={item.poster_path ? `https://image.tmdb.org/t/p/w342${item.poster_path}` : "https://placehold.co/342x513/141414/E50914?text=Indisponível"}
                alt={item.title || item.name || "Poster do item"}
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/342x513/141414/E50914?text=Erro"; }}
                loading="lazy"
              />
              <div className={styles.cardOverlay}>
                <p className={styles.cardTitle}>{item.title || item.name || "Título não disponível"}</p>
              </div>
            </Link>
          ))}
        </div>
        {items.length > 0 && canScrollRight && ( // Só mostra se houver itens e puder rolar
          <button
            onClick={() => handleScroll("right")}
            className={`${styles.arrowButton} ${styles.arrowRight}`}
            aria-label="Rolar para direita"
          >
            <FaChevronRight size="1.8em" />
          </button>
        )}
      </div>
      {loading && items.length > 0 && <p className={styles.loadingMore}>Carregando mais...</p>}
      {!loading && !hasMore && items.length === 0 && initialFetchDone.current && (
        <p className={styles.noResults}>Nenhum item encontrado para "{title}".</p>
      )}
    </section>
  );
}
