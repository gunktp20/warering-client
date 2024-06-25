import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useState } from "react";
import { RxDotsHorizontal } from "react-icons/rx";
import { IGaugeDeviceProp } from "../../types/widget_device";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import { useAppDispatch } from "../../app/hooks";
import { setSelectedWidgets } from "../../features/widget/widgetSlice";
import canConvertToNumber from "../../utils/canConvertToNumber";
import ProgressBar from "./ProgressBar";

export type Id = string | number;

ChartJS.register(ArcElement, Tooltip, Legend);

function Gauge({
  label,
  value,
  min,
  max,
  unit,
  widgetId,
  fetchAllWidgets,
  selectWidget,
}: IGaugeDeviceProp) {
  const dispatch = useAppDispatch()
  const [isOptionOpen, setIsOptionOpen] = useState<boolean>(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);

  return (
    <div id={widgetId} className="h-[150px] w-[100%] bg-white relative rounded-md shadow-md flex justify-center items-center hover:ring-2 overflow-hidden">
      {((!value && value !== 0) || !canConvertToNumber(value)) && (
        <div className=" bg-white z-10 flex absolute justify-center items-center font-bold text-[#0075ff]">
          IDLE
        </div>
      )}
      <div className="z-30 absolute left-2 top-2 text-[#1d4469] text-[12px]">
        {label}
      </div>
      <div
        onClick={() => {
          setIsOptionOpen(!isOptionOpen);
        }}
        id={`${widgetId}-gauge-device-options`}
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
      {(value || value === 0) && canConvertToNumber(value) && <div>
        <ProgressBar id={widgetId} value={(typeof value === "number" || typeof value === "string") ? Number(value) : min} min={min} max={max} />
      </div>}
      {(value || value === 0) && canConvertToNumber(value) && <div className="w-[100px] text-[#1966fb] absolute text-center top-[6rem] text-[12.8px]">
        {value} {unit}
      </div>}
      <DeleteConfirmDialog
        isDeleteConfirmOpen={isDeleteConfirmOpen}
        setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
        fetchAllWidgets={fetchAllWidgets}
      />
    </div>
  );
}

export default Gauge;
