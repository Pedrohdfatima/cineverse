export default function Sobre() {
  return (
    <div
      className="min-h-screen px-4 py-6 sm:px-6 md:px-10 max-w-4xl mx-auto"
      style={{
        background: "linear-gradient(to right, black, #7b0f17)",
        color: "gold",
      }}
    >
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Sobre Nós</h1>
      <p className="text-white text-sm sm:text-base leading-relaxed">
        O CineVerse é uma plataforma de descoberta de filmes e séries.
        Nosso objetivo é reunir os melhores conteúdos, oferecer informações detalhadas
        e facilitar o acesso a diferentes serviços de streaming.
      </p>
    </div>
  );
}
