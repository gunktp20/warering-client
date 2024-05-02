import { useState } from "react";
import { Id, Task } from "./types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { RxDotsHorizontal } from "react-icons/rx";
import { Box , Slider} from "@mui/material"

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  task: Task;
  isDeleteConfirmOpen: boolean;
  setIsDeleteConfirmOpen: (active: boolean) => void;
  deleteTask?: (id: Id) => void;
  updateTask?: (id: Id, content: string) => void;
}

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

function RangeSlider({ task,isDeleteConfirmOpen , setIsDeleteConfirmOpen }: Props) {
  const [val, setVal] = useState<number>(MIN);
  const [isOptionOpen,setIsOptionOpen] = useState<boolean>(false)
  const handleChange = (_: Event, newValue: number | number[]) => {
    setVal(newValue as number);
  };

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
        opacity-30
      bg-mainBackgroundColor p-2.5 h-[130px] min-h-[100px] items-center flex text-left rounded-xl border-2 border-[#1966fb] cursor-grab relative
      "
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="h-[140px] w-[100%] bg-white relative rounded-md shadow-md flex justify-center items-center hover:ring-2 hover:ring-inset hover:ring-[#1966fb] cursor-grab"
    >
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
        <div className="bg-white flex flex-col absolute top-6 right-2 border-[1px] z-[2] rounded-md shadow-sm">
          <button className="text-[#7a7a7a] text-sm px-8 py-2 hover:bg-[#f7f7f7]">
            Edit
          </button>
          <button onClick={()=>{
            setIsDeleteConfirmOpen(!isDeleteConfirmOpen)
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
      </Box>
    </div>
  );
}

export default RangeSlider;
