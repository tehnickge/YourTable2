import {
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  Grid2,
  Popover,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface BaseFilterProps {
  title: string;
  data: string[];
  filterData: string | null;
  changeFIlterData: (data: string) => void;
}

export interface BaseFilterData {
  id: number;
  title: string;
}

const BaseRadioFilter: React.FC<BaseFilterProps> = ({
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
        sx={{ color: "white" }}
        onClick={handleClick}
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
          <FormControl>
            <RadioGroup aria-labelledby="form-control-city" name="position">
              {data.map((item, i) => (
                <FormControlLabel
                  key={i}
                  sx={{ justifyContent: "space-between", pr: 1 }}
                  labelPlacement="start"
                  value={item}
                  control={<Radio />}
                  label={item}
                  checked={item === filterData}
                  onClick={() => changeFIlterData(item)}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Grid2>
      </Popover>
    </Grid2>
  );
};

export default BaseRadioFilter;
