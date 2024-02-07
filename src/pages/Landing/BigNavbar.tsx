import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import Wrapper from "../../assets/wrappers/Landing/BigNavbar";

interface IBigNavbar {
  setIsDrawerOpen: (active: boolean) => void;
  setIsMember : (member:boolean) => void
}

const BigNavbar: FunctionComponent<IBigNavbar> = (props: IBigNavbar) => {
  return (
    <Wrapper className="w-[100%] fixed h-fit flex justify-center bg-white p-5 shadow-md z-10">
      <div className="flex justify-between w-[70%]">
        <div className="flex items-center">
          <div className="font-bold text-[20px] text-[#1D4469] mr-6">WR</div>
          <div className="mr-5 ml-8 text-[#1D4469] cursor-pointer text-[16px]">
            Home
          </div>
          <div className="mr-5 ml-5 text-[#1D4469] cursor-pointer text-[16px]">
            Ecosystem
          </div>
          <Link
            to="/dashboard"
            className="mr-5 ml-5 text-[#0E4E6D] cursor-pointer text-[16px]"
          >
            Dashboard
          </Link>
        </div>
        <div className="flex items-center">
          <div
            className="text-[#20476b] cursor-pointer border-r-[#20476b] border-solid border-r-[2px] h-[60%] rp-[0.5rem] pl-[2rem] pr-[1.8rem] transition-[0.1s]"
            onClick={() => {
              props.setIsDrawerOpen(true)
              props.setIsMember(false)
            }
                            
            }
          >
            Sign Up
          </div>
          <div
            className="text-[#20476b] cursor-pointer border-solid border-[1px] ml-5 border-[#20476b] p-[0.4rem] pl-[1.8rem] pr-[1.8rem] rounded-[100px] hover:bg-[#20476b] hover:text-[#fff] transition-[0.1s]"
            onClick={() => {
              props.setIsDrawerOpen(true)
              props.setIsMember(true)
            }
            }
          >
            Sign In
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default BigNavbar;
