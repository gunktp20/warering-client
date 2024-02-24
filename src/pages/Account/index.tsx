import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const navigate = useNavigate()
  const accountData = {
    img: "https://img.freepik.com/free-psd/3d-illustration-person-with-long-hair_23-2149436197.jpg?w=740&t=st=1708260597~exp=1708261197~hmac=6e04022c7ee16156ca21397efa80e383f0a513a6abc241afc626e3c6774b120d",
    email: "Kruluz_Utsman@gmail.com",
    profileInfo: "KruluzUtsman",
    firstname: "Kruluz_Utsman",
    username: "Kruluz",
    lastname: "Utsman",
    password: "KruluzUtsman21wqq",
  };

  return (
    <div className="flex items-center justify-center h-screen relative shadow-lg">
      <div className="w-[705px] h-[566px] relative bg-white rounded-md shadow-md">
        <button
          onClick={() => {
            navigate("/");
          }}
          className="absolute top-[-2.5rem] flex cursor-pointer text-sm text-[#1D4469] font-bold items-center left-0 "
        >
          <IoArrowBackSharp className="text-sm" />
          Back
        </button>
        <div className="left-[82px] top-[27px] absolute text-black text-[28px] prompt-medium">
          Account
        </div>
        <div className="left-[85px] top-[115px] absolute text-black prompt-regular">
          Email address
        </div>
        <div className="left-[381px] top-[113px] absolute text-neutral-500 prompt-regular">
          {accountData.email}
        </div>
        <div className="left-[83px] top-[166px] absolute text-black prompt-regular">
          Profile information
        </div>
        <div className="left-[83px] top-[194px] absolute text-stone-300 text-xs prompt-regular">
          Edit your photo, name, bio, etc.
        </div>
        <div className="left-[380px] top-[165px] absolute text-neutral-500 prompt-regular">
          KruluzUtsman
        </div>
        <img
          className="w-9 h-[33px] left-[502px] top-[161px] absolute rounded-md"
          src={accountData.img}
        />
        <div className="left-[82px] top-[240px] absolute text-black prompt-regular">
          Firstname
        </div>
        <div className="left-[379px] top-[240px] absolute text-neutral-500 prompt-regular">
          {accountData.firstname}
        </div>
        <div className="left-[83px] top-[288px] absolute text-black prompt-regular">
          Username
        </div>
        <div className="left-[381px] top-[288px] absolute text-neutral-500 prompt-regular">
          {accountData.username}
        </div>
        <div className="left-[82px] top-[339px] absolute text-black prompt-regular">
          Lastname
        </div>
        <div className="left-[381px] top-[339px] absolute text-neutral-500 prompt-regular">
          {accountData.lastname}
        </div>
        <div className="left-[83px] top-[391px] absolute text-black prompt-regular">
          Password
        </div>
        <div className="left-[381px] top-[391px] absolute text-neutral-500 prompt-regular">
          {accountData.password}
        </div>
        <a
          href=""
          className="left-[83px] top-[457px] absolute text-red-500 prompt-regular"
        >
          Delete account
        </a>
        <div className="left-[85px] top-[486px] absolute text-stone-300 text-xs prompt-regular">
          Permanently delete your account and all of your content.
        </div>
        <div className="w-[538.06px] h-[0px] left-[82px] top-[437px] absolute border border-stone-300"></div>
        <div className="w-[538.06px] h-[0px] left-[85px] top-[91px] absolute border border-stone-300"></div>
      </div>
    </div>
  )
}

export default Account