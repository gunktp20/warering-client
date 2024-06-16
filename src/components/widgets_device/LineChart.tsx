import { RxDotsHorizontal } from "react-icons/rx";
import { useState } from "react";
import * as React from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { ILineChartDeviceProp } from "../../types/widget_device";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import { useAppDispatch } from "../../app/hooks";
import { setSelectedWidgets } from "../../features/widget/widgetSlice";
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function LineChart({
  label,
  value,
  widgetId,
  min,
  max,
  fetchAllWidgets,
  selectWidget
}: ILineChartDeviceProp) {
  const dispatch = useAppDispatch()
  const [isOptionOpen, setIsOptionOpen] = useState<boolean>(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);
  const [values, setValues] = useState<number[]>([]);
  const [timeStamps, setTimeStamps] = useState<string[]>([]);

  function getCurrentTime() {
    // Create a new Date object to get the current time
    const now = new Date();

    // Get the current minutes and seconds
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Format the minutes and seconds to be two digits (e.g., 02 instead of 2)
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    // Combine the formatted minutes and seconds into a single string
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
      // Create a new array based on the previous state
      const newNumbers = [...prevNumbers];

      // Check if the array length is equal to 7
      if (newNumbers.length === 6) {
        // Remove the first element from the array (index 0)
        newNumbers.shift();
      }

      // Push the new number to the end of the array
      newNumbers.push(number);

      // Return the new array state
      return newNumbers;
    });
    setTimeStamps((prevStamps) => {
      // Create a new array based on the previous state

      const newStamp = [...prevStamps];

      // Check if the array length is equal to 6
      if (newStamp.length === 6) {
        // Remove the first element from the array (index 0)
        newStamp.shift();
      }

      // Push the new number to the end of the array
      newStamp.push(getCurrentTime());

      // Return the new array state
      return newStamp;
    });
  };

  React.useEffect(() => {
    pushNumber(value as number);
  }, [value]);

  return (
    <div id={widgetId} className="h-[150px] w-[100%] bg-white relative rounded-md shadow-md flex justify-center items-center hover:ring-2">
      <div className="absolute left-2 top-2 text-[#1d4469] text-[12px]">
        {label}
      </div>
      <div
        onClick={() => {
          setIsOptionOpen(!isOptionOpen);
        }}
        id={`${widgetId}-line-chart-device-options`}
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
      <DeleteConfirmDialog
        isDeleteConfirmOpen={isDeleteConfirmOpen}
        setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
        fetchAllWidgets={fetchAllWidgets}
      />
    </div>
  );
}
export default LineChart;
