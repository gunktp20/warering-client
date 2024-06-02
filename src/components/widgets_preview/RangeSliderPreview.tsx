import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import React from "react";
import { IRangeSliderPreviewProp } from "./types";

const MAX = 10;
const MIN = 0;
const marks = [
  {
    value: MIN,
    label: "",
  },
  {
    value: MAX,
    label: "",
  },
];

const CustomSliderStyles = {
  "& .MuiSlider-thumb": {
    color: "#1966fb",
  },
  "& .MuiSlider-track": {
    color: "#1966fb",
    height: 8,
  },
  "& .MuiSlider-rail": {
    color: "#8cb3fd",
    height: 8,
  },
  "& .MuiSlider-active": {},
};

export default function RangeSliderPreview(props: IRangeSliderPreviewProp) {
  const [val, setVal] = React.useState<number>(5);
  const handleChange = (_: Event, newValue: number | number[]) => {
    setVal(newValue as number);
  };

  return (
    <div className="h-[130px] w-[100%] bg-white relative rounded-md shadow-md flex justify-center items-center ">
      <div className="absolute left-2 top-2 text-[#1d4469] text-sm">
        {props.label}
      </div>
      <Box sx={{ width: "100%", paddingLeft: "2rem", paddingRight: "2rem" }}>
        <Slider
          marks={marks}
          step={1}
          value={val}
          valueLabelDisplay="auto"
          min={MIN}
          max={MAX}
          disabled={true}
          onChange={handleChange}
          sx={CustomSliderStyles}
        />
      </Box>
    </div>
  );
}
