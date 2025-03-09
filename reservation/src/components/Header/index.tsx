"use client";
import {
  Autocomplete,
  Button,
  Container,
  Grid2,
  TextField,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/Send";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  MouseEventHandler,
  ReactEventHandler,
  SyntheticEvent,
  useEffect,
} from "react";
import {
  useGetAllMutation,
  useLazyGetAllTitleQuery,
} from "@/redux/slices/searchRestaurantSlice/searchRestaurantAPI";
import { setTitle } from "@/redux/slices/searchRestaurantSlice/searchRestaurantSlice";

const Header = () => {
  const dispatch = useAppDispatch();
  const [getTips] = useLazyGetAllTitleQuery();
  const {
    searchTips,
    title,
    kitchens,
    page,
    pageSize,
    city,
    maxBill,
    minBill,
    minRating,
    totalCount,
    totalPages,
  } = useAppSelector((state) => state.searchRestaurant);
  const [getRestaurants] = useGetAllMutation();

  const changeTextHandler = (
    event: SyntheticEvent<Element, Event>,
    str: string
  ) => {
    dispatch(setTitle(str));
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    getRestaurants({
      kitchens: kitchens,
      page: page,
      pageSize: pageSize,
      city: city,
      maxBill: maxBill,
      minBill: minBill,
      minRating: minRating,
      title: title,
    });
  };
  useEffect(() => {
    getTips();
  }, []);

  return (
    <Grid2
      container
      justifyContent="center"
      alignContent="center"
      alignItems="center"
      textAlign="center"
      width="100%"
      spacing={2}
      height="35vh"
      size={12}
      className="bg-background-gradient p-4 sm:p-4 md:p-8 lg:p-12"
    >
      <Container>
        <Grid2 container size={{ xs: 12 }}>
          <Grid2
            size={{ xs: 10, sm: 11 }}
            justifyContent="center"
            alignContent="center"
            alignItems="center"
            textAlign="center"
          >
            <Autocomplete
              key={searchTips.length}
              freeSolo
              fullWidth
              id="free-solo-2-demo"
              disableClearable
              options={searchTips.map((option) => option.title)}
              onInputChange={changeTextHandler}
              sx={{
                width: "100%",
                backgroundColor: "transparent", // Прозрачный фон
                borderRadius: "8px", // Скругление углов
                "& .MuiAutocomplete-inputRoot": {
                  borderRadius: "8px",
                },
                "& .MuiAutocomplete-popupIndicator": {
                  color: "gray", // Цвет стрелки раскрытия
                },
                "& .MuiAutocomplete-option": {
                  padding: "8px", // Отступы в опциях
                  "&:hover": {
                    backgroundColor: "#f0f0f0", // Цвет фона при наведении
                  },
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search input"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      border: "2px solid white", // Белая обводка
                      borderRadius: "8px", // Скругление углов
                      padding: "8px", // Внутренние отступы
                    },
                    "& .MuiInputLabel-root": {
                      color: "white", // Цвет лейбла
                    },
                    "& .MuiOutlinedInput-root.Mui-focused": {
                      borderColor: "blue", // Цвет обводки при фокусе
                    },
                  }}
                />
              )}
            />
          </Grid2>
          <Grid2
            size={{ xs: 2, sm: 1 }}
            justifyContent="center"
            alignContent="center"
            alignItems="center"
            textAlign="center"
          >
            <Button
              size="medium"
              variant="text"
              onClick={handleClick}
              endIcon={
                <SendRoundedIcon className="min-w-1 text-white rounded-lg" />
              }
              className="min-w-1 h-full rounded-xl "
            />
          </Grid2>
        </Grid2>
      </Container>
    </Grid2>
  );
};

export default Header;
