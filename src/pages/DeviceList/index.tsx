import {
  BigNavbar,
  FormRow,
  NavLinkSidebar,
  NavDialog,
  AccountUserDrawer,
} from "../../components";
import Wrapper from "../../assets/wrappers/DeviceList";
import { useEffect, useState } from "react";
import { RiMenu2Fill } from "react-icons/ri";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditDeviceDialog from "./EditDeviceDialog";
import ConfirmDelete from "./ConfirmDeleteDevice";
import SwitchSave from "./SwitchSave";
import { IoSearchOutline } from "react-icons/io5";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { setDevices } from "../../features/device/deviceSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { MdSearchOff } from "react-icons/md";
import moment from "moment";

function DeviceList() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { devices } = useAppSelector((state) => state.device);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const axiosPrivate = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSidebarShow, setIsSidebarShow] = useState<boolean>(true);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);
  const [isAccountUserDrawerOpen, setIsAccountUserDrawerOpen] =
    useState<boolean>(false);
  // const [limitQuery, setLimitQuery] = useState<number>(5);
  const limitQuery: number = 5
  const [numOfPage, setNumOfPage] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(0);
  const [selectedDevice, setSelectedDevice] = useState<any>();
  const [sortCreatedAt, setSortCreatedAt] = useState<string>("-createdAt");
  const [filterByPermission, setFilterByPermission] = useState<string>("");
  const [filterByisSaveData, setFilterByIsSaveData] = useState<string>("");
  const elements = [];

  const [timeoutIds, setTimeoutIds] = useState<any>([]);
  const clearAllTimeouts = () => {
    timeoutIds.forEach((timeoutId: any) => clearTimeout(timeoutId));
    setTimeoutIds([]);
  };
  const onToggleSwitchSave = ({ id, save }: { id: string; save: boolean }) => {
    clearAllTimeouts();
    const newTimeoutId = setTimeout(() => {
      setIsSaveDevice(id, save);
    }, 300);
    setTimeoutIds([newTimeoutId]);
  };
  const onTogglePermission = (id: string, permission: string) => {
    clearAllTimeouts();
    const newTimeoutId = setTimeout(() => {
      setDevicePermission(id, permission);
    }, 1000);
    setTimeoutIds([newTimeoutId]);
  };

  const setIsSaveDevice = async (deviceId: string, save: boolean) => {
    try {
      const { data } = await axiosPrivate.put(`/devices/store/${deviceId}`, {
        storeData: save,
      });
      setIsLoading(false);
      fetchAllDevice();
      setPageCount(data.metadata.pageCount);
    } catch (err: any) {
      setIsLoading(false);
    }
  };

  const fetchAllDevice = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosPrivate.get(
        `/devices?limit=${limitQuery}&page=${numOfPage}&query=${values.search_device}&createdAt=${sortCreatedAt}${filterByPermission && "&permission=" + filterByPermission}${filterByisSaveData && "&isSaveData=" + filterByisSaveData}`
      );
      dispatch(setDevices(data.data));
      setIsLoading(false);
      setPageCount(data.metadata.pageCount);
      if(data.metadata.pageCount === 1 && numOfPage !== 1){
          setNumOfPage(1)
      }
    } catch (err: any) {
      setIsLoading(false);
    }
  };

  const setDevicePermission = async (deviceId: string, permission: string) => {
    setIsLoading(true);
    try {
      await axiosPrivate.put(
        `/devices/permission/${deviceId}`,
        {
          permission: permission,
        }
      );
      fetchAllDevice();
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
    }
  };

  const [values, setValues] = useState({
    search_device: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  for (let i = 1; i < pageCount + 1; i++) {
    elements.push(
      <button
        onClick={() => {
          setNumOfPage(i);
        }}
        key={i}
        className={`${numOfPage === i
          ? "bg-[#1966fb] text-white"
          : "bg-white text-[#7a7a7a]"
          } cursor-pointer  border-[#cccccc] border-[1px] text-[13.5px] rounded-md w-[30px] h-[30px] flex items-center justify-center`}
      >
        {i}
      </button>
    );
  }

  useEffect(() => {
    fetchAllDevice();
  }, [
    numOfPage,
    sortCreatedAt,
    values.search_device,
    filterByPermission,
    filterByisSaveData,
  ]);

  const hookDeleteSuccess = () => {
    fetchAllDevice();
  };

  return (
    <Wrapper>
      <AccountUserDrawer
        isAccountUserDrawerOpen={isAccountUserDrawerOpen}
        setIsAccountUserDrawerOpen={setIsAccountUserDrawerOpen}
      />
      <ConfirmDelete
        hookDeleteSuccess={hookDeleteSuccess}
        selectedDevice={selectedDevice}
        isDeleteConfirmOpen={isDeleteConfirmOpen}
        setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
      />
      <EditDeviceDialog
        selectedDevice={selectedDevice}
        isEditDialogOpen={isEditDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
      />
      <BigNavbar
        isAccountUserDrawerOpen={isAccountUserDrawerOpen}
        setIsAccountUserDrawerOpen={setIsAccountUserDrawerOpen}
        setIsSidebarShow={setIsSidebarShow}
        isSidebarShow={isSidebarShow}
      />
      <div className="flex h-[100vh]">
        <NavLinkSidebar isSidebarShow={isSidebarShow} />
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
            <div id="title-outlet" className="text-[23px] text-[#1d4469] font-bold mb-10">
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
                <IoSearchOutline className="absolute text-[#1d4469] end-0 text-[20px]" />
              </div>
              <div className="flex gap-3 sm:w-[100%] ">
                <div className="pb-2 sm:w-[100%]">
                  <select
                    id="countries"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-5 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    defaultValue={sortCreatedAt}
                    onChange={(e) => {
                      setSortCreatedAt(e.target.value);
                    }}
                  >
                    <option value="-createdAt">Sort by Date</option>
                    <option value="%2BcreatedAt">Oldest</option>
                    <option value="-createdAt">Latest</option>
                  </select>
                </div>
                <div className="pb-2 sm:w-[100%]">
                  <select
                    id="countries"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-5 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    defaultValue={filterByPermission}
                    onChange={(e) => {
                      setFilterByPermission(e.target.value);
                    }}
                  >
                    <option value="">Permission</option>
                    <option value="allow">Permission Allow</option>
                    <option value="deny">Permission Deny</option>
                  </select>
                </div>
                <div className="pb-2 sm:w-[100%]">
                  <select
                    id="countries"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-5 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    defaultValue={filterByisSaveData}
                    onChange={(e) => {
                      if (!e.target.value) {
                        return;
                      }
                      setFilterByIsSaveData(e.target.value);
                    }}
                  >
                    <option value="">isSaveData</option>
                    <option value="true">isSave ON</option>
                    <option value="false">isSave OFF</option>
                  </select>
                </div>
              </div>
            </div>

            {(devices.length === 0 && !isLoading) && (
              <div className="text-[80px] flex justify-center w-[100%] my-5 text-[#c0c0c0]">
                {" "}
                <MdSearchOff />
              </div>
            )}
            {(devices.length === 0 && !isLoading) && (
              <div className="text-md text-center w-[100%] my-5 text-[#c0c0c0]">
                {" "}
                Not found any device
              </div>
            )}

            {isLoading && <div className="w-[100%] flex justify-center h-[165px] items-center">
                <div className="loader"></div>
              </div>}

            <div
              className={`overflow-auto rounded-lg shadow block sm:shadow-none ${devices.length === 0 && "hidden"
                }`}
            >
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
                      Registration
                    </th>
                    <th className=" w-[20%]  text-center text-sm font-semibold tracking-wide ">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y divide-gray-100 `}>
                  {devices.length > 0 &&
                    devices.map((i, index) => {
                      return (
                        <tr
                          key={index}
                          className="sm:flex sm:flex-col sm:my-5 sm:border-[1px] sm:rounded-lg sm:shadow-md overflow-hidden hover:bg-[#ddd] sm:hover:bg-[#fff] hover:shadow-lg transition ease-in delay-10"
                        >
                          <td
                            className={`cursor-pointer flex sm:hidden items-center justify-center capitalize p-3 text-[13px] select-none ${i.permission === "allow"
                              ? "text-green-500"
                              : "text-red-500"
                              } whitespace-nowrap text-center sm:text-start sm:bg-[#1966fb] sm:text-white`}
                            onClick={() => {
                              onTogglePermission(
                                i.id,
                                i.permission === "allow" ? "deny" : "allow"
                              );
                            }}
                            id="toggle-activity-desktop"
                          >
                            <button
                              className={`w-[8px] h-[8px] ${i.permission === "allow"
                                ? "bg-green-500"
                                : "bg-red-500"
                                } rounded-full mr-2`}
                            ></button>
                            {i.permission}
                          </td>

                          <td
                            onClick={() => {
                              navigate(`/device/${i.id}`);
                            }}
                            className="p-3 cursor-pointer text-sm text-[#878787] whitespace-nowrap text-center sm:text-start sm:bg-[#1966fb] sm:text-white"
                          >
                            {i.nameDevice}
                          </td>

                          <td
                            className={`hidden items-center sm:flex capitalize p-3 text-[13px] ${i.permission === "allow"
                              ? "text-green-500"
                              : "text-red-500"
                              } whitespace-nowrap text-center sm:text-start`}
                            onClick={() => {
                              onTogglePermission(
                                i.id,
                                i.permission === "allow" ? "deny" : "allow"
                              );
                            }}
                            id="toggle-activity-mobile"
                          >
                            <div
                              className={`w-[8px] h-[8px] ${i.permission === "allow"
                                ? "bg-green-500"
                                : "bg-red-500"
                                } rounded-full mr-2`}
                            ></div>
                            {i.permission}
                          </td>

                          <td className="p-3 text-sm text-[#878787] whitespace-nowrap text-center sm:text-start">
                            <div className="font-bold hidden mr-3 sm:mb-2 sm:block text-gray-600">
                              Save
                            </div>
                            <SwitchSave
                              checked={i.isSaveData}
                              id={i.id + "-switch-save"}
                              onClick={() =>
                                onToggleSwitchSave({
                                  id: i.id,
                                  save: !i.isSaveData,
                                })
                              }
                            />
                          </td>
                          <td className="p-3 text-sm text-[#878787] whitespace-nowrap text-center sm:text-start">
                            <div className="font-bold hidden mr-3 sm:mb-2 sm:block text-gray-600">
                              Registration
                            </div>
                            {moment(i.createdAt)
                              .add(543, "year")
                              .format("DD/MM/YYYY h:mm")}
                          </td>
                          <td className="p-3 text-sm text-[#878787] whitespace-nowrap text-center sm:text-start">
                            <div className="font-bold hidden mr-3 sm:mb-2 sm:block text-gray-600">
                              Action
                            </div>
                            <div className="flex justify-center sm:justify-start">
                              <button
                                onClick={() => {
                                  setSelectedDevice(i.id);
                                  setEditDialogOpen(true);
                                }}
                                className="mr-6 text-[#2E7D32]"
                                id={i.id + "-edit-device-btn"}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedDevice(i.id);
                                  setIsDeleteConfirmOpen(!isDeleteConfirmOpen);
                                }}
                                className="text-[#dc3546]"
                                id={i.id + "-delete-device-btn"}
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
            {pageCount > 1 && (
              <div className="flex justify-end items-center w-[100%] mt-4 sm:flex-col">
                <div className="mr-3 sm:mb-3 text-[12.4px]">1-5 of items</div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (numOfPage > 1) {
                        setNumOfPage(numOfPage - 1);
                      }
                    }}
                    className="cursor-pointer border-[1px] text-[#7a7a7a] border-[#cccccc] rounded-md w-[30px] h-[30px] flex items-center justify-center"
                  >
                    {"<"}
                  </button>
                  {elements}
                  <button
                    onClick={() => {
                      if (numOfPage < pageCount) {
                        setNumOfPage(numOfPage + 1);
                      }
                    }}
                    className="cursor-pointer border-[1px] text-[13.5px] text-[#7a7a7a] border-[#cccccc] rounded-md w-[30px] h-[30px] flex items-center justify-center"
                  >
                    {">"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default DeviceList;
