"use client";
import React, { useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Link,
  Grid2,
  Box,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import { useLoginMutation } from "@/redux/slices/sessionSlice/sessionAPI";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import { useLazyGetUserQuery } from "@/redux/slices/userSlice/userApi";

const LoginPage: React.FC = () => {
  //   username: "nikita12",
  // email: "nikita12@mail.ru",
  // password: "1234",
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [login, { isLoading, error, isSuccess, data }] = useLoginMutation();
  const [getUser] = useLazyGetUserQuery();
  const { username, type } = useAppSelector((state) => state.session);
  const onSubmit = (data: any) => {
    login(data).then((res) => {
      getUser(res.data?.id.toString() || "");
    });
  };

  useEffect(() => {
    if (isSuccess) {
      router.push("/");
    }
  }, [isSuccess]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Container maxWidth="xs" className="bg-gray-100 rounded-3xl p-10">
        <Typography variant="h4" align="center" marginBottom="1.5rem">
          Вход
        </Typography>
        {error && (
          <Typography variant="h5" align="center" color="error">
            ошибка
          </Typography>
        )}
        {isSuccess && (
          <Typography variant="h5" align="center" color="success">
            Успешный вход {data.username}
          </Typography>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid2 container spacing={2}>
            {/* Поле для имени юзера */}
            <Grid2 size={12}>
              <Box display="flex" alignItems="center" gap={2}>
                <EmailOutlinedIcon
                  sx={{
                    fill: "rgb(0 0 0 / 50%)",
                  }}
                />
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Электронная почта обязательна",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Неверный формат электронной почты",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Электронная почта"
                      variant="outlined"
                      fullWidth
                      error={!!errors.email}
                      helperText={
                        errors.email ? (errors.email.message as string) : ""
                      }
                    />
                  )}
                />
              </Box>
            </Grid2>
            {/* Поле для имени юзера */}
            <Grid2 size={12}>
              <Box display="flex" alignItems="center" gap={2}>
                <PermIdentityOutlinedIcon
                  sx={{
                    fill: "rgb(0 0 0 / 50%)",
                  }}
                />
                <Controller
                  name="username"
                  control={control}
                  rules={{
                    required: "имя обязательный параметр",
                    min: 4,
                    max: 15,
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Имя пользователя"
                      variant="outlined"
                      fullWidth
                      error={!!errors.username}
                      helperText={
                        errors.username
                          ? (errors.username.message as string)
                          : ""
                      }
                    />
                  )}
                />
              </Box>
            </Grid2>

            {/* Поле для пароля */}
            <Grid2 size={12}>
              <Box display="flex" alignItems="center" gap={2}>
                <KeyOutlinedIcon
                  sx={{
                    fill: "rgb(0 0 0 / 50%)",
                  }}
                />
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: "Пароль обязателен",
                    minLength: {
                      value: 4,
                      message: "Пароль должен быть не менее 6 символов",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Пароль"
                      variant="outlined"
                      type="password"
                      fullWidth
                      error={!!errors.password}
                      helperText={
                        errors.password
                          ? (errors.password.message as string)
                          : ""
                      }
                    />
                  )}
                />
              </Box>
            </Grid2>

            {/* Ссылка на страницу регистрации */}
            <Grid2
              container
              size={12}
              className={"items-center text-center justify-center"}
            >
              <Grid2>
                <Typography variant="body2" align="center">
                  Нет аккаунта?{" "}
                  <Link href="/auth/register" variant="body2">
                    Зарегистрироваться
                  </Link>
                </Typography>
              </Grid2>
            </Grid2>

            {/* Кнопка отправки формы */}
            <Grid2
              container
              size={12}
              className={"items-center text-center justify-center"}
            >
              <Grid2 size={5}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isLoading}
                >
                  {isLoading ? "Вход..." : "Войти"}
                </Button>
              </Grid2>
            </Grid2>
          </Grid2>
        </form>
      </Container>
    </div>
  );
};

export default LoginPage;
