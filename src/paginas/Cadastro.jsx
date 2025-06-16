import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import styles from "../styles/cadastro.module.css";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  // A função agora é 'async' para esperar a resposta do Firebase
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nome && email && senha) {
      try {
        // 'await' espera a função de registro terminar
        await register(nome, email, senha);
        
        alert("Cadastro realizado com sucesso! Você será redirecionado para a página inicial.");
        navigate("/"); // Redireciona para a home após o sucesso

      } catch (error) {
        // Se o Firebase retornar um erro, ele será capturado aqui
        console.error("Erro no cadastro:", error);
        
        // Exibe a mensagem de erro específica do Firebase para o usuário
        alert(`Erro ao cadastrar: ${error.message}`);
      }
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Cadastro</h2>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome Completo"
          required
          className={styles.input}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className={styles.input}
        />
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Senha (mínimo 6 caracteres)"
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Cadastrar</button>
        <p className={styles.loginLink}>
          Já tem uma conta? <Link to="/login">Faça login</Link>
        </p>
      </form>
    </div>
  );
}