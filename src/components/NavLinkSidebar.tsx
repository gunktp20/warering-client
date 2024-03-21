import { FiCpu } from "react-icons/fi";
import { PiNotebookBold } from "react-icons/pi";
import { VscGraph } from "react-icons/vsc";
import { NavLink } from "react-router-dom";

interface IProp {
  isSidebarShow:boolean,
}

const NavLinks = (props:IProp) => {
  
  return (
    <div className={`bg-[#fff] h-[100v%] w-[300px] shadow-md pt-5 w-sm flex flex-col sm:hidden transition-all ${!props.isSidebarShow && "ml-[-17.8rem]"}`}>
      <div className="flex flex-col">
        <NavLink
          to="/"
          id="overview-navlink-sidebar"
          key={1}
          onClick={() => {}}
          className={({ isActive }) =>
            `flex pl-10 p-5 items-center text-[14px] ${
              isActive ? "text-[#1966fb]" : "text-[#1d4469]"
            }`
          }
        >
          <PiNotebookBold className="mr-3 text-[16px]" />
          Overview
        </NavLink>
        <NavLink
          to="/dashboard-list"
          id="dashboard-navlink-sidebar"
          key={2}
          onClick={() => {}}
          className={({ isActive }) =>
            `flex pl-10 p-5 items-center text-[14px] ${
              isActive ? "text-[#1966fb]" : "text-[#1d4469]"
            }`
          }
        >
          <VscGraph className="mr-3 text-[16px]" />
          Dashboard
        </NavLink>

        <NavLink
          to="/device-list"
          key={3}
          id="device-navlink-sidebar"
          onClick={() => {}}
          className={({ isActive }) =>
            `flex pl-10 p-5 items-center text-[14px] ${
              isActive ? "text-[#1966fb]" : "text-[#1d4469]"
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

export default NavLinks;
