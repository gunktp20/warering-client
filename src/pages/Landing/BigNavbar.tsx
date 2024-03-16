import { FunctionComponent } from "react";
import Wrapper from "../../assets/wrappers/Landing/BigNavbar";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { clearAlert } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

interface IBigNavbar {
  setIsDrawerOpen: (active: boolean) => void;
  setIsMember: (member: boolean) => void;
  isAccountUserDrawerOpen: boolean;
  setIsAccountUserDrawerOpen: (_: boolean) => void
}

const BigNavbar: FunctionComponent<IBigNavbar> = (props: IBigNavbar) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const onSelectEndpoint = (endPoint: "login" | "register") => {
    const isMember = endPoint === "login" ? true : false;
    props.setIsDrawerOpen(true);
    props.setIsMember(isMember);
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
              id="project-btn"
              onClick={() => {
                navigate("/");
              }}
              className="mr-4 text-sm px-8 bg-[#1966fb] py-2 rounded-md text-white"
            >
              Project
            </button>
            <div className=" flex items-center sm:pr-2">
              <div className="text-[13.5px] sm:hidden text-[#1d4469]">{user?.username}</div>
              <img
                id="account-user-drawer-toggle"
                src={
                  "https://www.wilsoncenter.org/sites/default/files/media/images/person/james-person-1.jpg"
                }
                className="ml-5 w-[42px] h-[42px] object-cover rounded-[100px]"
                onClick={() => {
                  props.setIsAccountUserDrawerOpen(!props.isAccountUserDrawerOpen);
                }}
              ></img>
            </div>
          </div>
        )}
        {!user && (
          <div className="flex items-center">
            <button
              id="open-big-register-drawer"
              className="text-[#20476b] cursor-pointer border-r-[#20476b] border-solid border-r-[2px] h-[60%] rp-[0.5rem] pl-[2rem] pr-[1.8rem] transition-[0.1s]"
              onClick={() => {
                onSelectEndpoint("register");
              }}
            >
              Sign Up
            </button>
            <button
              id="open-big-login-drawer"
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
