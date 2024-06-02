import { IMessageBoxPreviewProp } from "../../types/widget_preview";

function MessageBoxPreview({ label, value, unit }: IMessageBoxPreviewProp) {
  return (
    <div className="h-[130px] w-[100%] bg-white relative rounded-md shadow-md flex justify-center items-center ">
      <div className="absolute left-2 top-2 text-[#1d4469] text-sm">
        {label}
      </div>
      <div className="text-[#1966fb] text-[19px] font-bold">
        <div className="text-[11px] font-medium text-[#5353538a] text-right">
          {unit}
        </div>
        {value}
      </div>
    </div>
  );
}

export default MessageBoxPreview;
