import { useEffect } from "react";
import { RiMenu2Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

interface IProps {
  setIsAccountUserDrawerOpen: (active: boolean) => void;
  isAccountUserDrawerOpen: boolean;
  setIsSidebarShow:(active:boolean)=>void
  isSidebarShow:boolean
}

function BigNavbar(props: IProps) {
  const navigate = useNavigate();
  const { user } = useAppSelector(state=>state.auth)
  
  useEffect(()=>{
    console.log(user);
  },[])
  return (
    <div className="bg-[#fff] w-[100%] p-3 flex justify-between shadow-sm items-center">
      <div className="flex item-center transition-all">
      <button
        onClick={() => {
          navigate("/home");
        }}
        className={`text-[#1d4469] font-bold text-[25px] ${!props.isSidebarShow ? "ml-[-5.9rem]" : "ml-[5.5rem]"} flex justify-center sm:pl-2 transition-all sm:ml-0`}
      >
        WR
      </button>
      <button onClick={()=>{
        props.setIsSidebarShow(!props.isSidebarShow)
      }}className="text-[23px] ml-[7rem] left-[15rem] p-[0.5rem] hover:text-[#1966fb] text-[#818181] cursor-pointer sm:hidden">
      <RiMenu2Fill/>
      </button>
      </div>
      <div className=" flex items-center pr-[3rem] sm:pr-2">
        <div className="text-[13.5px] sm:hidden text-[#1d4469]">{user?.username}</div>
        <img
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
  );
}

export default BigNavbar;
