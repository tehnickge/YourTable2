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
import { useRegisterMutation } from "@/redux/slices/sessionSlice/sessionAPI";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";

const RegisterPage: React.FC = () => {
  //   username: "nikita12",
  // email: "nikita12@mail.ru",
  // password: "1234",
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [register, { isLoading, error, isSuccess, data }] =
    useRegisterMutation();
  const { username, type } = useAppSelector((state) => state.session);
  const onSubmit = (data: any) => {
    console.log("register data:", data);
    register(data).then((res) => {
      console.log(res);
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
          Регистрация
        </Typography>
        {error && (
          <Typography variant="h5" align="center" color="error">
            ошибка
          </Typography>
        )}
        {isSuccess && (
          <Typography variant="h5" align="center" color="success">
            Пользователь успешно создан {data.username}
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
                  Есть аккаунт?{" "}
                  <Link href="/auth/login" variant="body2">
                    Войти
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
              <Grid2 size={6}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isLoading}
                >
                  {isLoading ? "Регистрация" : "Зарегистрироватся"}
                </Button>
              </Grid2>
            </Grid2>
          </Grid2>
        </form>
      </Container>
    </div>
  );
};

export default RegisterPage;
