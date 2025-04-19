import BaseMoal from "@/components/BaseMoal";
import {
  resetModalState,
  setIsOpenModal,
} from "@/redux/slices/restaurantSlice/restaurantSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Grid2 } from "@mui/material";
import { useCallback, useEffect } from "react";

const modalContent = (
  <Grid2
    container
    sx={{
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",
      justifyItems: "center",
    }}
  >
    aboba
  </Grid2>
);

const RentModal = () => {
  const { rentModal } = useAppSelector((state) => state.restaurant);
  const dispatch = useAppDispatch();

  const handleClose = useCallback(() => {
    dispatch(setIsOpenModal());
  }, [rentModal.isOpen]);

  console.log(rentModal);

  useEffect(() => {
    if (!rentModal.isOpen) dispatch(resetModalState());
  }, [rentModal.isOpen, dispatch]);

  return (
    <BaseMoal handleClose={handleClose} isOpen={rentModal.isOpen}>
      {modalContent}
    </BaseMoal>
  );
};

export default RentModal;
