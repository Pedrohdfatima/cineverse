import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioLogado = localStorage.getItem("usuarioLogado");
    if (usuarioLogado) {
      setUsuario(JSON.parse(usuarioLogado));
    }
  }, []);

  const getUsuarios = () => {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
  };

  const login = (email, senha) => {
    const usuarios = getUsuarios();
    const usuarioEncontrado = usuarios.find(
      (u) => u.email === email && u.senha === senha
    );

    if (usuarioEncontrado) {
      const dadosSessao = { email: usuarioEncontrado.email, nome: usuarioEncontrado.nome };
      localStorage.setItem("usuarioLogado", JSON.stringify(dadosSessao));
      setUsuario(dadosSessao);
      return dadosSessao;
    } else {
      throw new Error("Email ou senha inválidos");
    }
  };

  const register = (novoUsuario) => {
    const usuarios = getUsuarios();
    const emailExistente = usuarios.some((u) => u.email === novoUsuario.email);

    if (emailExistente) {
      throw new Error("Este email já está cadastrado.");
    }

    const novosUsuarios = [...usuarios, novoUsuario];
    localStorage.setItem("usuarios", JSON.stringify(novosUsuarios));
  };

    const updateUser = (dadosAtualizados) => {
    if (!usuario) throw new Error("Usuário não está logado.");

    let usuarios = getUsuarios();
    const indexUsuario = usuarios.findIndex((u) => u.email === usuario.email);

    if (indexUsuario > -1) {
      if (dadosAtualizados.nome) {
        usuarios[indexUsuario].nome = dadosAtualizados.nome;
      }
      if (dadosAtualizados.senha) {
        usuarios[indexUsuario].senha = dadosAtualizados.senha;
      }
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
    } else {
      throw new Error("Usuário não encontrado.");
    }
  };


  const logout = () => {
    localStorage.removeItem("usuarioLogado");
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}