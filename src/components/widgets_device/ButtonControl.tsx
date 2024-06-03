import { RxDotsHorizontal } from "react-icons/rx";
import { Button } from "@mui/material";
import { useState } from "react";
import { IButtonControlDeviceProp } from "../../types/widget_device";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import { useAppDispatch } from "../../app/hooks";
import { setSelectedWidgets } from "../../features/widget/widgetSlice";

function ButtonControl({
  label,
  button_label,
  widgetId,
  payload,
  fetchAllWidgets,
  publishMQTT,
  selectWidget
}: IButtonControlDeviceProp) {
  const [isOptionOpen, setIsOptionOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch()
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);

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
      <Button
        onClick={() => {
          publishMQTT(payload);
        }}
        style={{
          textTransform: "none",
          width: "fit-content",
          height: "39px",
        }}
        sx={{
          bgcolor: "#1966fb",
          ":hover": {
            bgcolor: "#10269C",
          },
          ":disabled": {
            color: "#fff",
          },
        }}
        variant="contained"
        id="setup-user-submit"
      >
        {button_label}
      </Button>
      <DeleteConfirmDialog
        isDeleteConfirmOpen={isDeleteConfirmOpen}
        setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
        fetchAllWidgets={fetchAllWidgets}
      />
    </div>
  );
}

export default ButtonControl;
