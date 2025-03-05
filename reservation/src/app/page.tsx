"use client";

import BaseGrid from "@/components/BaseGrid";
import { useLoginMutation } from "@/redux/slices/sessionSlice/sessionAPI";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { UserTypes } from "@/types/user";

export default function Home() {
  const [login] = useLoginMutation();
  const { username, type } = useAppSelector((state) => state.session);
  console.log(username, type);

  const handleLogin = async () => {
    try {
      const userData = {
        username: "nikita12",
        email: "nikita12@mail.ru",
        password: "1234",
      };
      await login(userData);
    } catch (error) {
      console.error("Ошибка авторизации", error);
    }
  };

  const baseData = [
    { data: "TEST", id: 1 },
    { data: "TEST", id: 2 },
    { data: "TEST", id: 2 },
  ];

  return (
    <BaseGrid header={<div className="">test</div>}>
      {baseData.map((d) => (
        <div>
          <div>{d.id}</div>
          <div>{d.data}</div>
        </div>
      ))}
    </BaseGrid>
  );
}
