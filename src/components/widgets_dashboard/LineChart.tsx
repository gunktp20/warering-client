import { RxDotsHorizontal } from "react-icons/rx";
import React, { useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ILineChartDashboardProp } from "../../types/widget_dashboard";
import ConfirmDelete from "./ConfirmDeleteWidget";
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function LineChart({
  widget,
  label,
  value,
  widgetId,
  min,
  max,
  fetchAllWidgets,
  selectWidget,
  editMode,
  dashboardId,
  onDeleteSuccess,
}: ILineChartDashboardProp) {
  const [isOptionOpen, setIsOptionOpen] = useState<boolean>(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);
  const [values, setValues] = useState<number[]>([]);
  const [timeStamps, setTimeStamps] = useState<string[]>([]);

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

  function getCurrentTime() {
    const now = new Date();

    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    const timeString = `${formattedMinutes}:${formattedSeconds}`;

    return timeString;
  }

  const data = {
    labels: [...timeStamps],
    datasets: [
      {
        label: "",
        data: [...values],
        backgroundColor: "#1966fb",
        borderColor: "#00000013",
        border: "1px",
        pointBorderColor: "#1966fb",
        fill: true,
        tension: 0.4,
        borderWidth: 1.8,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    animation: {
      duration: 1,
    },
    plugins: {
      legend: {
        display: false,
      },
      scales: {
        y: {
          min: Math.floor(min),
          max: Math.floor(max),
        },
      },
    },
  };

  const pushNumber = (number: number): void => {
    setValues((prevNumbers) => {
      const newNumbers = [...prevNumbers];
      if (newNumbers.length === 6) {
        newNumbers.shift();
      }
      newNumbers.push(number);

      return newNumbers;
    });
    setTimeStamps((prevStamps) => {
      const newStamp = [...prevStamps];
      if (newStamp.length === 6) {
        newStamp.shift();
      }
      newStamp.push(getCurrentTime());

      return newStamp;
    });
  };

  React.useEffect(() => {
    pushNumber(value as number);
  }, [value]);

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
      {...(editMode ? listeners : {})}
      id={widgetId}
      className="h-[130px] w-[100%] bg-white overflow-hidden relative rounded-md shadow-md flex justify-center items-center hover:ring-2"
    >
      <div className="absolute left-2 top-2 text-[#1d4469] text-[12px]">
        {label}
      </div>
      <div
        onClick={() => {
          setIsOptionOpen(!isOptionOpen);
        }}
        id={`${widgetId}-line-chart-dashboard-options`}
        className="absolute right-3 top-2 text-[18px] text-[#7a7a7a] cursor-pointer hover:bg-[#f7f7f7] hover:rounded-md "
      >
        <RxDotsHorizontal />
      </div>
      <div>
        <div className="flex w-[100%] justify-center items-center relative h-[104px] md:w-[200px]">
          <Line data={data} options={options}></Line>
        </div>
      </div>
      {isOptionOpen && (
        <div className="bg-white flex flex-col absolute top-6 right-2 border-[1px] rounded-md shadow-sm">
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

export default LineChart;
