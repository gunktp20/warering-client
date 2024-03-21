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

function AddDashboard() {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isAccountUserDrawerOpen, setIsAccountUserDrawerOpen] =
    useState<boolean>(false);

  const [values, setValues] = useState({
    dashboard_name: "",
    description: "",
  });
  const [isSidebarShow, setIsSidebarShow] = useState<boolean>(true);
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
        isSidebarShow={isSidebarShow}
        setIsSidebarShow={setIsSidebarShow}
      />
      <div className="flex h-[100vh]">
        <NavLinkSidebar isSidebarShow={isSidebarShow}/>
        <NavDialog
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
        />
        <div className="m-[3rem] top-[5rem] w-[100%] h-fit flex flex-col">


          <div className="flex justify-between">
            <button
              onClick={() => {
                setIsDrawerOpen(true);
              }}
              className="hidden p-1 w-fit h-fit relative sm:block text-[#8f8f8f] mb-6"
              id="small-open-sidebar-btn"
            >
              <RiMenu2Fill className="text-[23px]" />
            </button>

            <button
              onClick={() => {
                navigate("/dashboard-list");
              }}
              className="flex cursor-pointer text-sm text-[#1D4469] font-bold items-center left-0 mb-10"
            >
              <IoArrowBackSharp className="text-sm mr-2" />
              Back
            </button>

            
          </div>

          <div className="flex w-[100%] justify-between sm:hidden">
            <div id="title-outlet" className="text-[23px] text-[#1d4469] font-bold mb-10">
              Add Dashboard
            </div>
          </div>

          <div className="bg-white shadow-md py-8 px-10 rounded-md">
            <div className=" w-[100%] flex flex-col">
              <div className="text-[18px] font-bold text-[#1D4469]">
                Add Dashboard
              </div>
              <div className="text-sm text-[#a4a4a4] mt-3">
                Fill in the information to add a Dashboard from your device.
              </div>
            </div>
            <div className="flex gap-10 mt-9 sm:flex-col sm:gap-0">
              <FormRow
                type="text"
                name="dashboard_name"
                labelText="Dashboard name"
                value={values.dashboard_name}
                handleChange={handleChange}
                marginTop="mt-[0.2rem]"
              />
              <FormRow
                type="text"
                name="description"
                labelText="description"
                value={values.description}
                handleChange={handleChange}
                marginTop="mt-[0.2rem]"
              />
            </div>
            <div className="w-[250px] sm:w-[100%]">
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
                Add Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default AddDashboard;
