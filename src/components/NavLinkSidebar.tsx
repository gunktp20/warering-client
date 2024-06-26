import { FiCpu } from "react-icons/fi";
import { PiNotebookBold } from "react-icons/pi";
import { VscGraph } from "react-icons/vsc";
import { NavLink, useNavigate } from "react-router-dom";

interface IProp {
  isSidebarShow: boolean;
  disableFixed?: boolean;
}

const NavLinkSidebar = (props: IProp) => {
  const navigate = useNavigate()

  return (
    <div
      id="nav-links-side-bar"
      className={`bg-[#fff] w-[300px] shadow-md pt-5 w-sm flex flex-col sm:hidden transition-all relative z-[1000] ${!props.isSidebarShow && "ml-[-17.8rem]"
        }`}
    >

      <div className={`flex flex-col ${props.disableFixed ? "" : "fixed"}`}>
        <button
          onClick={() => {
            navigate("/home");
          }}
          className={`text-[#1d4469] font-bold text-[25px] ${!props.isSidebarShow ? "ml-[-5.9rem]" : "ml-[5.5rem]"
            } flex sm:pl-2 transition-all sm:ml-0 fixed left-[0.77rem] h-[70px] justify-center top-0 pt-[13.5px] bg-white`}
        >
          WR
        </button>
        <NavLink
          to="/"
          id="overview-nav-link-sidebar"
          key={1}
          onClick={() => { }}
          className={({ isActive }) =>
            `flex pl-10 p-5 items-center text-[14px] font-semibold ${isActive ? "text-[#1966fb]" : "text-[#1d4469]"
            }`
          }
        >
          <PiNotebookBold className="mr-3 text-[16px]" />
          Overview
        </NavLink>
        <NavLink
          to="/dashboard-list"
          id="dashboard-nav-link-sidebar"
          key={2}
          onClick={() => { }}
          className={({ isActive }) =>
            `flex pl-10 p-5 items-center text-[14px] font-semibold ${isActive ? "text-[#1966fb]" : "text-[#1d4469]"
            }`
          }
        >
          <VscGraph className="mr-3 text-[16px]" />
          Dashboard
        </NavLink>

        <NavLink
          to="/device-list"
          key={3}
          id="devices-nav-link-sidebar"
          onClick={() => { }}
          className={({ isActive }) =>
            `flex pl-10 p-5 items-center text-[14px] font-semibold ${isActive ? "text-[#1966fb]" : "text-[#1d4469]"
            }`
          }
        >
          <FiCpu className="mr-3 text-[16px]" />
          Devices
        </NavLink>
      </div>
    </div>
  );
};

export default NavLinkSidebar;
