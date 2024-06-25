import { useState } from "react";
import { RxDotsHorizontal } from "react-icons/rx";
import { IMessageBoxDeviceProp } from "../../types/widget_device";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import { useAppDispatch } from "../../app/hooks";
import { setSelectedWidgets } from "../../features/widget/widgetSlice";

function MessageBox({
  label,
  value,
  unit,
  widgetId,
  fetchAllWidgets,
  selectWidget
}: IMessageBoxDeviceProp) {
  const [isOptionOpen, setIsOptionOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch()
  function checkThaiLanguage(text: string) {

    // eslint-disable-next-line prefer-const
    let thaiRegex = new RegExp(/[\u0E00-\u0E7F]+/);
    return thaiRegex.test(text);
  }

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);
  return (
    <div id={widgetId} className="h-[150px] w-[100%] bg-white relative shadow-md flex justify-center items-center rounded-md hover:ring-2 overflow-hidden">
      {((!value && value !== 0)) && (
        <div className=" bg-white z-10 flex absolute justify-center items-center font-bold text-[#0075ff]">
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
        id={`${widgetId}-message-box-device-options`}
        className="z-20 absolute right-3 top-2 text-[18px] text-[#7a7a7a] cursor-pointer hover:bg-[#f7f7f7] hover:rounded-md "
      >
        <RxDotsHorizontal />
      </div>
      {isOptionOpen && (
        <div className="z-30 bg-white flex flex-col absolute top-6 right-2 border-[1px] rounded-md shadow-sm">
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
      {((value || value === 0)) && <div
        className={`text-[#1966fb] font-bold flex ${checkThaiLanguage(
          value !== null && typeof value !== "number" ? value : ""
        )
          ? "text-[12.8px] font-thin"
          : "text-[19px]"
          }`}
      >
        {value}
        <div className="text-[11px] font-medium text-[#5353538a] text-right ml-2">
          {unit}
        </div>
      </div>}
      <DeleteConfirmDialog
        isDeleteConfirmOpen={isDeleteConfirmOpen}
        setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
        fetchAllWidgets={fetchAllWidgets}
      />
    </div>
  );
}

export default MessageBox;
