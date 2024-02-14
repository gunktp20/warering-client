import Wrapper from "../../assets/wrappers/Landing/SmallNavbar";

function SmallNavbar() {
  return (
    <Wrapper className="w-[100%] fixed h-[79px] flex justify-center bg-white p-5 shadow-md z-10">
      <div className="flex justify-between w-[95%] items-center">
        <div className="flex items-center">
          <div className="font-bold text-[20px] text-[#1D4469] mr-6">WR</div>
        </div>
        <button className="flex border-[1px] border-[#1D4469] p-2 pr-5 pl-5 rounded-[100px]">
            <div className="border-r-[1px] border-[#1D4469] pr-5 mr-5">Sign Up</div>
            <div>Sign In</div>
        </button>
      </div>
    </Wrapper>
  );
}

export default SmallNavbar;
