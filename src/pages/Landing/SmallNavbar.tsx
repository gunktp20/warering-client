import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import Wrapper from "../../assets/wrappers/Landing/SmallNavbar";
import userAvatar from "../../assets/images/user-avatar.png"

interface ISmallNavbar {
  setIsDrawerOpen: (active: boolean) => void;
  setIsMember: (member: boolean) => void;
  isAccountUserDrawerOpen: boolean;
  setIsAccountUserDrawerOpen: (status: boolean) => void
}

function SmallNavbar(props: ISmallNavbar) {
  const isLoading = false
  const { user, profileImg } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  return (
    <Wrapper className="w-[100%] fixed h-[80px] flex justify-center bg-white p-5 shadow-md z-10">
      <div className="flex justify-between w-[95%] items-center">
        <div className="flex items-center">
          <div className="font-bold text-[20px] text-[#1D4469] mr-6">WR</div>
        </div>
        {user ? (
          <div className="flex items-center">
            <button
              id="small-navbar-project-btn"
              onClick={() => {
                navigate("/");
              }}
              className="mr-4 text-sm px-8 bg-[#1966fb] py-2 rounded-md text-white"
            >
              Project
            </button>
            <div onClick={() => {
              if (isLoading) {
                return;
              }

              props.setIsAccountUserDrawerOpen(!props.isAccountUserDrawerOpen);
            }}
              id="username-small-navbar-btn" className=" cursor-pointer text-sm mr-3 text-[#303030]">{user?.username}</div>
            {isLoading ? (
              <div className="loader w-[23px] h-[23px]"></div>
            ) : (
              <img
                src={profileImg ? profileImg : userAvatar}
                id="profile-img-toggle-account-user-small-navbar-btn"
                onClick={() => {
                  if (isLoading) {
                    return;
                  }
                  props.setIsAccountUserDrawerOpen(!props.isAccountUserDrawerOpen);
                }}
                className={`cursor-pointer ml-4 w-[42px] h-[42px]text-[#dbdbdb] rounded-[100%] ${profileImg ? "opacity-100 object-cover object-top" : "opacity-60"
                  }`}
              ></img>
            )}
          </div>
        ) : (
          <button
            onClick={() => {
              props.setIsDrawerOpen(true);
            }}
            id="toggle-setup-user-small-navbar-btn"
            className="flex border-[1px] border-[#1D4469] p-2 pr-5 pl-5 rounded-[100px]"
          >
            <div className="border-r-[1px] border-[#1D4469] pr-5 mr-5">
              Sign Up
            </div>
            <div>Sign In</div>
          </button>
        )}
      </div>
    </Wrapper>
  );
}

export default SmallNavbar;
