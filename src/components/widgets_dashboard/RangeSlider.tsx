import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { RxDotsHorizontal } from "react-icons/rx";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { useSortable } from "@dnd-kit/sortable";
import { IRangeSliderDashboardProp } from "./types";
import { CSS } from "@dnd-kit/utilities";

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

export default function RangeSlider({
  widget,
  label,
  min,
  max,
  widgetId,
  value,
  fetchAllWidgets,
  publishMQTT,
  selectWidget,
  editMode,
  dashboardId,
  onDeleteSuccess,
}: IRangeSliderDashboardProp) {
  const [val, setVal] = React.useState<number>(min);
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
    id: widget.id,
    data: {
      type: "Task",
      widget,
    },
    // disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    cursor: editMode ? "grab" : "default",
  };

  const [isOptionOpen, setIsOptionOpen] = React.useState<boolean>(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    React.useState<boolean>(false);

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
      className="h-[130px] w-[100%] bg-white relative rounded-md shadow-md flex justify-center items-center hover:ring-2"
    >
      <div className="absolute left-2 top-2 text-[#1d4469] text-[12px]">
        {label}
      </div>
      <div
        onClick={() => {
          setIsOptionOpen(!isOptionOpen);
        }}
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
      <Box sx={{ width: "100%", paddingLeft: "2rem", paddingRight: "2rem" }}>
        <Slider
          onChangeCommitted={() => {
            const payload = {
              [typeof value === "string" ? value : ""]: val,
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
  onDeleteSuccess: () => void;
  dashboardId: string;
}

function ConfirmDelete({
  widgetId,
  isDeleteConfirmOpen,
  setIsDeleteConfirmOpen,
  fetchAllWidgets,
  dashboardId,
  onDeleteSuccess,
}: IProps) {
  const axiosPrivate = useAxiosPrivate();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const handleClose = () => {
    setIsDeleteConfirmOpen(false);
  };

  const onDelete = async () => {
    setIsLoading(true);
    try {
      await axiosPrivate.delete(
        `/dashboards/${dashboardId}/widget/${widgetId}`
      );
      setIsLoading(false);
      setIsDeleteConfirmOpen(false);
      fetchAllWidgets();
      return onDeleteSuccess();
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
