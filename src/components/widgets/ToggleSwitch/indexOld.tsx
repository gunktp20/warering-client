import { RxDotsHorizontal } from "react-icons/rx";
import SwitchMui from "./SwitchMui";
import { useState } from "react";

interface IProp {
    isDeleteConfirmOpen:boolean;
    setIsDeleteConfirmOpen:(active:boolean)=>void
}

function ToggleSwitch(props:IProp) {
  const [isActive, setIsActive] = useState<boolean>(true);
  const [isOptionOpen, setIsOptionOpen] = useState<boolean>(false);

  return (
    <div className="h-[130px] w-[100%] bg-white relative rounded-md shadow-md flex justify-center items-center ">
      <div className="absolute left-2 top-2 text-[#1d4469] text-sm">
        Toggle Switch
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
          <button onClick={()=>{
            props.setIsDeleteConfirmOpen(!props.isDeleteConfirmOpen)
          }} className="text-[#7a7a7a] text-sm px-8 py-2 hover:bg-[#f7f7f7]">
            Delete
          </button>
        </div>
      )}
      <SwitchMui
        setIsActive={setIsActive}
        isActive={isActive}
        checked={isActive}
      />
    </div>
  );
}

export default ToggleSwitch;
