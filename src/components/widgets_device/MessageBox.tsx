import { useState } from "react";
import { RxDotsHorizontal } from "react-icons/rx";
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
interface IProp {
  label: string;
  value: number;
  unit: string;
  widgetId: string;
  fetchAllWidgets:()=>void
  selectWidget:(widget_id:any)=>void
}
function MessageBox({ label, value, unit, widgetId ,fetchAllWidgets,selectWidget}: IProp) {
  const [isOptionOpen, setIsOptionOpen] = useState<boolean>(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);
  return (
    <div className="h-[130px] w-[100%] bg-white relative rounded-md shadow-md flex justify-center items-center hover:ring-2">
      {!value && <div className="w-[100%] h-[100%] bg-white z-10 flex absolute justify-center items-center font-bold text-[#0075ff]">IDLE</div>}
      <div className="z-30 absolute left-2 top-2 text-[#1d4469] text-sm">
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
          <button onClick={()=>{
            selectWidget(widgetId)
          }} className="text-[#7a7a7a] text-sm px-8 py-2 hover:bg-[#f7f7f7]">
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
      <div className="text-[#1966fb] text-[19px] font-bold flex">
        
        {value}
        <div className="text-[11px] font-medium text-[#5353538a] text-right ml-2">
          {unit}
        </div>
      </div>
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
  fetchAllWidgets:() => void;
}

function ConfirmDelete({
  widgetId,
  isDeleteConfirmOpen,
  setIsDeleteConfirmOpen,
  fetchAllWidgets
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
      fetchAllWidgets()
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

export default MessageBox;
