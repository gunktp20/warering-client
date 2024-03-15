import { useState } from "react";
import Wrapper from "../../assets/wrappers/Account";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteAccount from "./ConfirmDeleteAccount";
import { IoArrowBackSharp } from "react-icons/io5";

const Account = () => {
  const navigate = useNavigate();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);

  return (
    <Wrapper>
      <ConfirmDeleteAccount
        isDeleteConfirmOpen={isDeleteConfirmOpen}
        setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
      />
      <div className="bg-white relative py-[2rem] px-[3.1rem] h-fit w-[610px] top-[7rem] border-[#f3f3f3] rounded-lg border-[1px] shadow-sm sm:w-[100%] sm:px-[1.6rem] sm:mx-[0.5rem]">
      <button
          onClick={() => {
            navigate("/");
          }}
          className="absolute top-[-2.5rem] flex cursor-pointer text-sm text-[#1D4469] font-bold items-center left-0 "
        >
          <IoArrowBackSharp className="text-sm" />
          Back
        </button>
        <div className="text-[2rem] flex justify-start w-[100%] border-b-[1px] border-[#dfdfdf] pb-5">
          Account
        </div>
        <div className=" w-[100%] flex items-center justify-between mt-6 sm:mt-8">
          <div className="text-[14.5px]">Email address</div>
          <div className="text-[#8b8b8b] text-[14px] mr-10">644259003@webmail.npru.ac.th</div>
        </div>
        <div className=" w-[100%] flex items-center justify-between mt-6 sm:mt-8">
          <div className="text-[14.5px]">
            Profile Information
            <div className="text-[11px] text-[#cccccc] mt-1">Edit your photo, name , bio, etc</div>
          </div>
          <div className="text-[#8b8b8b] text-[14px] mr-10 flex items-center">Kuttapat Somwang  <img
          src={
            "https://www.wilsoncenter.org/sites/default/files/media/images/person/james-person-1.jpg"
          }
          className="ml-5 w-[38px] h-[38px] object-cover rounded-lg"
          onClick={() => {

          }}
        ></img></div>
        </div>
        <div className=" w-[100%] flex items-center justify-between mt-6 sm:mt-8">
          <div className="text-[14.5px]">Username</div>
          <div className="text-[#8b8b8b] text-[14px] mr-10">gunktp14</div>
        </div>
        <div className=" w-[100%] flex items-center justify-between mt-6 sm:mt-8">
          <div className="text-[14.5px]">Firstname</div>
          <div className="text-[#8b8b8b] text-[14px] mr-10">Kuttpat</div>
        </div>
        <div className=" w-[100%] flex items-center justify-between mt-6 sm:mt-8">
          <div className="text-[14.5px]">Lastname</div>
          <div className="text-[#8b8b8b] text-[14px] mr-10">Somwang</div>
        </div>
        <div className="border-b-[1px] border-[#dfdfdf] pb-5 mt-5"></div>
        <div className="mt-3">
          <div className="text-[#dc3546] text-[16.3px] cursor-pointer" onClick={()=>{
            setIsDeleteConfirmOpen(!isDeleteConfirmOpen)
          }}>Delete account</div>
          <div className="text-[#cccccc] text-[12.3px] mt-1">Permanently delete your account and all of your content.</div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Account;
