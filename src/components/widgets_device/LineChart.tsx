import { RxDotsHorizontal } from "react-icons/rx";
import { useState } from "react";
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { ILineChartDeviceProp } from "./types";
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function LineChart({
  label,
  value,
  widgetId,
  min,
  max,
  fetchAllWidgets,
  selectWidget,
}: ILineChartDeviceProp) {
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
        //  Data Y
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
        // x: {
        //     display: false // Hide X axis labels
        // }
      },
    },
  };

  const pushNumber = (number: number): void => {
    setValues((prevNumbers) => {
      // Create a new array based on the previous state
      const newNumbers = [...prevNumbers];
      console.log(newNumbers);

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
      console.log(newStamp);

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
    pushNumber(value);
  }, [value]);

  return (
    <div className="h-[130px] w-[100%] bg-white relative rounded-md shadow-md flex justify-center items-center hover:ring-2">
      <div className="absolute left-2 top-2 text-[#1d4469] text-[12px]">
        {label}
      </div>
      <div
        onClick={() => {
          setIsOptionOpen(!isOptionOpen);
        }}
        className="absolute right-3 top-2 text-[18px] text-[#7a7a7a] cursor-pointer hover:bg-[#f7f7f7] hover:rounded-md "
      >
        <RxDotsHorizontal />
      </div>
      <div className="h-[100%] flex pt-[5px] w-[100%] justify-center ">
        <Line data={data} options={options}></Line>
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
      />
    </div>
  );
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface IProps {
  widgetId: string;
  isDeleteConfirmOpen: boolean;
  setIsDeleteConfirmOpen: (active: boolean) => void;
  fetchAllWidgets: () => void;
}

function ConfirmDelete({
  widgetId,
  isDeleteConfirmOpen,
  setIsDeleteConfirmOpen,
  fetchAllWidgets,
}: IProps) {
  const axiosPrivate = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleClose = () => {
    setIsDeleteConfirmOpen(false);
  };

  const onDelete = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosPrivate.delete(`/widgets/${widgetId}`);
      console.log(data);
      setIsLoading(false);
      setIsDeleteConfirmOpen(false);
      fetchAllWidgets();
    } catch (err) {
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={isDeleteConfirmOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContentText
          id="confirm-delete-dashboard-dialog"
          className="py-7 px-11"
          component={"div"}
          variant={"body2"}
        >
          <div className="text-[#dc3546] text-[15.5px] text-center">
            Are you sure you want to delete this widget?
          </div>
          <div className="mt-4 flex justify-center gap-3 w-[100%]">
            <button
              onClick={handleClose}
              className="text-black text-[12.5px] border-[1px] border-[#000] rounded-sm px-10 py-[0.4rem]"
            >
              Cancel
            </button>
            <button
              disabled={isLoading}
              onClick={() => {
                onDelete();
              }}
              className="bg-[#dc3546] text-[12.5px] text-white px-10 py-[0.4rem] rounded-sm"
            >
              Delete
            </button>
          </div>
        </DialogContentText>
      </Dialog>
    </React.Fragment>
  );
}

export default LineChart;
