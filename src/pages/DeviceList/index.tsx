import { useAppDispatch } from "../../app/hooks";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {
  BigNavbar,
  FormRow,
  NavLinkSidebar,
  FormControl,
  NavDialog,
  AccountUserDrawer,
} from "../../components";
import Wrapper from "../../assets/wrappers/Dashboard";
import { useState } from "react";
import { RiMenu2Fill } from "react-icons/ri";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditDeviceDialog from "./EditDeviceDialog";
import ConfirmDelete from "./ConfirmDeleteDevice";
import SwitchSave from "./SwitchSave";
import { IoSearchOutline } from "react-icons/io5";

function DashboardList() {
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);
  const [isAccountUserDrawerOpen, setIsAccountUserDrawerOpen] =
    useState<boolean>(false);

  interface IDevice {
    active: boolean;
    nameDevice: string;
    save: boolean;
    lastLoggedIn: string;
    Registration: string;
  }

  const device_list: IDevice[] = [
    {
      active: false,
      nameDevice: "การเกษตรรวม",
      save: true,
      lastLoggedIn: "00/00/0000 00:00",
      Registration: "00/00/0000 00:00",
    },
    {
      active: false,
      nameDevice: "เเปลงผัก",
      save: true,
      lastLoggedIn: "00/00/0000 00:00",
      Registration: "00/00/0000 00:00",
    },
    {
      active: true,
      nameDevice: "ภายในบ้าน",
      save: false,
      lastLoggedIn: "00/00/0000 00:00",
      Registration: "00/00/0000 00:00",
    },
    {
      active: false,
      nameDevice: "อากาศ",
      save: false,
      lastLoggedIn: "00/00/0000 00:00",
      Registration: "00/00/0000 00:00",
    },
    {
      active: false,
      nameDevice: "ฝุ่น",
      save: true,
      lastLoggedIn: "00/00/0000 00:00",
      Registration: "00/00/0000 00:00",
    },
  ];

  const [values, setValues] = useState({
    search_device: "",
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
      <ConfirmDelete
        isDeleteConfirmOpen={isDeleteConfirmOpen}
        setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
      />
      <EditDeviceDialog
        isEditDialogOpen={isEditDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
      />
      <BigNavbar
        isAccountUserDrawerOpen={isAccountUserDrawerOpen}
        setIsAccountUserDrawerOpen={setIsAccountUserDrawerOpen}
      />
      <div className="flex h-[100vh]">
        <NavLinkSidebar />
        <NavDialog
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
        />
        <div className="m-[3rem] top-[4rem] w-[100%] flex h-fit flex-col sm:m-0 sm:my-[3rem]">
          <button
            onClick={() => {
              setIsDrawerOpen(true);
            }}
            className="hidden p-1 w-fit h-fit relative sm:block text-[#8f8f8f] mb-6"
            id="small-open-sidebar-btn"
          >
            <RiMenu2Fill className="text-[23px]" />
          </button>

          <div className="flex w-[100%] justify-between">
            <div className="text-[23px] text-[#1d4469] font-bold mb-10">
              Device List
            </div>

            <div>
              <Button
                onClick={() => {
                  navigate("/add-device");
                }}
                style={{
                  textTransform: "none",
                  width: "100%",
                  height: "39px",
                }}
                sx={{
                  border: 2,
                  fontWeight: "bold",
                  alignItems: "center",
                  fontSize: "12px",
                  color: "#1D4469",
                  ":hover": {},
                  ":disabled": {
                    color: "#fff",
                  },
                }}
                variant="outlined"
                id="setup-user-submit"
              >
                Add Device
              </Button>
            </div>
          </div>

          <div className="bg-white py-8 px-10 shadow-md rounded-md">
          <div className=" w-[100%] justify-between flex items-center sm:flex-col">
              <div className="w-[330px] sm:w-[100%] relative items-center flex ">
              <FormRow
                  type="text"
                  name="search_device"
                  labelText="search device"
                  value={values.search_device}
                  handleChange={handleChange}
                  marginTop="mt-[0.2rem]"
                />
                <IoSearchOutline className="absolute text-[#1d4469] end-0 text-[20px]"/>
              </div>
              <div className="flex gap-3 sm:w-[100%]">
                <FormControl title="Sort by date" options={["Date"]} />
                <FormControl title="Filter" options={["filter"]} />
              </div>
            </div>

            <div className="overflow-auto rounded-lg shadow block sm:shadow-none">
              <table className="w-full">
                <thead className="border-b-2 border-gray-200 sm:hidden">
                  <tr>
                    <th className=" w-[10%]  text-center text-sm font-semibold tracking-wide ">
                      Activity
                    </th>
                    <th className="w-[20%]  text-center text-sm font-semibold tracking-wide ">
                      NameDevice
                    </th>
                    <th className=" w-[5%]  text-center text-sm font-semibold tracking-wide ">
                      Save
                    </th>
                    <th className=" w-[22.5%]  text-center text-sm font-semibold tracking-wide ">
                      Last Logged In
                    </th>
                    <th className=" w-[22.5%]  text-center text-sm font-semibold tracking-wide ">
                      Registration
                    </th>
                    <th className=" w-[20%]  text-center text-sm font-semibold tracking-wide ">
                      Action
                    </th>
                  </tr>
                </thead>
                {/* <div className="font-bold hidden mr-3 sm:mb-2 sm:block text-gray-600"> */}
                <tbody className="divide-y divide-gray-100">
                  {device_list.map((i, index) => {
                    return (
                      <tr
                        key={index}
                        className="sm:flex sm:flex-col sm:my-5 sm:border-[1px] sm:rounded-lg sm:shadow-md overflow-hidden hover:bg-[#ddd] sm:hover:bg-[#fff] hover:shadow-lg transition ease-in delay-10"
                      >
                        <td
                          className={`flex sm:hidden items-center justify-center capitalize p-3 text-[13px] ${
                            i.active ? "text-green-500" : "text-red-500"
                          } whitespace-nowrap text-center sm:text-start sm:bg-[#1966fb] sm:text-white`}
                        >
                          <div
                            className={`w-[8px] h-[8px] ${
                              i.active ? "bg-green-500" : "bg-red-500"
                            } rounded-full mr-2`}
                          ></div>
                          {i.active ? "online" : "offline"}
                        </td>
                        {/* <td className={`flex  items-center justify-center capitalize p-3 text-[14px] whitespace-nowrap text-center sm:text-start sm:bg-[#1966fb] sm:text-white`}>
                      {i.nameDevice}
                    </td> */}

                        <td
                          onClick={() => {
                            navigate("/device/:device_id");
                          }}
                          className="p-3 cursor-pointer text-sm text-[#878787] whitespace-nowrap text-center sm:text-start sm:bg-[#1966fb] sm:text-white"
                        >
                          {i.nameDevice}
                        </td>

                        <td
                          className={`hidden items-center sm:flex capitalize p-3 text-[13px] ${
                            i.active ? "text-green-500" : "text-red-500"
                          } whitespace-nowrap text-center sm:text-start`}
                        >
                          <div
                            className={`w-[8px] h-[8px] ${
                              i.active ? "bg-green-500" : "bg-red-500"
                            } rounded-full mr-2`}
                          ></div>
                          {i.active ? "online" : "offline"}
                        </td>

                        <td className="p-3 text-sm text-[#878787] whitespace-nowrap text-center sm:text-start">
                          <div className="font-bold hidden mr-3 sm:mb-2 sm:block text-gray-600">
                            Save
                          </div>
                          <SwitchSave checked={i.save} />
                        </td>
                        <td className="p-3 text-sm text-[#878787] whitespace-nowrap text-center sm:text-start">
                          <div className="font-bold hidden mr-3 sm:mb-2 sm:block text-gray-600">
                            Last Logged In
                          </div>
                          {i.lastLoggedIn}
                        </td>
                        <td className="p-3 text-sm text-[#878787] whitespace-nowrap text-center sm:text-start">
                          <div className="font-bold hidden mr-3 sm:mb-2 sm:block text-gray-600">
                            Registration
                          </div>
                          {i.Registration}
                        </td>
                        <td className="p-3 text-sm text-[#878787] whitespace-nowrap text-center sm:text-start">
                          <div className="font-bold hidden mr-3 sm:mb-2 sm:block text-gray-600">
                            Action
                          </div>
                          <div className="flex justify-center sm:justify-start">
                            <button
                              onClick={() => {
                                setEditDialogOpen(true);
                              }}
                              className="mr-6 text-[#2E7D32]"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setIsDeleteConfirmOpen(!isDeleteConfirmOpen);
                              }}
                              className="text-[#dc3546]"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end items-center w-[100%] mt-4">
              <div className="mr-3 text-[12.4px]">1-5 of items</div>
              <div className="flex gap-2">
                <div className="border-[1px] text-[#7a7a7a] border-[#cccccc] rounded-md w-[30px] h-[30px] flex items-center justify-center">
                  {"<"}
                </div>
                <div className="bg-[#1966fb] text-[13.5px]  text-white border-[1px] rounded-md w-[30px] h-[30px] flex items-center justify-center">
                  1
                </div>
                <div className="border-[1px] text-[13.5px] text-[#7a7a7a] border-[#cccccc] rounded-md w-[30px] h-[30px] flex items-center justify-center">
                  2
                </div>
                <div className="border-[1px] text-[13.5px] text-[#7a7a7a] border-[#cccccc] rounded-md w-[30px] h-[30px] flex items-center justify-center">
                  {">"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default DashboardList;
