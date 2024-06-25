import { RxDotsHorizontal } from "react-icons/rx";
import { Button } from "@mui/material";
import { useState } from "react";
import { IButtonControlDashboardProp } from "../../types/widget_dashboard";
import ConfirmDelete from "./ConfirmDeleteWidget";
import { motion } from "framer-motion"
import { useAppSelector } from "../../app/hooks";
import DropIndicator from "../../pages/Dashboard/DropIndicator";

function ButtonControl({
  label,
  button_label,
  widgetId,
  payload,
  fetchAllWidgets,
  publishMQTT,
  selectWidget,
  dashboardId,
  onDeleteSuccess,
  handleDragStart,
  column,
}: IButtonControlDashboardProp) {
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
        <div className="absolute left-2 top-2 text-[#1d4469] text-[12px]">
          {label}
        </div>
        <div
          onClick={() => {
            setIsOptionOpen(!isOptionOpen);
          }}
          id={`${widgetId}-button-control-dashboard-options`}
          className="absolute right-3 top-2 text-[18px] text-[#7a7a7a] cursor-pointer hover:bg-[#f7f7f7] hover:rounded-md "
        >
          <RxDotsHorizontal />
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
export default ButtonControl;
