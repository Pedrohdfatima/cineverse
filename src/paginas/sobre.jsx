import styles from "../styles/sobre.module.css";

export default function Sobre() {
  return (
    <div className={styles.container}>
      <h1 className="text-2xl font-bold mb-4">Sobre Nós</h1>
      <p className={styles.text}>
        O CineVerse é uma plataforma de descoberta de filmes e séries.
        Nosso objetivo é reunir os melhores conteúdos, oferecer informações detalhadas
        e facilitar o acesso a diferentes serviços de streaming.
      </p>
    </div>
  );
}
