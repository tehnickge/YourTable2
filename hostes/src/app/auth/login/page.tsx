"use client";
import { useLazyLoginQuery } from "@/redux/slice/session/api";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import React, { useEffect, useState } from "react";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const { type, login: log } = useAppSelector((state) => state.session);
  const [fetchLogin, { isSuccess, data }] = useLazyLoginQuery();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    fetchLogin({ login: login, password: password });
  };

  useEffect(() => {
    if (isSuccess) {
      console.log(data);
    }
  }, [isSuccess]);

  console.log(log, type);
  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "2rem" }}>
      <h2>Вход</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="login">Лог:</label>
          <input
            id="login"
            type="text"
            value={login}
            onChange={(e) => setLogin((prev) => e.target.value)}
            required
            className="w-full mb-10 text-black p-1"
          />
        </div>
        <div>
          <label htmlFor="password">Пароль:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword((prev) => e.target.value)}
            required
            className="w-full mb-2 text-black p-1"
          />
        </div>
        {error && (
          <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
        )}
        <button type="submit" style={{ width: "100%" }}>
          Войти
        </button>
      </form>
    </div>
  );
}
