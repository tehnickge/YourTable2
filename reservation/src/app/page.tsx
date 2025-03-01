"use client";


import { useLoginMutation } from "@/redux/slices/sessionSlice/sessionAPI";
import { useAppDispatch, useAppSelector } from "@/redux/store";

export default function Home() {
  const [login, ] = useLoginMutation();
  const {username, type} = useAppSelector(state => state.session);
  console.log(username, type);

  
  const handleLogin = async () => {
    try {
      const userData = { username: "nikita123", email: "nikita123@mail.ru", password: "1234" };
      await login(userData);
    } catch (error) {
      console.error("Ошибка авторизации", error);
    }
  };

  return <button onClick={handleLogin}>Войти</button>;
}
