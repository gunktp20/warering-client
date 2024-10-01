import { RxDotsHorizontal } from "react-icons/rx";
import { memo, useState } from "react";
import { IToggleSwitchDashboardProp } from "../../types/widget_dashboard";
import { styled } from "@mui/material/styles";
import Switch, { SwitchProps } from "@mui/material/Switch";
import ConfirmDelete from "./ConfirmDeleteWidget";
import { motion } from "framer-motion";
import DropIndicator from "../../pages/Dashboard/DropIndicator";
import { useAppSelector } from "../../app/hooks";

function ToggleSwitch({
  label,
  widgetId,
  value,
  on_payload,
  off_payload,
  fetchAllWidgets,
  publishMQTT,
  selectWidget,
  dashboardId,
  onDeleteSuccess,
  handleDragStart,
  column,
}: IToggleSwitchDashboardProp) {
  const [isOptionOpen, setIsOptionOpen] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);
  const { editMode } = useAppSelector((state) => state.dashboard)

  console.log('ToggleSwitch')

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
          id={`${widgetId}-toggle-switch-dashboard-options`}
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
        <SwitchMui
          isActive={isActive}
          setIsActive={setIsActive}
          value={value}
          on_payload={on_payload}
          off_payload={off_payload}
          publishMQTT={publishMQTT}
        />
        <ConfirmDelete
          widgetId={widgetId}
          isDeleteConfirmOpen={isDeleteConfirmOpen}
          setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
          fetchAllWidgets={fetchAllWidgets}
          dashboardId={dashboardId}
          onDeleteSuccess={onDeleteSuccess}
        />
      </motion.div>
    </div>
  );
}

type MqttPublish = (payload: string) => void;
interface IProp extends SwitchProps {
  isActive: boolean;
  value: string | number | null | MqttPublish;
  setIsActive: (_: boolean) => void;
  on_payload: string | number;
  off_payload: string | number;
  publishMQTT: (payload: string) => void;
}

const SwitchMui = styled((props: IProp) => (
  <Switch
    onChange={() => {
      const payload = {
        [typeof props.value === "string" ? props.value : "value"]:
          props.isActive ? props.off_payload : props.on_payload,
      };
      props.publishMQTT(JSON.stringify(payload));
      props.setIsActive(!props.isActive);
    }}
    focusVisibleClassName=".Mui-focusVisible"
    disableRipple
    checked={props.isActive}
    {...props}
  />
))(({ theme }) => ({
  width: 70,
  height: 30,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 4,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(37px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#1966fb" : "#1966fb",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 23,
    height: 23,
  },
  "& .MuiSwitch-track": {
    borderRadius: 30 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

export default memo(ToggleSwitch);
