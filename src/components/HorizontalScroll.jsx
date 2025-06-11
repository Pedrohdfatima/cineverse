import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import styles from "../styles/horizontalScroll.module.css";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const LANG = "pt-BR";
const SCROLL_OFFSET_PERCENTAGE = 0.9;

export default function HorizontalScroll({ title, fetchUrl, params = {}, mediaType, initialData = null }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  const scrollContainerRef = useRef(null);
  const initialFetchDone = useRef(false);

  const fetchItems = async (currentPage) => {
    if (loading || (currentPage > 1 && !hasMore)) return;
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

  useEffect(() =>{
    if(initialData) {
      setItems(initialData);
      setHasMore(false);
      initialFetchDone.current = true;
      } else if (!initialFetchDone.current) {
        fetchItems(1)
        initialFetchDone.current = true;
      }
  }, [initialData, fetchUrl, params]);

  useEffect(() => {
    if (!initialData && page > 1) {
      fetchItems(page)
    }
  }, [page, initialData])
  
  const updateScrollButtonsState = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const scrollableWidth = scrollWidth - clientWidth;
      
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollableWidth - 10);

      if (scrollWidth - (scrollLeft + clientWidth) < clientWidth * 2 && hasMore && !loading) {
        setPage(prevPage => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    if (!initialFetchDone.current) {
      fetchItems(1);
      initialFetchDone.current = true;
    }
  }, [fetchUrl, params]);

  useEffect(() => {
    if (page > 1) {
      fetchItems(page);
    }
  }, [page]);

  useEffect(() => {
    const currentScrollContainer = scrollContainerRef.current;
    if (currentScrollContainer) {
      currentScrollContainer.addEventListener('scroll', updateScrollButtonsState, { passive: true });
      window.addEventListener('resize', updateScrollButtonsState);
      updateScrollButtonsState();
      return () => {
        currentScrollContainer.removeEventListener('scroll', updateScrollButtonsState);
        window.removeEventListener('resize', updateScrollButtonsState);
      };
    }
  }, [items, hasMore, loading]);

  const handleArrowScroll = (direction) => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * SCROLL_OFFSET_PERCENTAGE;
      scrollContainerRef.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <section 
      className={styles.section}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.scrollWrapper}>
        {isHovering && canScrollLeft && (
          <button
            onClick={() => handleArrowScroll("left")}
            className={`${styles.customArrow} ${styles.prevArrow}`}
            aria-label="Rolar para esquerda"
          >
            <FaChevronLeft />
          </button>
        )}
        <div className={styles.scrollContainer} ref={scrollContainerRef}>
          {items.map((item) => (
            <Link
              to={`/detalhes/${mediaType}/${item.id}`}
              key={`${mediaType}-${item.id}`}
              className={styles.card}
              title={item.title || item.name}
            >
              <img
                src={item.poster_path ? `https://image.tmdb.org/t/p/w342${item.poster_path}` : "https://placehold.co/342x513/141414/E50914?text=Indisponível"}
                alt={item.title || item.name}
                loading="lazy"
              />
              <p className={styles.cardTitle}>{item.title || item.name}</p>
            </Link>
          ))}
        </div>
        {isHovering && canScrollRight && (
          <button
            onClick={() => handleArrowScroll("right")}
            className={`${styles.customArrow} ${styles.nextArrow}`}
            aria-label="Rolar para direita"
          >
            <FaChevronRight />
          </button>
        )}
      </div>
      {loading && items.length > 0 && <p className={styles.loadingMore}>Carregando mais...</p>}
    </section>
  );
}