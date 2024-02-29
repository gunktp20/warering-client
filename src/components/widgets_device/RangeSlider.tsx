import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import { RxDotsHorizontal } from "react-icons/rx";

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
    '& .MuiSlider-thumb': {
        color: "#1966fb"
    },
    '& .MuiSlider-track': {
        color: "#1966fb",
        height: 8,
    },
    '& .MuiSlider-rail': {
        color: "#8cb3fd",
        height: 8,
    },
    '& .MuiSlider-active': {
        
    }
}

interface IProp {
    isDeleteConfirmOpen:boolean;
    setIsDeleteConfirmOpen:(active:boolean)=>void
}

export default function RangeSlider(props:IProp) {
  const [val, setVal] = React.useState<number>(MIN);
  const [isOptionOpen,setIsOptionOpen] = React.useState<boolean>(false)
  const handleChange = (_: Event, newValue: number | number[]) => {
    setVal(newValue as number);
  };

  return (
    <div className="h-[130px] w-[100%] bg-white relative rounded-md shadow-md flex justify-center items-center ">
      <div className="absolute left-2 top-2 text-[#1d4469] text-sm">
        Range Slider
      </div>
      <div
        onClick={() => {
          setIsOptionOpen(!isOptionOpen);
        }}
        className="absolute right-3 top-2 text-[18px] text-[#7a7a7a] cursor-pointer hover:bg-[#f7f7f7] hover:rounded-md "
      >
        <RxDotsHorizontal />
      </div>
      {isOptionOpen && (
        <div className="bg-white flex flex-col absolute top-6 right-2 border-[1px] rounded-md shadow-sm">
          <button className="text-[#7a7a7a] text-sm px-8 py-2 hover:bg-[#f7f7f7]">
            Edit
          </button>
          <button onClick={()=>{
            props.setIsDeleteConfirmOpen(!props.isDeleteConfirmOpen)
          }} className="text-[#7a7a7a] text-sm px-8 py-2 hover:bg-[#f7f7f7]">
            Delete
          </button>
        </div>
      )}
      <Box sx={{ width: "100%", paddingLeft:"2rem",paddingRight:"2rem"}}>
      <Slider
        marks={marks}
        step={1}
        value={val}
        valueLabelDisplay="auto"
        min={MIN}
        max={MAX}
        onChange={handleChange}
        sx={CustomSliderStyles}
      />
      {/* <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          variant="body2"
          onClick={() => setVal(MIN)}
          sx={{ cursor: 'pointer' }}
        >
          {MIN} min
        </Typography>
        <Typography
          variant="body2"
          onClick={() => setVal(MAX)}
          sx={{ cursor: 'pointer' }}
        >
          {MAX} max
        </Typography>
      </Box> */}
    </Box>
    </div>
  );
}
