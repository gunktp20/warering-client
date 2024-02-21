import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout } from "../../features/auth/authSlice";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { BigNavbar, FormRow, NavLinks, SmallNavLink } from "../../components";
import Wrapper from "../../assets/wrappers/Dashboard";
import { GoCpu } from "react-icons/go";
import { useState } from "react";
import { RiMenu2Fill } from "react-icons/ri";
FormRow;

function Dashboard() {
  const dispatch = useAppDispatch();
  const axiosPrivate = useAxiosPrivate();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isMember, setIsMember] = useState<boolean>(true);
  const { user, token } = useAppSelector((state) => state.auth);

  const [values, setValues] = useState({
    search_dashboard: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

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
      <BigNavbar />
      <div className="flex">
        <NavLinks />
        <SmallNavLink
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          setIsMember={setIsMember}
          isMember={isMember}
        />
        <div className="m-[3rem] relative top-[4rem] w-[100%] h-fit grid gap-[3rem] grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 sm:top-[5rem] bg-white shadow-md p-5 rounded-md">
          <button
            onClick={() => {
              setIsDrawerOpen(true);
            }}
            className="hidden p-1 w-fit h-fit left-[0rem] absolute sm:block top-[-7rem] text-[#8f8f8f]"
            id="small-open-sidebar-btn"
          >
            <RiMenu2Fill className="text-[23px]" />
          </button>
          <div className="absolute top-[-4rem] text-[23px] text-[#1d4469] font-bold">
            Dashboard List
          </div>
          <FormRow
            type="text"
            name="search_dashboard"
            labelText="search dashboard"
            value={values.search_dashboard}
            handleChange={handleChange}
          />
        </div>
      </div>
    </Wrapper>
  );
}

export default Dashboard;
