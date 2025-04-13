"use client";
import BaseGrid from "@/components/BaseGrid";
import SmallHeader from "@/components/Header/SmallHeader";
import { useLazyGetByRestaurantIdQuery } from "@/redux/slices/searchRestaurantSlice/searchRestaurantAPI";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Button, Grid2, Rating, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Pagination } from "swiper/modules";
import type SwiperCore from "swiper";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";
import { DateTime } from "luxon";

const RestaurantPage = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const [fetchRestaurantById, data] = useLazyGetByRestaurantIdQuery();
  const containerRef = useRef<HTMLDivElement>(null);
  const [swiperInstance, setSwiperInstance] = useState<SwiperCore | null>(null);

  const {
    photos,
    title,
    address,
    averageBill,
    createdAt,
    id,
    info,
    kitchens,
    lastUpdate,
    maxHoursToRent,
    menus,
    rating,
    restaurantChain,
    reviews,
    shortInfo,
    zones,
    workShedules,
  } = useAppSelector((state) => state.restaurant);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!swiperInstance || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const xPos = e.clientX - rect.left;
    const progress = xPos / rect.width;
    const slideIndex = Math.floor(progress * photos.length);

    if (slideIndex !== swiperInstance.activeIndex) {
      swiperInstance.slideTo(slideIndex);
    }
  };

  useEffect(() => {
    if (params && params.id && !isNaN(Number(params.id as string))) {
      fetchRestaurantById(params.id as string);
    }
  }, [params.id, params]);

  const formatWorkShedules = useMemo(() => {
    return workShedules.map((workDay) => ({
      ...workDay,
      timeBegin: DateTime.fromISO(workDay.timeBegin).toFormat("hh:mm"),
      timeEnd: DateTime.fromISO(workDay.timeEnd).toFormat("hh:mm"),
    }));
  }, [workShedules]);

  return (
    <BaseGrid header={<SmallHeader />}>
      <Grid2
        size={12}
        container
        justifyContent="center"
        alignContent="center"
        justifyItems="center"
      >
        <Grid2
          container
          spacing={2}
          size={{ xs: 12, sm: 12, md: 12 }}
          justifyContent="center"
          alignContent="center"
          alignItems="center"
        >
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            style={{
              position: "relative",
              width: "100%",
              justifyContent: "center",
              justifyItems: "center",
              alignContent: "center",
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Grid2 className="z-10 absolute top-2 pt-2 pr-2 pl-2 bg-white rounded-full shadow-slate-600 shadow-sm">
              <Rating
                name="size-medium"
                onChange={(e, a) => {}}
                value={Number(rating)}
                defaultValue={Number(rating)}
                readOnly
              />
            </Grid2>

            <Swiper
              onSwiper={setSwiperInstance}
              modules={[Pagination]}
              pagination={{ clickable: true }}
              spaceBetween={0}
              slidesPerView={1}
              className="relative bg-white w-full rounded-md h-48 sm:h-60 md:h-80 xl:h-96"
            >
              {photos.map((photo, i) => (
                <SwiperSlide key={i}>
                  <Image
                    src={photo}
                    alt={`photo-${i}`}
                    layout="fill"
                    sizes="(max-width: 1200px) 100vw, (max-width: 2200px) 100vw"
                    loading="lazy"
                    objectFit="cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <Typography
            variant="h2"
            sx={{ justifyContent: "center", textAlign: "center" }}
            children={title.toUpperCase()}
          />
        </Grid2>

        <Grid2
          container
          alignContent="center"
          justifyContent="center"
          textAlign="center"
          justifyItems="center"
        >
          <Typography variant="h4" textAlign="center">
            Рассписание
          </Typography>
        </Grid2>

        <Grid2
          size={{ xs: 12, sm: 12, md: 12 }}
          spacing={1}
          container
          justifyContent="space-between"
        >
          {formatWorkShedules.map((workDay, i) => (
            <Grid2
              key={i}
              container
              sx={{
                backgroundColor: "white",
                padding: "16px",
                borderRadius: "0.375rem",
              }}
            >
              <Typography children={workDay.day.title} />
              <Typography>С {workDay.timeBegin}</Typography>
              <Typography>до {workDay.timeEnd}</Typography>
            </Grid2>
          ))}
        </Grid2>

        <Grid2
          container
          alignContent="center"
          justifyContent="center"
          textAlign="center"
          justifyItems="center"
        >
          <Typography variant="h4" textAlign="center">
            Меню
          </Typography>
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 12, md: 12 }} spacing={1} container>
          {menus.map((menu, i) => (
            <Grid2 key={i} container>
              <Image
                src={menu.photo || ""}
                alt={`photo-${i}`}
                width={200}
                height={150}
                loading="lazy"
                objectFit="cover"
              />
              {menu.price}
              {menu.titleDish}
            </Grid2>
          ))}
        </Grid2>

        <Grid2
          container
          alignContent="center"
          justifyContent="center"
          textAlign="center"
          justifyItems="center"
        >
          <Typography variant="h4" textAlign="center">
            Столы
          </Typography>
        </Grid2>

        <Grid2
          size={{ xs: 12, sm: 12, md: 12 }}
          spacing={1}
          container
          justifyContent="center"
        >
          {zones.map((zone, i) => (
            <Grid2
              key={i}
              container
              direction="column"
              justifyContent="center"
              alignContent="center"
              textAlign="center"
              spacing={1}
              padding={2}
            >
              <Typography variant="h5">{zone.title}</Typography>
              <Typography variant="h6">{zone.description}</Typography>

              <Grid2 container spacing={1}>
                {zone.slots.map((slot, i) => (
                  <Grid2
                    key={i}
                    container
                    direction="column"
                    sx={{ backgroundColor: "white" }}
                    spacing={1}
                    borderRadius="0.375rem"
                    padding={1}
                  >
                    <Typography className="text-right text-zinc-400">
                      №{slot.number}
                    </Typography>
                    <Typography>{slot.description}</Typography>
                    <Typography>На {slot.maxCountPeople} персон</Typography>
                    <Button>Забронировать</Button>
                  </Grid2>
                ))}
              </Grid2>
            </Grid2>
          ))}
        </Grid2>
      </Grid2>
    </BaseGrid>
  );
};

export default RestaurantPage;
