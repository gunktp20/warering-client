import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useState } from "react";
import { RxDotsHorizontal } from "react-icons/rx";
import { IGaugeDashboardProp } from "../../types/widget_dashboard";
import ConfirmDelete from "./ConfirmDeleteWidget";
import { motion } from "framer-motion";
import DropIndicator from "../../pages/Dashboard/DropIndicator";
import { useAppSelector } from "../../app/hooks";
import canConvertToNumber from "../../utils/canConvertToNumber";
import ProgressBar from "../widgets_device/ProgressBar";

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
  dashboardId,
  onDeleteSuccess,
  handleDragStart,
  column,
}: IGaugeDashboardProp) {
  const [isOptionOpen, setIsOptionOpen] = useState<boolean>(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);
  const { editMode } = useAppSelector((state) => state.dashboard)
  return (
    <div className="mt-5">
      <DropIndicator beforeId={widgetId} column={column ? column : "column-1"} />
      <motion.div
        draggable={editMode}
        onDragStart={(e) => {
          if (!editMode) {
            return;
          }
          handleDragStart(e, { id: widgetId, column: column ? column : "column-1" })
        }}
        className={`bg-white h-[150px] ${editMode ? "cursor-grab active:cursor-grabbing" : ""} relative rounded-md shadow-md flex justify-center items-center hover:ring-2 overflow-hidden`}
      >
        {((!value && value !== 0) || !canConvertToNumber((typeof value === "string" || typeof value === "number") ? value : "")) && (
          <div className="w-[100%] h-[100%] bg-white z-10 flex absolute justify-center items-center font-bold text-[#0075ff]">
            IDLE
          </div>
        )}
        <div className="z-[10] absolute left-2 top-2 text-[#1d4469] text-[12px]">
          {label}
        </div>
        <div
          onClick={() => {
            setIsOptionOpen(!isOptionOpen);
          }}
          id={`${widgetId}-button-control-dashboard-options`}
          className="z-[10] absolute right-3 top-2 text-[18px] text-[#7a7a7a] cursor-pointer hover:bg-[#f7f7f7] hover:rounded-md "
        >
          <RxDotsHorizontal />
        </div>
        {isOptionOpen && (
          <div className="z-[10] bg-white flex flex-col absolute top-6 right-2 border-[1px] rounded-md shadow-sm">
            <button
              onClick={() => {
                selectWidget(widgetId);
                setIsOptionOpen(false);
              }}
              className="text-[#7a7a7a] text-sm px-8 py-2 hover:bg-[#f7f7f7]"
            >
              Edit
            </button>
            <button
              onClick={() => {
                setIsDeleteConfirmOpen(!isDeleteConfirmOpen);
              }}
              className="text-[#7a7a7a] text-sm px-8 py-2 hover:bg-[#f7f7f7]"
            >
              Delete
            </button>
          </div>
        )}
        {(value || value === 0) && canConvertToNumber((typeof value === "string" || typeof value === "number") ? value : "") && <div>
          <ProgressBar id={widgetId} value={(typeof value === "number" || typeof value === "string") ? Number(value) : min} min={min} max={max} />
        </div>}
        {(value || value === 0) && canConvertToNumber((typeof value === "string" || typeof value === "number") ? value : "") && <div className="w-[100px] text-[#1966fb] absolute text-center top-[6rem] text-[12.8px]">
          {(typeof value === "number" || typeof value === "string") ? value : "val"} {unit}
        </div>}

        {/* Widget content */}
        <ConfirmDelete
          widgetId={widgetId}
          isDeleteConfirmOpen={isDeleteConfirmOpen}
          setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
          fetchAllWidgets={fetchAllWidgets}
          dashboardId={dashboardId}
          onDeleteSuccess={onDeleteSuccess}
        />
      </motion.div >
    </div>
  );
}

export default Gauge;
