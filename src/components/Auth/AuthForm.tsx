import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebase.ts";
import styles from "./Auth.module.scss";

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
    <div className={styles.authFromWrapper}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>{isRegister ? "SIGN UP" : "SIGN IN"}</h2>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        {error && (
          <p className={styles.errorText}>Ops, something went wrong!</p>
        )}
        <button className={styles.authButton} type="submit">
          {isRegister ? "Sign up" : "Sign in"}
        </button>
        <button
          className={styles.questionButton}
          type="button"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister ? "Do you already have an account?" : "No account?"}
        </button>
      </form>
    </div>
  );
};
