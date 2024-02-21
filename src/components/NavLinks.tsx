

import { FiCpu } from "react-icons/fi";
import { PiNotebookBold } from "react-icons/pi";
import { VscGraph } from "react-icons/vsc";
import { NavLink } from "react-router-dom";

const NavLinks = () => {

    return (
        <div className="bg-[#fff] w-[300px] pt-5 h-[100vh] shadow-sm flex flex-col sm:hidden">
            <div className="flex flex-col">
                <NavLink
                    to="/"
                    key={1}
                    onClick={() => {

                    }}
                    className={({ isActive }) =>
                        `flex pl-10 p-5 items-center text-[14px] ${isActive ? "text-[#1966fb]" : "text-[#1d4469]"}`
                    }
                >
                    <PiNotebookBold className="mr-3 text-[16px]" />
                    Overview
                </NavLink>

                <NavLink
                    to="/dashboard"
                    key={1}
                    onClick={() => {

                    }}
                    className={({ isActive }) =>
                        `flex pl-10 p-5 items-center text-[14px] ${isActive ? "text-[#1966fb]" : "text-[#1d4469]"}`
                    }
                >
                    <VscGraph className="mr-3 text-[16px]" />
                    Dashboard
                </NavLink>

                <NavLink
                    to="/device"
                    key={1}
                    onClick={() => {

                    }}
                    className={({ isActive }) =>
                        `flex pl-10 p-5 items-center text-[14px] ${isActive ? "text-[#1966fb]" : "text-[#1d4469]"}`
                    }
                >
                    <FiCpu className="mr-3 text-[16px]" />
                    Devices
                </NavLink>
            </div>
        </div>
    )
};

export default NavLinks;
