import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { RxDotsHorizontal } from "react-icons/rx";
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

export type Id = string | number;

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {};

interface IProp {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  widgetId: string;
}

function Gauge({ label, value, min, max, unit, widgetId }: IProp) {
  // 100 x value / max + min   35
  const [isOptionOpen, setIsOptionOpen] = useState<boolean>(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);

  const sum = Number(max) + Number(min);
  console.log("sum", sum);
  const newValue = Number(value) + Number(min);
  const result = Math.round((100 * newValue) / sum);
  console.log("result = " + Math.round(result));
  const firstNum = result;
  const secondNum = 100 - result;
  console.log("firstNum", firstNum);
  console.log("secondNum", secondNum);
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

  // min = 20
  // 100 x value / max + min   35
  //
  // max = 70
  // 1% = 20
  // 100% = 70

  // value = 10
  return (
    <div className="h-[130px] w-[100%] bg-white relative rounded-md shadow-md flex justify-center items-center hover:ring-2  cursor-grab">
      <div className="absolute left-2 top-2 text-[#1d4469] text-sm">
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
      {isOptionOpen && (
        <div className="bg-white flex flex-col absolute top-6 right-2 border-[1px] rounded-md shadow-sm">
          <button className="text-[#7a7a7a] text-sm px-8 py-2 hover:bg-[#f7f7f7]">
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
        {value} {unit}
      </div>
      <ConfirmDelete
        widgetId={widgetId}
        isDeleteConfirmOpen={isDeleteConfirmOpen}
        setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
      />
    </div>
  );
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface IProps {
  widgetId: string;
  isDeleteConfirmOpen: boolean;
  setIsDeleteConfirmOpen: (active: boolean) => void;
}

function ConfirmDelete({
  widgetId,
  isDeleteConfirmOpen,
  setIsDeleteConfirmOpen,
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

export default Gauge;
