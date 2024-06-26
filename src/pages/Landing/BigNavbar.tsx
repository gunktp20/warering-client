import { FunctionComponent } from "react";
import Wrapper from "../../assets/wrappers/Landing/BigNavbar";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { clearAlert } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import userAvatar from "../../assets/images/user-avatar.png"

interface IBigNavbar {
  setIsDrawerOpen: (active: boolean) => void;
  setIsMember: (member: boolean) => void;
  isAccountUserDrawerOpen: boolean;
  setIsAccountUserDrawerOpen: (_: boolean) => void
}

const BigNavbar: FunctionComponent<IBigNavbar> = ({ setIsDrawerOpen, setIsMember, isAccountUserDrawerOpen, setIsAccountUserDrawerOpen }: IBigNavbar) => {
  const isLoading = false
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, profileImg } = useAppSelector((state) => state.auth);

  const onSelectEndpoint = (endPoint: "login" | "register") => {
    const isMember = endPoint === "login" ? true : false;
    setIsDrawerOpen(true);
    setIsMember(isMember);
    dispatch(clearAlert());
  };

  return (
    <Wrapper className="w-[100%] fixed h-[79px] flex justify-center bg-white shadow-md z-10">
      <div className="flex justify-between w-[70%] item-center">
        <div className="flex items-center">
          <div className="font-bold text-[20px] text-[#1D4469] mr-6">WR</div>
        </div>
        {user && (
          <div className="flex items-center">
            <button
              id="user-project-btn"
              onClick={() => {
                navigate("/");
              }}
              className="mr-4 text-sm px-8 bg-[#1966fb] py-2 rounded-md text-white"
            >
              Project
            </button>
            {isLoading && <div className="loader w-[20px] h-[20px]"></div>}
            <div
              onClick={() => {
                if (isLoading) {
                  return;
                }
                setIsAccountUserDrawerOpen(!isAccountUserDrawerOpen);
              }}
              id="username-toggle-account-user-drawer-btn"
              className="text-[13.5px] sm:hidden text-[#1d4469] font-semibold text-nowrap cursor-pointer"
            >
              {isLoading ? "loading..." : user?.username}
            </div>

            {isLoading ? (
              <div className="loader w-[23px] h-[23px]"></div>
            ) : (
              <img
                src={profileImg ? profileImg : userAvatar}
                id="profile-img-toggle-account-user-drawer-btn"
                onClick={() => {
                  if (isLoading) {
                    return;
                  }
                  setIsAccountUserDrawerOpen(!isAccountUserDrawerOpen);
                }}
                className={`cursor-pointer ml-4 w-[42px] h-[42px]text-[#dbdbdb] rounded-[100%] ${profileImg ? "opacity-100 object-cover object-top" : "opacity-60"
                  }`}
              ></img>
            )}
          </div>
        )}

        {!user && (
          <div className="flex items-center">
            <button
              id="toggle-big-register-landing-drawer-btn"
              className="text-[#20476b] cursor-pointer border-r-[#20476b] border-solid border-r-[2px] h-[60%] rp-[0.5rem] pl-[2rem] pr-[1.8rem] transition-[0.1s]"
              onClick={() => {
                onSelectEndpoint("register");
              }}
            >
              Sign Up
            </button>
            <button
              id="toggle-big-login-landing-drawer-btn"
              className="text-[#20476b] cursor-pointer border-solid border-[1px] ml-5 border-[#20476b] p-[0.4rem] pl-[1.8rem] pr-[1.8rem] rounded-[100px] hover:bg-[#20476b] hover:text-[#fff] transition-[0.1s]"
              onClick={() => {
                onSelectEndpoint("login");
              }}
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default BigNavbar;
