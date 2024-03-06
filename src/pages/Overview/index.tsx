import { BigNavbar, NavLinkSidebar, AccountUserDrawer } from "../../components";
import Wrapper from "../../assets/wrappers/Overview";
import { GoCpu } from "react-icons/go";
import { NavDialog } from "../../components/";
import { RiMenu2Fill } from "react-icons/ri";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setDeviceOverview } from "../../features/device/deviceSlice";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { MdOutlineWifiOff } from "react-icons/md";
import { IoBan } from "react-icons/io5";

function Overview() {
  const dispatch = useAppDispatch();
  const axiosPrivate = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSidebarShow, setIsSidebarShow] = useState<boolean>(true);
  const { deviceOffline, deviceOnline, totalDevice, totalDeviceDeny } =
    useAppSelector((state) => state.device);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isAccountUserDrawerOpen, setIsAccountUserDrawerOpen] =
    useState<boolean>(false);

  const fetchDeviceOverview = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosPrivate.get(`/api/overview`);
      dispatch(setDeviceOverview(data));
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeviceOverview();
  }, []);

  useEffect(() => {
    const timeoutID = setInterval(() => {
      fetchDeviceOverview();
    }, 1000);

    return () => {
      clearInterval(timeoutID);
    };
  }, []);

  return (
    <Wrapper>
      <AccountUserDrawer
        isAccountUserDrawerOpen={isAccountUserDrawerOpen}
        setIsAccountUserDrawerOpen={setIsAccountUserDrawerOpen}
      />
      <BigNavbar
        isAccountUserDrawerOpen={isAccountUserDrawerOpen}
        setIsAccountUserDrawerOpen={setIsAccountUserDrawerOpen}
        setIsSidebarShow={setIsSidebarShow}
        isSidebarShow={isSidebarShow}
      />
      <div className="flex h-[100vh]">
        <NavLinkSidebar
          isSidebarShow={isSidebarShow}
        />
        <NavDialog
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
        />
        <div className="m-[3rem] top-[4rem] w-[100%] flex h-fit flex-col">
          <button
            onClick={() => {
              setIsDrawerOpen(true);
            }}
            className="hidden p-1 w-fit h-fit relative sm:block text-[#8f8f8f] mb-6"
            id="small-open-sidebar-btn"
          >
            <RiMenu2Fill className="text-[23px]" />
          </button>

          <div className="text-[23px] text-[#1d4469] font-bold mb-10">
            Overview
          </div>
          <div className="grid w-[100%] gap-[3rem] grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 ">
            <div className="w-[100%] device-status border-solid border-t-[4px] border-[#45a2f9] h-fit p-3 pl-5 bg-[#fff] shadow-md">
              <div className="mb-2 text-[#1966fb]">All Device</div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="text-[30px] text-[#1966fb]">
                    {totalDevice ? totalDevice : "0"}
                  </div>
                  <div>
                    <GoCpu className="text-[25px] text-[#45a2f9]" />
                  </div>
                </div>
                <div className="text-[13px] text-[#7a7a7a]">
                  SN: Device0001 - 2024-01-07 12:57:46
                </div>
              </div>
            </div>

            <div className="w-[100%] device-status border-solid border-t-[4px] border-[#2e7d32] h-fit p-3 pl-5 bg-[#fff] shadow-md">
              <div className="mb-2 text-[#2e7d32]">Online Device</div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="text-[30px] text-[#2e7d32]">
                    {deviceOnline ? deviceOnline : "0"}
                  </div>
                  <div>
                    <HiOutlineStatusOnline className="text-[25px] text-[#2e7d32]" />
                  </div>
                </div>
                <div className="text-[13px] text-[#7a7a7a]">
                  SN: Device0001 - 2024-01-07 12:57:46
                </div>
              </div>
            </div>
            <div className="w-[100%] device-status border-solid border-t-[4px] border-[#7a7a7a] h-fit p-3 pl-5 bg-[#fff] shadow-md">
              <div className="mb-2 text-[#7a7a7a]">Offline Device</div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="text-[30px] text-[#7a7a7a]">
                    {deviceOffline ? deviceOffline : "0"}
                  </div>
                  <div>
                    <MdOutlineWifiOff className="text-[25px] text-[#7a7a7a]" />
                  </div>
                </div>
                <div className="text-[13px] text-[#7a7a7a]">
                  SN: Device0001 - 2024-01-07 12:57:46
                </div>
              </div>
            </div>

            <div className="w-[100%] device-status border-solid border-t-[4px] border-[#dc3546] h-fit p-3 pl-5 bg-[#fff] shadow-md">
              <div className="mb-2 text-[#dc3546]">Denied Device</div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="text-[30px] text-[#dc3546]">
                    {totalDeviceDeny ? totalDeviceDeny : "0"}
                  </div>
                  <div>
                    <IoBan className="text-[25px] text-[#dc3546]" />
                  </div>
                </div>
                <div className="text-[13px] text-[#7a7a7a]">
                  SN: Device0001 - 2024-01-07 12:57:46
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default Overview;
