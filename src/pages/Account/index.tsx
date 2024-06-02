import { useEffect, useState } from "react";
import Wrapper from "../../assets/wrappers/Account";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteAccount from "./ConfirmDeleteAccount";
import { IoArrowBackSharp } from "react-icons/io5";
import { useAppSelector } from "../../app/hooks";
import { AccessTokenPayload } from "../../features/auth/types";
import { jwtDecode } from "jwt-decode";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import userAvatar from "../../assets/images/user-avatar.png";
import getAxiosErrorMessage from "../../utils/getAxiosErrorMessage";

const Account = () => {
  const navigate = useNavigate();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);

  const { token } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profileImage, setProfileImg] = useState<string>("");
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
      setProfileImg(data?.profileUrl)
      console.log(data);
      setUser(data);
    } catch (err: unknown) {
      const msg = await getAxiosErrorMessage(err);
      console.log(msg);
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
      <div className="bg-white py-[2rem] px-[3.1rem] h-fit w-[510px] border-[#f3f3f3] rounded-lg border-[1px] shadow-sm top-[10rem] relative sm:w-[100%] sm:mx-[1rem] sm:px-[2.2rem]">
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
        {isLoading && (
          <div className="w-[100%] flex justify-center items-center h-[200px]">
            <div className="loader w-[40px] h-[40px] border-primary-200 border-b-transparent"></div>
          </div>
        )}
        {!isLoading && (
          <>
            <div className=" w-[100%] flex items-center justify-between mt-6 sm:mt-8">
              <div className="text-[13.5px]">Email address</div>
              <div className="text-[#8b8b8b] text-[14px] mr-10">
                {user?.email}
              </div>
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
                <div className="flex ml-2 w-[39px] h-[39px] bg-[#fff] rounded-lg border-[0px] border-[#fdfdfd]">
                  <img
                    src={profileImage ? profileImage : userAvatar}
                    className={`w-[100%] h-[100%]  text-[#dbdbdb] rounded-lg ${
                      profileImage ? "opacity-100 object-cover object-top" : "opacity-60"
                    }`}
                  ></img>
                </div>
              </div>
            </div>
            <div className=" w-[100%] flex items-center justify-between mt-6 sm:mt-8">
              <div className="text-[13.5px]">Username</div>
              <div className="text-[#8b8b8b] text-[14px] mr-10">
                {user?.username}
              </div>
            </div>
            <div className=" w-[100%] flex items-center justify-between mt-6 sm:mt-8">
              <div className="text-[13.5px]">Firstname</div>
              <div className="text-[#8b8b8b] text-[14px] mr-10">
                {user?.fname}
              </div>
            </div>
            <div className=" w-[100%] flex items-center justify-between mt-6 sm:mt-8">
              <div className="text-[13.5px]">Lastname</div>
              <div className="text-[#8b8b8b] text-[14px] mr-10">
                {user?.lname}
              </div>
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
          </>
        )}
      </div>
    </Wrapper>
  );
};

export default Account;
