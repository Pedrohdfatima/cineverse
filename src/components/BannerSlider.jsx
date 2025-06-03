import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import styles from "../styles/bannerSlider.module.css";

function NextArrow(props) {
  const { onClick } = props;
  return (
    <div className={`${styles.customArrow} ${styles.nextArrow}`} onClick={onClick}>
      <FaChevronRight />
    </div>
  );
}

function PrevArrow(props) {
  const { onClick } = props;
  return (
    <div className={`${styles.customArrow} ${styles.prevArrow}`} onClick={onClick}>
      <FaChevronLeft />
    </div>
  );
}

export default function BannerSlider({ dados }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className={styles.sliderContainer}>
      <Slider {...settings}>
        {dados.map((item) => (
          <div className={styles.slide} key={item.id}>
            <Link to={`/detalhes/${item.media_type || item.title ? "movie" : "tv"}/${item.id}`}>
              <img
                src={`https://image.tmdb.org/t/p/w1280${item.backdrop_path}`}
                alt={item.title || item.name}
                className={styles.slideImage}
              />
              <div className={styles.caption}>
                <h2>{item.title || item.name}</h2>
                <p>{item.overview?.slice(0, 150)}...</p>
              </div>
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
}
