import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styles from '../styles/editarPerfil.module.css';

export default function EditarPerfil() {
  const { usuario, updateUser, logout } = useAuth();
  const [nome, setNome] = useState(usuario?.nome || '');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (senha && senha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      updateUser({ nome, senha });
      alert("Perfil atualizado com sucesso! Faça o login novamente.");
      logout();
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Editar Perfil</h2>
        <div className={styles.inputGroup}>
          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="senha">Nova Senha (deixe em branco para não alterar)</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="confirmarSenha">Confirmar Nova Senha</label>
          <input
            id="confirmarSenha"
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button}>Salvar Alterações</button>
      </form>
    </div>
  );
}