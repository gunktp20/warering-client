import {
  BigNavbar,
  FormRow,
  NavLinkSidebar,
  NavDialog,
  AccountUserDrawer,
  SnackBar,
} from "../../components";
import Wrapper from "../../assets/wrappers/DeviceList";
import { useEffect, useRef, useState } from "react";
import { RiMenu2Fill } from "react-icons/ri";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditDeviceDialog from "./EditDeviceDialog";
import ConfirmDelete from "./ConfirmDeleteDevice";
import SwitchSave from "./SwitchSave";
import { IoSearchOutline } from "react-icons/io5";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { setDevices, setSelectedDevice, clearAlert as clearDevicesAlert } from "../../features/device/deviceSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { MdFilterAltOff, MdSearchOff } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import moment from "moment";
import useTimeout from "../../hooks/useTimeout";
import Pagination from "./Pagination";
import useAlert from "../../hooks/useAlert";
import Tooltip from "../../components/ToolTip";
import { IoMdCloseCircle } from "react-icons/io";

function DeviceList() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isFirstRender = useRef(true)
  const DeviceState = useAppSelector((state) => state.device);
  const { token } = useAppSelector((state) => state.auth);
  const { devices } = DeviceState
  const { showAlert, alertText, alertType, displayAlert } = useAlert()
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const axiosPrivate = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSidebarShow, setIsSidebarShow] = useState<boolean>(true);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);
  const [isAccountUserDrawerOpen, setIsAccountUserDrawerOpen] =
    useState<boolean>(false);
  const limitQuery: number = 5;
  const [numOfPage, setNumOfPage] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(0);
  const [sortCreatedAt, setSortCreatedAt] = useState<string>("");
  const [filterByPermission, setFilterByPermission] = useState<string>("");
  const [filterByisSaveData, setFilterByIsSaveData] = useState<string>("");

  const [values, setValues] = useState({
    search_device: "",
  });

  const onToggleSwitchSave = ({
    id,
    save,
  }: {
    id: string;
    save: boolean;
  }): void => {
    setIsSaveDevice(id, save);
  };

  const onTogglePermission = (id: string, permission: string) => {
    setDevicePermission(id, permission);
  };

  const { callHandler: callToggleSwitchSave } = useTimeout({
    executeAction: onToggleSwitchSave,
    duration: 1000,
  });

  const { callHandler: callTogglePermission } = useTimeout({
    executeAction: onTogglePermission,
    duration: 1000,
  });

  const setIsSaveDevice = async (deviceId: string, save: boolean) => {
    try {
      const { data } = await axiosPrivate.put(`/devices/store/${deviceId}`, {
        storeData: save,
      });
      setIsLoading(false);
      fetchAllDevice();
      setPageCount(data.metadata.pageCount);
    } catch (err: unknown) {
      setIsLoading(false);
    }
  };

  const clearFilter = () => {
    setSortCreatedAt("")
    setFilterByPermission("")
    setFilterByIsSaveData("")
  }

  const fetchAllDevice = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosPrivate.get(
        `/devices?limit=${limitQuery}&page=${numOfPage}&query=${values.search_device
        }&createdAt=${sortCreatedAt ? sortCreatedAt : "-createdAt"}${filterByPermission && "&permission=" + filterByPermission
        }${filterByisSaveData && "&isSaveData=" + filterByisSaveData}`
      );
      dispatch(setDevices(data.data));
      setIsLoading(false);
      setPageCount(data.metadata.pageCount);
      if ((data.metadata.pageCount === 1 && numOfPage !== 1) || (data.metadata.pageCount < numOfPage)) {
        setNumOfPage(1);
      }
    } catch (err: unknown) {
      setIsLoading(false);
    }
  };

  const { callHandler: callFetchAllDevice } = useTimeout({
    executeAction: fetchAllDevice,
    duration: 500,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const setDevicePermission = async (deviceId: string, permission: string) => {
    setIsLoading(true);
    try {
      await axiosPrivate.put(`/devices/permission/${deviceId}`, {
        permission: permission,
      });
      fetchAllDevice();
      setIsLoading(false);
    } catch (err: unknown) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllDevice();
    }
  }, [
    numOfPage,
    sortCreatedAt,
    values.search_device,
    filterByPermission,
    filterByisSaveData,
  ]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
    } else {
      callFetchAllDevice()
    }
  }, [values.search_device])

  useEffect(() => {
    if (DeviceState.showAlert) {
      setTimeout(() => {
        dispatch(clearDevicesAlert())
      }, 3000)
    }
  }, [])

  useEffect(() => {
    if (showAlert && DeviceState.showAlert) {
      dispatch(clearDevicesAlert())
    }
  }, [showAlert])

  const hookDeleteSuccess = () => {
    displayAlert({ msg: "Your device has been deleted", type: "error" })
    fetchAllDevice();
  };
  const hookEditSuccess = () => {
    displayAlert({ msg: "Your device information has been edited successfully", type: "success" })
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
        isDeleteConfirmOpen={isDeleteConfirmOpen}
        setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
      />
      <EditDeviceDialog
        isEditDialogOpen={isEditDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        hookEditSuccess={hookEditSuccess}
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
        <div className="m-[3rem] top-[4rem] w-[100%] flex h-fit flex-col sm:m-0 sm:my-[3rem] sm:mx-[1rem]">
          <button
            onClick={() => {
              setIsDrawerOpen(true);
            }}
            className="hidden p-1 w-fit h-fit relative sm:block text-[#8f8f8f] mb-6"
            id="toggle-nav-links-dialog-btn"
          >
            <RiMenu2Fill className="text-[23px]" />
          </button>

          <div className="flex w-[100%] justify-between">
            <div
              id="title-outlet"
              className="text-[23px] text-[#1d4469] font-bold mb-10"
            >
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
                {values.search_device !== "" ? <IoMdCloseCircle onClick={() => setValues({ ...values, search_device: "" })} className=" cursor-pointer absolute text-[#1d4469] end-0 text-[20px] bottom-[26px]" /> : <IoSearchOutline className="absolute text-[#1d4469] end-0 text-[20px] bottom-[26px]" />}

              </div>
              <div className="flex gap-3 sm:w-[100%] ">
                <div className="pb-2 sm:w-[100%]">
                  <select
                    id="sort-by-date-select"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full px-5 py-2 "
                    onChange={(e) => {
                      setSortCreatedAt(e.target.value);
                    }}
                    value={sortCreatedAt}
                  >
                    <option value="">Sort by Date</option>
                    <option value="%2BcreatedAt">Oldest</option>
                    <option value="-createdAt">Latest</option>
                  </select>
                </div>
                <div className="pb-2 sm:w-[100%]">
                  <select
                    id="filter-by-permission-select"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-5 py-2 "
                    onChange={(e) => {
                      setFilterByPermission(e.target.value);
                    }}
                    value={filterByPermission}
                  >
                    <option value="">Permission</option>
                    <option value="allow">Permission Allow</option>
                    <option value="deny">Permission Deny</option>
                  </select>
                </div>
                <div className="pb-2 sm:w-[100%]">
                  <select
                    id="filter-by-is-save-data-select"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-5 py-2 "
                    onChange={(e) => {
                      setFilterByIsSaveData(e.target.value);
                    }}
                    value={filterByisSaveData}
                  >
                    <option value="">isSaveData</option>
                    <option value="true">isSave ON</option>
                    <option value="false">isSave OFF</option>
                  </select>
                </div>
                <div className="sm:hidden block pb-2 sm:w-[100%]">
                  <Tooltip text="ClearFilter">
                    <button
                      onClick={clearFilter}
                      id="clear-filter-desktop-btn"
                      className=" text-gray-400 hover:bg-primary-800 hover:text-white text-sm rounded-lg transition-all h-[100%] focus:ring-blue-500 focus:border-gray-500 block py-2 px-[9px] w-fit"
                    >
                      <MdFilterAltOff className="text-[20px]" />
                    </button>
                  </Tooltip>
                </div>

              </div>
              {/* clear filter mobile screen button */}
              <div className="pb-2 hidden sm:w-[100%] sm:block mt-1 ">
                <Tooltip text="ClearFilter">
                  <button
                    onClick={clearFilter}
                    id="clear-filter-mobile-screen-btn"
                    className=" text-gray-400 hover:bg-primary-800 hover:text-white text-sm rounded-lg transition-all h-[100%] focus:ring-blue-500 focus:border-gray-500 block py-2 px-[9px] w-fit"
                  >
                    <MdFilterAltOff className="text-[20px]" />
                  </button>
                </Tooltip>
              </div>
            </div>

            {devices.length === 0 && !isLoading && (
              <div className="text-[80px] flex justify-center w-[100%] my-5 text-[#c0c0c0]">
                {" "}
                <MdSearchOff />
              </div>
            )}
            {devices.length === 0 && !isLoading && (
              <div className="text-md text-center w-[100%] my-5 text-[#c0c0c0]">
                {" "}
                Not found any device
              </div>
            )}

            {isLoading && devices.length <= 0 && (
              <div className="w-[100%] flex justify-center  h-[165px] items-center">
                <div className="loader w-[50px] h-[50px] border-blue-200 border-b-transparent"></div>
              </div>
            )}

            <div
              className={`overflow-auto rounded-lg shadow block sm:shadow-none ${devices.length === 0 && "hidden"
                }`}
            >
              <table className="w-ful overflow-clip">
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
                    devices.map((device, index) => {
                      return (
                        <tr
                          key={index}
                          className="sm:flex sm:flex-col sm:my-5 sm:border-[1px] sm:rounded-lg sm:shadow-md overflow-hidden hover:bg-[#ddd] sm:hover:bg-[#fff] hover:shadow-lg transition ease-in delay-10"
                        >
                          <td
                            className={`cursor-pointer flex sm:hidden items-center justify-center capitalize p-3 text-[13px] select-none ${device.permission === "allow"
                              ? "text-green-500"
                              : "text-red-500"
                              } whitespace-nowrap text-center sm:text-start sm:bg-[#1966fb] sm:text-white`}
                            id={`toggle-activity-desktop-${device.id}`}
                          >
                            <Tooltip text="Toggle activity between allow , deny">
                              <button
                                onClick={() => {
                                  callTogglePermission(
                                    device.id,
                                    device.permission === "allow" ? "deny" : "allow"
                                  );
                                }}
                                className={`flex items-center justify-center gap-1 transition-all capitalize cursor-pointer border-[1px] ${isLoading ? "cursor-wait" : "cursor-pointer"
                                  } ${device.permission === "allow"
                                    ? "hover:bg-green-500 hover:text-white border-green-500"
                                    : "hover:bg-red-500 hover:text-white border-red-500"
                                  } px-2 rounded-lg`}
                                disabled={isLoading}
                              >
                                <GoDotFill />
                                {device.permission}
                              </button>
                            </Tooltip>

                          </td>

                          <td
                            onClick={() => {
                              navigate(`/device/${device.id}`);
                            }}
                            className="p-3 cursor-pointer text-sm text-[#878787] whitespace-nowrap text-center sm:text-start sm:bg-[#1966fb] sm:text-white"
                          >
                            {device.nameDevice}
                          </td>

                          <td
                            className={`hidden items-center sm:flex cursor-pointer capitalize p-3 text-[13px] ${device.permission === "allow"
                              ? "text-green-500"
                              : "text-red-500"
                              } whitespace-nowrap text-center sm:text-start`}
                            onClick={() => {
                              callTogglePermission(
                                device.id,
                                device.permission === "allow" ? "deny" : "allow"
                              );
                            }}
                            id={`toggle-activity-mobile-${device.id}`}
                          >
                            <Tooltip text="toggle permission between allow , deny ">
                              <button
                                onClick={() => {
                                  callTogglePermission(
                                    device.id,
                                    device.permission === "allow" ? "deny" : "allow"
                                  );
                                }}
                                className={`flex items-center justify-center gap-1 transition-all capitalize cursor-pointer border-[1px] ${device.permission === "allow"
                                  ? "hover:bg-green-500 hover:text-white border-green-500"
                                  : "hover:bg-red-500 hover:text-white border-red-500"
                                  } px-2 rounded-lg`}
                              >
                                <GoDotFill />
                                {device.permission}
                              </button>
                            </Tooltip>
                          </td>

                          <td className="p-3 text-sm text-[#878787] whitespace-nowrap text-center sm:text-start">
                            <div className="font-bold hidden mr-3 sm:mb-2 sm:block text-gray-600">
                              Save
                            </div>
                            <Tooltip text="toggle is save data of device">
                              <SwitchSave
                                checked={device.isSaveData}
                                id={device.id + "-switch-save"}
                                onClick={() =>
                                  callToggleSwitchSave({
                                    id: device.id,
                                    save: !device.isSaveData,
                                  })
                                }
                              />
                            </Tooltip>
                          </td>
                          <td onClick={() => {
                            navigate(`/device/${device.id}`);
                          }} id={`registration-${device.id}`} className="p-3 text-sm text-[#878787] whitespace-nowrap text-center sm:text-start cursor-pointer">
                            <div className="font-bold hidden mr-3 sm:mb-2 sm:block text-gray-600">
                              Registration
                            </div>
                            {moment(device.createdAt)
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
                                  dispatch(setSelectedDevice(device.id ? device.id : ""))
                                  setEditDialogOpen(true);
                                }}
                                className="mr-6 text-[#2E7D32] hover:bg-[#2E7D32] hover:text-white transition-all rounded-md py-1 px-2"
                                id={device.id + "-edit-device-btn"}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  dispatch(setSelectedDevice(device.id ? device.id : ""))
                                  setIsDeleteConfirmOpen(true)
                                }}
                                className="text-[#dc3546] hover:bg-[#dc3546] hover:text-white transition-all rounded-md py-1 px-2"
                                id={device.id + "-delete-device-btn"}
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
            <Pagination numOfPage={numOfPage} pageCount={pageCount} setNumOfPage={setNumOfPage} />
          </div>
        </div>
        {showAlert && (
          <div className="block sm:hidden">
            <SnackBar
              id="devices-list-snackbar"
              severity={alertType}
              showSnackBar={showAlert}
              snackBarText={alertText}
            />
          </div>
        )}
        {DeviceState.showAlert && (
          <div className="block sm:hidden">
            <SnackBar
              id="devices-device-state-list-snackbar"
              severity={DeviceState.alertType}
              showSnackBar={DeviceState.showAlert}
              snackBarText={DeviceState.alertText}
            />
          </div>
        )}
      </div>
    </Wrapper >
  );
}

export default DeviceList;
