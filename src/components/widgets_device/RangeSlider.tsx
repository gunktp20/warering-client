import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { RxDotsHorizontal } from "react-icons/rx";
import { IRangeSliderDeviceProp } from "../../types/widget_device";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import { useAppDispatch } from "../../app/hooks";
import { setSelectedWidgets } from "../../features/widget/widgetSlice";

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

function RangeSlider({
  label,
  min,
  max,
  widgetId,
  value,
  fetchAllWidgets,
  publishMQTT,
  selectWidget
}: IRangeSliderDeviceProp) {
  const [val, setVal] = React.useState<number>(min);
  const dispatch = useAppDispatch()
  const handleChange = (_: Event, newValue: number | number[]) => {
    setVal(newValue as number);
  };
  const [isOptionOpen, setIsOptionOpen] = React.useState<boolean>(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    React.useState<boolean>(false);

    console.log('Range slider')
  return (
    <div id={widgetId} className="h-[150px] w-[100%] bg-white relative rounded-md shadow-md flex justify-center items-center hover:ring-2">
      <div className="absolute left-2 top-2 text-[#1d4469] text-[12px]">
        {label}
      </div>
      <div
        onClick={() => {
          setIsOptionOpen(!isOptionOpen);
        }}
        id={`${widgetId}-range-slider-device-options`}
        className="z-20 absolute right-3 top-2 text-[18px] text-[#7a7a7a] cursor-pointer hover:bg-[#f7f7f7] hover:rounded-md "
      >
        <RxDotsHorizontal />
      </div>
      {isOptionOpen && (
        <div className="z-30 bg-white flex flex-col absolute top-6 right-2 border-[1px] rounded-md shadow-sm">
          <button
            onClick={() => {
              selectWidget(widgetId)
              setIsOptionOpen(false);
            }}
            className="text-[#7a7a7a] text-sm px-8 py-2 hover:bg-[#f7f7f7]"
          >
            Edit
          </button>
          <button
            onClick={() => {
              dispatch(setSelectedWidgets(widgetId))
              setIsDeleteConfirmOpen(!isDeleteConfirmOpen);
            }}
            className="text-[#7a7a7a] text-sm px-8 py-2 hover:bg-[#f7f7f7]"
          >
            Delete
          </button>
        </div>
      )}
      <Box sx={{ width: "100%", paddingLeft: "2rem", paddingRight: "2rem" }}>
        <Slider
          onChangeCommitted={() => {
            const payload = {
              [value]: val,
            };
            publishMQTT(JSON.stringify(payload));
          }}
          step={1}
          value={val}
          valueLabelDisplay="auto"
          min={min}
          max={max}
          onChange={handleChange}
          sx={CustomSliderStyles}
        />
      </Box>
      <DeleteConfirmDialog
        isDeleteConfirmOpen={isDeleteConfirmOpen}
        setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
        fetchAllWidgets={fetchAllWidgets}
      />
    </div>
  );
}

export default React.memo(RangeSlider)

