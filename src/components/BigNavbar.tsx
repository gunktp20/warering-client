import { RiMenu2Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import userAvatar from "../assets/images/user-avatar.png";
import { useEffect, memo } from "react";

interface IProps {
  setIsAccountUserDrawerOpen: (active: boolean) => void;
  isAccountUserDrawerOpen: boolean;
  setIsSidebarShow: (active: boolean) => void;
  isSidebarShow: boolean;
}

function BigNavbar(props: IProps) {
  const navigate = useNavigate();
  const { user, profileImg, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {}, []);

  return (
    <div className="bg-[#fff] w-[100%] p-3 flex justify-between shadow-sm items-center">
      <div className="flex item-center transition-all">
        <button
          onClick={() => {
            navigate("/home");
          }}
          className={`text-[#1d4469] font-bold text-[25px] ${
            !props.isSidebarShow ? "ml-[-5.9rem]" : "ml-[5.5rem]"
          } flex justify-center sm:pl-2 transition-all sm:ml-0`}
        >
          WR
        </button>
        <button
          id="toggle-big-sidebar-btn"
          onClick={() => {
            props.setIsSidebarShow(!props.isSidebarShow);
          }}
          className="text-[23px] ml-[7rem] left-[15rem] p-[0.5rem] hover:text-[#1966fb] text-[#818181] cursor-pointer sm:hidden"
        >
          <RiMenu2Fill />
        </button>
      </div>
      <div className=" flex items-center pr-[3rem] sm:pr-2">
        {isLoading && <div className="loader w-[20px] h-[20px]"></div>}
        <div
          onClick={() => {
            if (isLoading) {
              return;
            }
            props.setIsAccountUserDrawerOpen(!props.isAccountUserDrawerOpen);
          }}
          className="text-[13.5px] sm:hidden text-[#1d4469] font-semibold text-nowrap cursor-pointer"
        >
          {isLoading ? "loading..." : user?.username}
        </div>
        {isLoading ? (
          <div className="loader w-[23px] h-[23px]"></div>
        ) : (
          <img
            src={profileImg ? profileImg : userAvatar}
            onClick={() => {
              if (isLoading) {
                return;
              }
              props.setIsAccountUserDrawerOpen(!props.isAccountUserDrawerOpen);
            }}
            className={`cursor-pointer ml-4 w-[42px] h-[42px]text-[#dbdbdb] rounded-[100%] ${
              profileImg ? "opacity-100 object-cover object-top" : "opacity-60"
            }`}
          ></img>
        )}
      </div>
    </div>
  );
}

export default memo(BigNavbar);
