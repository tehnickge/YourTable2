"use client";
import { RestaurantsPagging } from "@/redux/slices/searchRestaurantSlice/searchRestaurantSlice";
import { IGetRestaurantWithFilter } from "@/types/restaurant";
import { Button, Grid2, MenuItem, Stack } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";

const getRestaurants = async (
  data: IGetRestaurantWithFilter
): Promise<RestaurantsPagging> => {
  try {
    const response = await fetch("/api/restaurant/getAll", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: RestaurantsPagging = await response.json();

    // Проверка структуры ответа
    if (!result.data || !result.totalPages || !result.totalCount) {
      throw new Error("Invalid response structure");
    }

    return result;
  } catch (error) {
    console.error("Failed to fetch restaurants:", error);
    throw error; // или возвращайте значения по умолчанию
  }
};

const RestaurantList = () => {
  const [restaurnats, setRestaurants] = useState<RestaurantsPagging>({
    data: [],
    totalCount: 0,
    totalPages: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRestaurants({
          kitchens: [],
          page: 1,
          pageSize: 20000,
        });
        setRestaurants(data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Grid2 container>
      <Stack spacing={2}>
        {restaurnats.data.map((restaurant) => (
          <MenuItem className="p-6" key={restaurant.id}>
            <Link href={`admin/restaurant/${restaurant.id}`}>
              <Grid2 className="" container spacing={1}>
                <Grid2>#{restaurant.id}</Grid2>
                <Grid2>Название: {restaurant.title}</Grid2>
              </Grid2>
            </Link>
          </MenuItem>
        ))}
      </Stack>
    </Grid2>
  );
};

export default RestaurantList;
