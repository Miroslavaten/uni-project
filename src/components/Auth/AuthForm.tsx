import React, { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import {auth} from "../../firebase.ts";


export const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{isRegister ? "Регистрация" : "Вход"}</h2>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" />
      {error && <p>{error}</p>}
      <button type="submit">{isRegister ? "Зарегистрироваться" : "Войти"}</button>
      <button type="button" onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? "Уже есть аккаунт?" : "Нет аккаунта?"}
      </button>
    </form>
  );
};
