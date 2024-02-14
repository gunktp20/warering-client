import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import Wrapper from "../assets/wrappers/Navbar";

const Navbar: FunctionComponent = () => {
  return (
    <Wrapper className="w-[100%] fixed h-fit flex justify-center bg-white p-5 shadow-md">
      <div className="flex justify-between w-[80%]">
        <div className="flex items-center">
          <div>WR</div>
          <div className="mr-5 ml-8 text-[#0E4E6D] cursor-pointer">Home</div>
          <div className="mr-5 ml-5 text-[#0E4E6D] cursor-pointer">
            Ecosystem
          </div>
          <Link
            to="/dashboard"
            className="mr-5 ml-5 text-[#0E4E6D] cursor-pointer"
          >
            Dashboard
          </Link>
        </div>
        <div className="flex items-center">
          <Link
            to="/login"
            className="text-[#208DA1] border-r-[#208ea171] border-solid border-r-[2px] h-[60%] rp-[0.5rem] pl-[2rem] pr-[1.8rem] transition-[0.1s]"
          >
            Sign Up
          </Link>
          <Link
            to="/register"
            className="text-[#208DA1] border-solid border-[1px] ml-5 border-[#208DA1] p-[0.5rem] pl-[1.8rem] pr-[1.8rem] rounded-[100px] hover:bg-[#208DA1] hover:text-[#fff] transition-[0.1s]"
          >
            Sign In
          </Link>
        </div>
      </div>
    </Wrapper>
  );
};

export default Navbar;
