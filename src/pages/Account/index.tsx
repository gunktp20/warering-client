import { useEffect, useState } from "react";
import Wrapper from "../../assets/wrappers/Account";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteAccount from "./ConfirmDeleteAccount";
import { IoArrowBackSharp } from "react-icons/io5";
import { useAppSelector } from "../../app/hooks";
import { AccessTokenPayload } from "../../features/auth/types";
import { jwtDecode } from "jwt-decode";
import { AxiosError } from "axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import userAvatar from "../../assets/images/user-avatar.png";

const Account = () => {
  const navigate = useNavigate();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);

  const { token } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<{
    fname: string;
    lname: string;
    email: string;
    username: string;
  }>({
    fname: "",
    lname: "",
    email: "",
    username: "",
  });
  const axiosPrivate = useAxiosPrivate();
  const decoded: AccessTokenPayload | undefined = token
    ? jwtDecode(token)
    : undefined;

  const getUserInfo = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosPrivate.get(`/users/${decoded?.sub}`);
      setIsLoading(false);
      console.log(data);
      setUser(data);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const msg =
          typeof err?.response?.data?.msg === "object"
            ? err?.response?.data?.msg[0]
            : err?.response?.data?.msg;
        console.log(msg);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <Wrapper>
      <ConfirmDeleteAccount
        isDeleteConfirmOpen={isDeleteConfirmOpen}
        setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
      />
      <div className="bg-white py-[2rem] px-[3.1rem] h-fit w-[510px] border-[#f3f3f3] rounded-lg border-[1px] shadow-sm top-[10rem] absolute">
        <button
          onClick={() => {
            navigate("/");
          }}
          className="absolute top-[-2.5rem] flex cursor-pointer text-sm text-[#1D4469] font-bold items-center left-0 "
        >
          <IoArrowBackSharp className="text-sm" />
          Back
        </button>
        <div className="flex justify-start w-[100%] text-[22px] border-b-[1px] border-[#dfdfdf] text-[#1c1c1c] pb-5 font-semibold">
          Account
        </div>
        <div className=" w-[100%] flex items-center justify-between mt-6 sm:mt-8">
          <div className="text-[13.5px]">Email address</div>
          <div className="text-[#8b8b8b] text-[14px] mr-10">{user?.email}</div>
        </div>
        <div className=" w-[100%] flex items-center justify-between mt-6 sm:mt-8">
          <div className="text-[13.5px]">
            Profile Information
            <div className="text-[11px] text-[#cccccc] mt-1">
              Edit your photo, name , bio, etc
            </div>
          </div>
          <div className="text-[#8b8b8b] text-[14px] mr-10 flex items-center">
          {user?.fname} {user?.lname}{" "}
            <div className="flex ml-2 w-[39px] h-[39px] bg-[#f8f8f8] rounded-lg border-[1px] border-[#fdfdfd] shadow-sm">
            <img
              src={userAvatar}
              className="w-[100%x] h-[100%px] opacity-60 text-[#dbdbdb]"
            ></img>
          </div>
          </div>
        </div>
        <div className=" w-[100%] flex items-center justify-between mt-6 sm:mt-8">
          <div className="text-[13.5px]">Username</div>
          <div className="text-[#8b8b8b] text-[14px] mr-10">{user?.username}</div>
        </div>
        <div className=" w-[100%] flex items-center justify-between mt-6 sm:mt-8">
          <div className="text-[13.5px]">Firstname</div>
          <div className="text-[#8b8b8b] text-[14px] mr-10">{user?.fname}</div>
        </div>
        <div className=" w-[100%] flex items-center justify-between mt-6 sm:mt-8">
          <div className="text-[13.5px]">Lastname</div>
          <div className="text-[#8b8b8b] text-[14px] mr-10">{user?.lname}</div>
        </div>
        <div className="border-b-[1px] border-[#dfdfdf] pb-5 mt-5"></div>
        <div className="mt-3">
          <div
            className="text-[#dc3546] text-[16.3px] cursor-pointer"
            onClick={() => {
              setIsDeleteConfirmOpen(!isDeleteConfirmOpen);
            }}
          >
            Delete account
          </div>
          <div className="text-[#b3b3b3] text-[12.3px] mt-1">
            Permanently delete your account and all of your content.
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Account;
