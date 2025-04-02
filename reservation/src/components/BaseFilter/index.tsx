import {
  Checkbox,
  Chip,
  FormControlLabel,
  Grid2,
  Popover,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface BaseFilterProps {
  title: string;
  data: BaseFilterData[];
  filterData: BaseFilterData[];
  changeFIlterData: (data: BaseFilterData) => void;
}

export interface BaseFilterData {
  id: number;
  title: string;
}

const BaseFilter: React.FC<BaseFilterProps> = ({
  title,
  data,
  filterData,
  changeFIlterData,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Grid2 container>
      <Chip
        aria-describedby={id}
        label={title}
        onClick={handleClick}
        sx={{ color: "white" }}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Grid2
          size={12}
          container
          direction="column"
          sx={{
            padding: 1,
            gap: 1,
          }}
        >
          {data.map((item, i) => (
            <FormControlLabel
              key={i}
              sx={{ display: "flex", justifyContent: "space-between", pr: 1 }}
              control={
                <Checkbox
                  id={item.title}
                  checked={filterData.some((data) => data.id === item.id)}
                  onChange={() => changeFIlterData(item)}
                />
              }
              label={item.title}
              labelPlacement="start"
            />
          ))}
        </Grid2>
      </Popover>
    </Grid2>
  );
};

export default BaseFilter;
