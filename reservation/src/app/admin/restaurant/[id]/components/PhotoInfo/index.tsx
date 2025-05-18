import { AdminRestaurant } from "@/types/restaurant";
import { Button, Container, Grid, Typography } from "@mui/material";
import Image from "next/image";
import ClearIcon from "@mui/icons-material/Clear";
import { useRef, useState } from "react";
import {
  useDeleteRestaurantPhotoMutation,
  useUpdateRestaurantPhotosMutation,
} from "@/redux/slices/adminSlice/adminAPI";

interface PhotoRestaurantInfoProps {
  restaurant?: AdminRestaurant;
}

const PhotoRestaurantInfo: React.FC<PhotoRestaurantInfoProps> = ({
  restaurant,
}) => {
  const [updatePhotos] = useUpdateRestaurantPhotosMutation();
  const [deletePhoto] = useDeleteRestaurantPhotoMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!restaurant) return null;

  const handleUpdatePhotos = async (files: FileList | null) => {
    if (!files || files.length === 0 || !restaurant) return;

    setIsLoading(true);
    try {
      const formData = new FormData();

      // Добавляем файлы (ключ "photo" как ожидает сервер)
      Array.from(files).forEach((file) => {
        formData.append("photo", file);
      });

      // Добавляем ID ресторана (ключ "restaurantId" как ожидает сервер)
      formData.append("restaurantId", restaurant.id.toString());

      await updatePhotos(formData).unwrap();

      // Обновляем данные после успешной загрузки
      // refetch() или обновление состояния
    } catch (error) {
      console.error("Ошибка обновления фото:", error);
      // Показываем ошибку пользователю
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePhoto = async (photoUrl: string) => {
    if (!restaurant) return;

    try {
      await deletePhoto({
        restaurantId: restaurant.id,
        photoUrl: photoUrl,
      }).unwrap();
      // Можно добавить уведомление об успехе
    } catch (error) {
      console.error("Ошибка удаления фото:", error);
      // Показываем пользователю понятную ошибку
    }
  };

  return (
    <Container maxWidth="sm">
      <Grid container spacing={2}>
        <Typography variant="h6" gutterBottom>
          Фотографии ресторана
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          {restaurant.photos.map((photo, i) => (
            <Grid item key={i} sx={{ position: "relative" }}>
              <div className="relative group">
                <Image
                  alt={`Фото ресторана ${i + 1}`}
                  src={photo}
                  height={150}
                  width={150}
                  className="rounded"
                  style={{ objectFit: "cover" }}
                />
                <Button
                  onClick={() => handleDeletePhoto(photo)}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    minWidth: 0,
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    bgcolor: "rgba(0,0,0,0.5)",
                    color: "white",
                    "&:hover": {
                      bgcolor: "rgba(0,0,0,0.7)",
                    },
                  }}
                >
                  <ClearIcon fontSize="small" />
                </Button>
              </div>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={2}>
          <Grid item>
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/jpeg,image/png"
              onChange={(e) => handleUpdatePhotos(e.target.files)}
              style={{ display: "none" }}
            />
            <Button
              variant="contained"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              {isLoading ? "Загрузка..." : "Обновить фотографии"}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PhotoRestaurantInfo;
