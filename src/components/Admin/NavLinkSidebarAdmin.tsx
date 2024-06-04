import { NavLink } from "react-router-dom";
import { FaUserFriends } from "react-icons/fa";

interface IProp {
  isSidebarShow: boolean;
}

const NavLinkSidebarAdmin = (props: IProp) => {
  return (
    <div
      className={`bg-[#fff] h-[100v%] w-[300px] shadow-md pt-5 w-sm flex flex-col sm:hidden md:hidden transition-all ${!props.isSidebarShow && "ml-[-17.8rem]"
        }`}
    >
      <div className="flex flex-col">
        <NavLink
          to="/admin"
          id="user-list-nav-link-sidebar"
          key={1}
          onClick={() => { }}
          className={({ isActive }) =>
            `flex pl-10 p-3 items-center text-[14px] mx-3 rounded-md ${isActive
              ? "text-[#fff] bg-red-500 font-semibold"
              : "text-[#1d4469]"
            }`
          }
        >
          <FaUserFriends className="mr-3 text-[16px]" />
          User List
        </NavLink>
      </div>
    </div>
  );
};

export default NavLinkSidebarAdmin;
