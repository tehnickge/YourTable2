import { Box, Modal, Typography } from "@mui/material";
import { ReactNode, useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  outline: "none",
};

interface BaseMoalProps {
  children: ReactNode;
  isOpen: boolean;
  handleClose: () => void;
}

const BaseMoal: React.FC<BaseMoalProps> = ({
  children,
  isOpen,
  handleClose,
}) => {
  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ outline: "none", border: 0 }}
    >
      <Box sx={style}>{children}</Box>
    </Modal>
  );
};

export default BaseMoal;
