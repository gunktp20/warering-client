import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout } from "../../features/auth/authSlice";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {
  BigNavbar,
  FormRow,
  NavLinkSidebar,
  NavDialog,
  FormControl,
} from "../../components";
import Wrapper from "../../assets/wrappers/Dashboard";
import { GoCpu } from "react-icons/go";
import { useState } from "react";
import { RiMenu2Fill } from "react-icons/ri";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditDeviceDialog from "./EditDeviceDialog";
import SwitchSave from "./SwitchSave";

function DeviceList() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [isMember, setIsMember] = useState<boolean>(true);
  const { user, token } = useAppSelector((state) => state.auth);
  interface IDevice {
    active: boolean;
    nameDevice: string;
    save: boolean;
    lastLoggedIn: string;
    Registration: string;
  }
  // mock data
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
    search_dashboard: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const signOut = async () => {
    dispatch(logout());
    await axiosPrivate.post(
      `/auth/logout`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  };

  return (
    <Wrapper>
      <EditDeviceDialog
        isEditDialogOpen={isEditDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
      />
      <BigNavbar />
      <div className="flex">
        <NavLinkSidebar />
        <NavDialog
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
        />
        <div className="m-[3rem] relative top-[4rem] w-[100%] h-fit flex flex-col sm:top-[5rem] bg-white shadow-md py-8 px-10 rounded-md sm:m-[3rem] sm:mx-0">
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
            Device List
          </div>
          <div className="absolute top-[-4rem] text-[23px] text-[#1d4469] font-bold right-0">
            <Button
              onClick={() => {
                navigate("/add-dashboard");
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
          <div className=" w-[100%] justify-between flex items-center">
            <div className="w-[330px] sm:w-[150px]">
              <FormRow
                type="text"
                name="search_dashboard"
                labelText="search dashboard"
                value={values.search_dashboard}
                handleChange={handleChange}
                marginTop="mt-[0.2rem]"
              />
            </div>
            <FormControl title="Sort by date" options={["Date"]} />
          </div>
          <div className="overflow-auto rounded-lg shadow block sm:shadow-none">
            <table className="w-full">
              <thead className="border-b-2 border-gray-200 sm:hidden">
                <tr>
                  <th className=" w-[10%]  text-center text-sm font-semibold tracking-wide ">
                    Activity
                  </th>
                  <th className="w-[15%]  text-center text-sm font-semibold tracking-wide ">
                    NameDevice
                  </th>
                  <th className=" w-[5%]  text-center text-sm font-semibold tracking-wide ">
                    Save
                  </th>
                  <th className=" w-[25%]  text-center text-sm font-semibold tracking-wide ">
                    Last Logged In
                  </th>
                  <th className=" w-[25%]  text-center text-sm font-semibold tracking-wide ">
                    Registration
                  </th>
                  <th className=" w-[20%]  text-center text-sm font-semibold tracking-wide ">
                    Action
                  </th>
                </tr>
              </thead>
              {/* <div className="font-bold hidden mr-3 sm:mb-2 sm:block text-gray-600"> */}
              <tbody className="divide-y divide-gray-100">
                {device_list.map((i,index) => {
                  return (
                    <tr key={index} className="sm:flex sm:flex-col sm:my-5 sm:border-[1px] sm:rounded-lg sm:shadow-md overflow-hidden hover:bg-[#ddd] sm:hover:bg-[#fff] hover:shadow-lg transition ease-in delay-10">
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

                      <td className="p-3 text-sm text-[#878787] whitespace-nowrap text-center sm:text-start sm:bg-[#1966fb] sm:text-white">
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
                          <button className="text-[#dc3546]">Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default DeviceList;
