import styles from "../styles/sobre.module.css";

export default function Sobre() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Sobre o CineVerse</h1>
      <p className={styles.text}>
        Bem-vindo ao CineVerse, o seu universo particular de filmes e séries!
        Nosso objetivo é criar uma plataforma intuitiva e completa para que
        você possa descobrir, organizar e explorar o vasto mundo do
        entretenimento audiovisual.
      </p>
      <p className={styles.text}>
        Aqui, você pode pesquisar por títulos, ver detalhes como sinopse, elenco
        e onde assistir, além de criar listas personalizadas de favoritos e
        itens para ver depois. Este projeto foi desenvolvido com paixão por uma
        equipe dedicada de estudantes de desenvolvimento de sistemas.
      </p>

      <h2 className={styles.subtitle}>Equipe HélioDev</h2>
      <ul className={styles.teamList}>
        <li>Luis Henrique</li>
        <li>Pietro Henrique</li>
        <li>Ian Shima</li>
        <li>Pedro Henrique</li>
      </ul>
    </div>
  );
}