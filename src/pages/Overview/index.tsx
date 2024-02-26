import { BigNavbar, NavLinkSidebar, AccountUserDrawer } from "../../components";
import Wrapper from "../../assets/wrappers/Overview";
import { GoCpu } from "react-icons/go";
import { NavDialog } from "../../components/";
import { RiMenu2Fill } from "react-icons/ri";
import { useState } from "react";

function Overview() {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isAccountUserDrawerOpen, setIsAccountUserDrawerOpen] =
    useState<boolean>(false);

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
      <div className="flex h-[100vh]">
        <NavLinkSidebar />
        <NavDialog
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
        />
        <div className="m-[3rem] top-[4rem] w-[100%] h-fit grid gap-[3rem] grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 sm:top-[5rem]">
          <button
            onClick={() => {
              setIsDrawerOpen(true);
            }}
            className="hidden p-1 w-fit h-fit left-[0rem] absolute sm:block top-[-7rem] text-[#8f8f8f]"
            id="small-open-sidebar-btn"
          >
            <RiMenu2Fill className="text-[23px]" />
          </button>
          <div className="absolute top-[-4rem] text-[23px] text-[#1d4469] font-bold">
            Overview
          </div>
          <div className="w-[100%] device-status border-solid border-t-[4px] border-[#45a2f9] h-fit p-3 pl-5 bg-[#fff] shadow-md">
            <div className="mb-2 text-[#1966fb]">All Device</div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="text-[30px] text-[#1966fb]">3</div>
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
                <div className="text-[30px] text-[#2e7d32]">2</div>
                <div>
                  <GoCpu className="text-[25px] text-[#2e7d32]" />
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
                <div className="text-[30px] text-[#7a7a7a]">1</div>
                <div>
                  <GoCpu className="text-[25px] text-[#7a7a7a]" />
                </div>
              </div>
              <div className="text-[13px] text-[#7a7a7a]">
                SN: Device0001 - 2024-01-07 12:57:46
              </div>
            </div>
          </div>

          <div className="w-[100%] device-status border-solid border-t-[4px] border-[#dc3546] h-fit p-3 pl-5 bg-[#fff] shadow-md">
            <div className="mb-2 text-[#dc3546]">Not working Device</div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="text-[30px] text-[#dc3546]">0</div>
                <div>
                  <GoCpu className="text-[25px] text-[#dc3546]" />
                </div>
              </div>
              <div className="text-[13px] text-[#7a7a7a]">
                SN: Device0001 - 2024-01-07 12:57:46
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default Overview;
