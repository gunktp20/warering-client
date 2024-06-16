import { useState } from "react";
import { RxDotsHorizontal } from "react-icons/rx";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IMessageBoxDashboardProp } from "../../types/widget_dashboard";
import ConfirmDelete from "./ConfirmDeleteWidget";

function MessageBox({
  widget,
  label,
  value,
  unit,
  widgetId,
  fetchAllWidgets,
  selectWidget,
  editMode,
  dashboardId,
  onDeleteSuccess
}: IMessageBoxDashboardProp) {
  const [isOptionOpen, setIsOptionOpen] = useState<boolean>(false);
  function checkThaiLanguage(text: string) {
    // eslint-disable-next-line prefer-const
    let thaiRegex = new RegExp(/[\u0E00-\u0E7F]+/);
    return thaiRegex.test(text);
  }

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);

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

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
          opacity-30
        bg-mainBackgroundColor p-2.5 h-[150px] min-h-[100px] items-center flex text-left rounded-xl border-2 border-[#1966fb] cursor-grab relative
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
      className="h-[150px] w-[100%] bg-white relative shadow-md flex justify-center items-center rounded-md hover:ring-2 overflow-hidden"
    >
      {!value && (
        <div className="w-[100%] h-[100%] bg-white z-10 flex absolute justify-center items-center font-bold text-[#0075ff]">
          IDLE
        </div>
      )}
      <div className="z-30 absolute left-2 top-2 text-[#1d4469] text-[12px]">
        {label}
      </div>
      <div
        onClick={() => {
          setIsOptionOpen(!isOptionOpen);
        }}
        id={`${widgetId}-message-box-dashboard-options`}
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
      <div
        className={`text-[#1966fb] font-bold flex ${checkThaiLanguage(typeof value === "string" ? value : "")
          ? "text-[12.8px] font-thin"
          : "text-[19px]"
          }`}
      >
        {(typeof value === "string" || typeof value === "number") ? value : ""}
        <div className="text-[11px] font-medium text-[#5353538a] text-right ml-2">
          {unit}
        </div>
      </div>
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

export default MessageBox;
