import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout } from "../../features/auth/authSlice";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { NavLinks } from "../../components"
import Wrapper from "../../assets/wrappers/Overview";
import { GoCpu } from "react-icons/go";

function Device() {
  const dispatch = useAppDispatch();
  const axiosPrivate = useAxiosPrivate();
  const { user, token } = useAppSelector((state) => state.auth);

  const signOut = async () => {
    dispatch(logout());
    await axiosPrivate.post(
      `/auth/logout`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  };

  return (
    <Wrapper>
      <div className="bg-[#fff] w-[100%] p-3 flex justify-between shadow-sm">
        <div className="text-[#1d4469] font-bold text-[25px] pl-[5.5rem] flex justify-center">
          WR
        </div>
        <div className=" flex items-center pr-[3rem]">
          <div className="text-[14.5px]">Kuttapat Somwang</div>
          <img
            src={"https://www.wilsoncenter.org/sites/default/files/media/images/person/james-person-1.jpg"}
            className="ml-5 w-[42px] h-[42px] object-cover rounded-[100px]"
          ></img>
        </div>
      </div>

      <div className="flex">
        <NavLinks />
        <div className="m-[3rem] relative top-[4rem] w-[100%] h-fit grid gap-[3rem] grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
          <div className="absolute top-[-4rem] text-[23px] text-[#1d4469] font-bold">
            Device
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default Device;
