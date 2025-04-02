"use client";
import {
  Autocomplete,
  Button,
  Container,
  Grid2,
  TextField,
  Typography,
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
  useLazyGetAllCitiesQuery,
  useLazyGetAllKitchensQuery,
  useLazyGetAllTitleQuery,
} from "@/redux/slices/searchRestaurantSlice/searchRestaurantAPI";
import {
  appendKitchen,
  popKitchen,
  setCity,
  setTitle,
} from "@/redux/slices/searchRestaurantSlice/searchRestaurantSlice";
import BaseFilter, { BaseFilterData } from "../BaseFilter";
import BaseRadioFilter from "../BaseRadioFIlter";

import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import AppRegistrationRoundedIcon from "@mui/icons-material/AppRegistrationRounded";
import { useRouter } from "next/navigation";
import { UserTypes } from "@/types/user";

const Header = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [getTips] = useLazyGetAllTitleQuery();
  const [getKitchens] = useLazyGetAllKitchensQuery();
  const [getRestaurants] = useGetAllMutation();
  const [getCities] = useLazyGetAllCitiesQuery();
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
    allKitchens,
    allCities,
  } = useAppSelector((state) => state.searchRestaurant);
  const { id, type } = useAppSelector((state) => state.session);

  const changeTextHandler = (
    event: SyntheticEvent<Element, Event>,
    str: string
  ) => {
    dispatch(setTitle(str));
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    getRestaurants({
      kitchens: kitchens.map((kitchen) => kitchen.title),
      page: 1,
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
    getKitchens();
    getCities();
  }, []);

  const changeFIlterKitchen = (data: BaseFilterData) => {
    if (!kitchens.some((kitchen) => kitchen.id === data.id)) {
      dispatch(appendKitchen(data));
    } else {
      dispatch(popKitchen(data));
    }
  };

  const changeFilterCities = (data: string) => {
    dispatch(setCity(data));
  };

  const profileButtonHandler = () => {
    router.push(`/user/${id}`);
  };

  const registerButtonHandler = () => {
    router.push("/auth/register");
  };

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
          {type === UserTypes.unauthorized ? (
            <Grid2>
              <Button
                variant="contained"
                sx={{
                  color: "white",
                  backgroundColor: "transparent",
                  boxShadow: 0,
                  "&:hover": { boxShadow: 0 },
                  "&:disabled": { backgroundColor: "transparent" },
                }}
                onClick={registerButtonHandler}
                startIcon={<AppRegistrationRoundedIcon />}
              >
                signin
              </Button>
            </Grid2>
          ) : (
            <Grid2>
              <Button
                variant="contained"
                sx={{
                  color: "white",
                  backgroundColor: "transparent",
                  boxShadow: 0,
                  "&:hover": { boxShadow: 0 },
                  "&:disabled": { backgroundColor: "transparent" },
                }}
                disabled={type === UserTypes.unauthorized}
                onClick={profileButtonHandler}
                startIcon={<AccountBoxRoundedIcon />}
              >
                profile
              </Button>
            </Grid2>
          )}
        </Grid2>
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
                backgroundColor: "transparent",
                borderRadius: "12px",
                "& .MuiAutocomplete-inputRoot": {
                  color: "white", // Белый текст
                  borderRadius: "12px",
                  padding: "8px", // Вернул исходный padding
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white", // Белая обводка всегда
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white", // Белая обводка при hover
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white", // Белая обводка при focus
                  },
                },
                "& .MuiAutocomplete-popupIndicator": {
                  color: "white", // Белый цвет иконки
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                },
                "& .MuiAutocomplete-clearIndicator": {
                  color: "white", // Белый цвет иконки очистки
                },
                "& .MuiAutocomplete-option": {
                  color: "black", // Цвет текста в выпадающем списке
                  padding: "8px", // Оставил отступы в списке
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Поиск..."
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "white", // Белый текст
                      padding: "8px", // Вернул исходный padding
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white", // Белая обводка всегда
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white", // Белая обводка при hover
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "white", // Белая обводка при focus
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "white", // Белый цвет лейбла
                    },
                    "& .MuiInputBase-input": {
                      color: "white", // Белый цвет введенного текста
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
          <Grid2
            size={{ xs: 12 }}
            container
            justifyContent="center"
            alignContent="center"
            alignItems="center"
            spacing={2}
            sx={{ mt: "12px" }}
          >
            <BaseFilter
              changeFIlterData={changeFIlterKitchen}
              data={allKitchens}
              filterData={kitchens}
              title="Кухни"
            />
            <BaseRadioFilter
              changeFIlterData={changeFilterCities}
              data={allCities}
              filterData={city}
              title="Город"
            />
          </Grid2>
        </Grid2>
      </Container>
    </Grid2>
  );
};

export default Header;
