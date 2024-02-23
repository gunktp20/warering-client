import {
  BigNavbar,
  FormRow,
  NavLinkSidebar,
  NavDialog,
  AccountUserDrawer,
} from "../../components";
import Wrapper from "../../assets/wrappers/Dashboard";
import { useState } from "react";
import { RiMenu2Fill } from "react-icons/ri";
import { Button } from "@mui/material";
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function AddDevice() {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <Wrapper>
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
        <div className="m-[3rem] relative top-[5rem] w-[100%] h-fit flex flex-col sm:top-[5rem] bg-white shadow-md py-8 px-10 rounded-md sm:m-[3rem]">
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
            Add Device
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
          <div className=" w-[100%] flex flex-col">
            <div className="text-[18px] font-bold text-[#1D4469]">
              Device Details
            </div>
            <div className="text-sm text-[#a4a4a4] mt-3">
              Fill in the information to add a Dashboard from your device.
            </div>
          </div>
          <div className="flex gap-10 mt-9 sm:flex-col sm:gap-0">
            <div className="w-[100%]">
              <FormRow
                type="text"
                name="device_name"
                labelText="Device name"
                value={values.device_name}
                handleChange={handleChange}
                marginTop="mt-[0.2rem]"
              />
            </div>
            <div className="w-[100%]">
              <FormRow
                type="text"
                name="username_device"
                labelText="username device"
                value={values.username_device}
                handleChange={handleChange}
                marginTop="mt-[0.2rem]"
              />
            </div>
          </div>
          <div className="flex gap-10 mt-1 sm:flex-col sm:gap-0">
            <div className="w-[100%]">
              <FormRow
                type="text"
                name="password"
                labelText="password"
                value={values.password}
                handleChange={handleChange}
                marginTop="mt-[0.2rem]"
              />
            </div>
            <div className="w-[100%]">
              <FormRow
                type="text"
                name="description"
                labelText="description"
                value={values.description}
                handleChange={handleChange}
                marginTop="mt-[0.2rem]"
              />
            </div>
          </div>
          <div className=" w-[100%] flex flex-col">
            <div className="text-[17px] font-bold text-[#1D4469]">
              Publish Detail
            </div>
          </div>
          <div className="flex gap-10 mt-2 sm:flex-col sm:gap-0">
            <div className="w-[100%]">
              <FormRow
                type="text"
                name="topic_device"
                labelText="topic device"
                value={values.topic_device}
                handleChange={handleChange}
                marginTop="mt-[0.2rem]"
              />
            </div>
            <div className="w-[100%]">
              <FormRow
                type="text"
                name="Qos"
                labelText="Qos"
                value={values.Qos}
                handleChange={handleChange}
                marginTop="mt-[0.2rem]"
              />
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
          <div className="w-[360px] sm:w-[100%]">
            <Button
              onClick={() => {}}
              style={{
                textTransform: "none",
                width: "100%",
                height: "39px",
                marginTop: "1.5rem",
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
              Add Device
            </Button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default AddDevice;
