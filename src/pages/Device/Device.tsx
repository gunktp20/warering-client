import {
  BigNavbar,
  NavLinkSidebar,
  NavDialog,
  AccountUserDrawer,
} from "../../components";
import { useState } from "react";
import { RiMenu2Fill } from "react-icons/ri";
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { SiMicrosoftexcel } from "react-icons/si";
import { BsFiletypeJson } from "react-icons/bs";
import { FaClipboardList } from "react-icons/fa";

function Device() {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isAccountUserDrawerOpen, setIsAccountUserDrawerOpen] =
    useState<boolean>(false);

  const [values, setValues] = useState({
    device_name: "",
    username_device: "",
    password: "",
    description: "",
    topic_device: "",
    Qos: "",
  });

  const jsonData = {
    data: "HelloWorld",
    username: "gunktp14",
    password: "71567****",
    description: "สวัดดีครับท่านผู้ชม",
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <AccountUserDrawer
        isAccountUserDrawerOpen={isAccountUserDrawerOpen}
        setIsAccountUserDrawerOpen={setIsAccountUserDrawerOpen}
      />
      <BigNavbar
        isAccountUserDrawerOpen={isAccountUserDrawerOpen}
        setIsAccountUserDrawerOpen={setIsAccountUserDrawerOpen}
      />
      <div className="flex">
        <NavLinkSidebar />
        <NavDialog
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
        />
        <div className="m-[3rem]  relative top-[5rem] w-[100%] h-fit flex flex-col sm:top-[5rem] rounded-md sm:m-[3rem]">
          <button
            onClick={() => {
              setIsDrawerOpen(true);
            }}
            className="hidden p-1 w-fit h-fit left-[0rem] absolute sm:block top-[-7rem] text-[#8f8f8f]"
            id="small-open-sidebar-btn"
          >
            <RiMenu2Fill className="text-[23px]" />
          </button>
          <div className="absolute left-0 top-[-4rem] text-[23px] text-[#1d4469] font-bold">
            การเกษตรรวม
          </div>
          <button
            onClick={() => {
              navigate("/device-list");
            }}
            className="absolute top-[-6.5rem] flex cursor-pointer text-sm text-[#1D4469] font-bold items-center left-0 sm:left-[90%]"
          >
            <IoArrowBackSharp className="text-sm" />
            Back
          </button>
          <div className="p-5 w-[100%] border-[1px] grid grid-cols-3 border-[#f1f1f1] rounded-md shadow-sm bg-white sm:grid-cols-2">
            <div className=" w-[100%] text-[#1D4469] font-bold mb-4">
              Dashboard Name
              <div className="dd font-medium mt-2 text-[#7a7a7a] text-sm ">
                การเกษตรรวม
              </div>
            </div>
            <div className=" w-[100%] text-[#1D4469] font-bold mb-4">
              Description
              <div className="dd font-medium mt-2 text-[#7a7a7a] text-sm">
                การเกษตรรวมภายใน
              </div>
            </div>
            <div className=" w-[100%] text-[#1D4469] font-bold mb-4">
              CreatedAt
              <div className="dd font-medium mt-2 text-[#7a7a7a] text-sm">
                00/00/0000 00:00
              </div>
            </div>
            <div className=" w-[100%] text-[#1D4469] font-bold mb-4">
              Username Device
              <div className="dd font-medium mt-2 text-[#7a7a7a] text-sm">
                การเกษตรรวม
              </div>
            </div>

            <div className=" w-[100%] text-[#1D4469] font-bold mb-4">
              Password Device
              <div className="dd font-medium mt-2 text-[#7a7a7a] text-sm">
                การเกษตรรวม
              </div>
            </div>
            <div className=" w-[100%] text-[#1D4469] font-bold mb-4">
              Qos
              <div className="dd font-medium mt-2 text-[#7a7a7a] text-sm">
                0 : ony way
              </div>
            </div>
            <div className="flex items-center">
              <label
                htmlFor="link-checkbox"
                className="ms-2 text-sm mr-2 font-medium text-[#1D4469] dark:text-gray-300"
              >
                Retain
              </label>
              <input
                id="link-checkbox"
                type="checkbox"
                value=""
                className=" w-[15px] h-[15px] text-[#2CB1BC] bg-gray-100 border-gray-300 rounded focus:ring-[#ffffff00] dark:focus:ring-[#2CB1BC] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>

          <div className="text-[#1d4469] text-[20px] mt-8 font-bold">
            JSON view
          </div>
          <div className="text-[text-[#7a7a7a] text-sm] text-[13.2px]">
            View JSON data
          </div>
          <div className="w-[100%] text-sm p-5 bg-[#f2f2f2] text-[#7a7a7a] shadow-sm mt-7">
            <pre>{JSON.stringify(jsonData, null, 2)}</pre>
          </div>
          <div className="text-[#1d4469] text-[20px] mt-8 font-bold">
            Export
          </div>
          <div className="gap-16 flex border-t-[1px] border-b-[1px] py-6 border-[#d8d8d8] mt-4">
            <div className="flex flex-col justify-center items-center">
              <SiMicrosoftexcel className="text-[#1d4469] text-[25px]" />
              <div className="text-[13px] mt-3 text-[#1d4469]">Excel</div>
            </div>
            <div className="flex flex-col justify-center items-center">
              <BsFiletypeJson className="text-[#1d4469] text-[25px]" />
              <div className="text-[13px] mt-3 text-[#1d4469]">JSON</div>
            </div>
            <div className="flex flex-col justify-center items-center">
              <FaClipboardList className="text-[#1d4469] text-[25px]" />
              <div className="text-[13px] mt-3 text-[#1d4469]">Clip Board</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Device;
