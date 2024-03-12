import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import React from "react";

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

interface IProp {
    label: string;
  }

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
  
//   function MessageBoxPreview({ label, value, unit }: IProp) {
//     return (
//       <div className="h-[130px] w-[100%] bg-white relative rounded-md shadow-md flex justify-center items-center ">
//         <div className="absolute left-2 top-2 text-[#1d4469] text-sm">
//           {label}
//         </div>
//         <div className="text-[#1966fb] text-[19px] font-bold">
//         <div className="text-[11px] font-medium text-[#5353538a] text-right">{unit}</div>{value} 
//         </div>
//       </div>
//     );
//   }

  export default function RangeSliderPreview(props:IProp) {
    const [val, setVal] = React.useState<number>(5);
    const handleChange = (_: Event, newValue: number | number[]) => {
      setVal(newValue as number);
    };
  
    return (
      <div className="h-[130px] w-[100%] bg-white relative rounded-md shadow-md flex justify-center items-center ">
        <div className="absolute left-2 top-2 text-[#1d4469] text-sm">
          {props.label}
        </div>
        <Box sx={{ width: "100%", paddingLeft:"2rem",paddingRight:"2rem"}}>
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
  
//   export default MessageBoxPreview;
  