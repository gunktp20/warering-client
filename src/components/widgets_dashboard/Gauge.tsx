import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { RxDotsHorizontal } from "react-icons/rx";
import { useSortable } from "@dnd-kit/sortable";
import { IGaugeDashboardProp } from "../../types/widget_dashboard";
import { CSS } from "@dnd-kit/utilities";
import ConfirmDelete from "./ConfirmDeleteWidget";

export type Id = string | number;

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  // Disable tooltips
  tooltips: {
    enabled: false // Disable tooltips
  },
  plugins: {
    tooltip: {
      enabled: false // Disable tooltips (for Chart.js v3 and above)
    }
  }
};

function Gauge({
  widget,
  label,
  value,
  min,
  max,
  unit,
  widgetId,
  fetchAllWidgets,
  selectWidget,
  editMode,
  dashboardId,
  onDeleteSuccess,
}: IGaugeDashboardProp) {
  const [isOptionOpen, setIsOptionOpen] = useState<boolean>(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);
  const sum = Number(max) + Number(min);
  const newValue = Number(value) + Number(min);
  const result = Math.round((100 * newValue) / sum);
  const firstNum = result;
  const secondNum = 100 - result;

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: widget.id,
    data: {
      type: "Task",
      widget,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    cursor: editMode ? "grab" : "default",
  };

  const data = {
    labels: [],
    datasets: [
      {
        label: "doughnut",
        data: [firstNum, secondNum],
        backgroundColor: ["#1966fb", "#00000045"],
        borderColor: ["#fff", "#fff"],
        circumference: 180,
        rotation: 270,
        borderWidth: 0,
        cutout: "84%",
      },
    ],
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
        opacity-30
      bg-mainBackgroundColor p-2.5 h-[150px] min-h-[100px] items-center flex text-left rounded-xl border-2 border-[#1966fb] cursor-grab relative
      "
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(editMode ? listeners : {})}
      id={widgetId}
      className="h-[150px] w-[100%] bg-white relative rounded-md shadow-md flex justify-center items-center hover:ring-2 overflow-hidden"
    >
      {!value && (
        <div className="w-[100%] h-[100%] bg-white z-10 flex absolute justify-center items-center font-bold text-[#0075ff]">
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
        id={`${widgetId}-gauge-dashboard-options`}
        className="z-20 absolute right-3 top-2 text-[18px] text-[#7a7a7a] cursor-pointer hover:bg-[#f7f7f7] hover:rounded-md "
      >
        <RxDotsHorizontal />
      </div>
      {isOptionOpen && (
        <div className="z-30 bg-white flex flex-col absolute top-6 right-2 border-[1px] rounded-md shadow-sm">
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
      <div className="w-[100px]">
        <Doughnut data={data} options={options}></Doughnut>
      </div>
      <div className="w-[100px] text-[#1966fb] absolute text-center bottom-7 text-[12.8px]">
        {(typeof value === "string" || typeof value === "number") ? value : ""} {unit}
      </div>
      <ConfirmDelete
        widgetId={widgetId}
        isDeleteConfirmOpen={isDeleteConfirmOpen}
        setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
        fetchAllWidgets={fetchAllWidgets}
        dashboardId={dashboardId}
        onDeleteSuccess={onDeleteSuccess}
      />
    </div>
  );
}

export default Gauge;
