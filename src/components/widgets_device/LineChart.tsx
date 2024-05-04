import { RxDotsHorizontal } from "react-icons/rx";
import { Button } from "@mui/material";
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
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

interface IProp {
  label: string;
  widgetId: string;
  value: string;
  min: number;
  max: number;
  fetchAllWidgets: () => void;
  publishMQTT: (payload: string) => void;
  selectWidget: (widget_id: string) => void;
}

function LineChart({
  label,
  value,
  widgetId,
  min,
  max,
  fetchAllWidgets,
  publishMQTT,
  selectWidget,
}: IProp) {
  const [isOptionOpen, setIsOptionOpen] = useState<boolean>(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);

  function calculatePercentage(percent: number, baseNumber: number) {
    const result = (percent / 100) * baseNumber;
    console.log(`${percent}% of ${baseNumber} is ${result}`);
    return result;
  }

  const data = {
    labels: ["5", "15", "20", "21", "22", "25", "26"],
    datasets: [
      {
        label: "Sales of the Week",
        data: [
          calculatePercentage(5, max),
          calculatePercentage(21, max),
          calculatePercentage(42, max),
          calculatePercentage(23, max),
          calculatePercentage(24, max),
          calculatePercentage(25, max),
          calculatePercentage(40, max),
        ],
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
    legend: true,
    scales: {
      y: {
        min: Math.floor(min),
        max: Math.floor(max),
      },
    },
  };

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
        <Line data={data} options={options} className="flex flex-grow"></Line>
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
