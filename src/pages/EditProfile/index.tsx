import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const userData = {
    img: "https://img.freepik.com/free-psd/3d-illustration-person-with-long-hair_23-2149436197.jpg?w=740&t=st=1708260597~exp=1708261197~hmac=6e04022c7ee16156ca21397efa80e383f0a513a6abc241afc626e3c6774b120d",
    firstName: "Kruluz Utsman",
    lastName: "KruluzUtsman",
    password: "KruluzUtsman21wqq",
  };

  const navigate = useNavigate()
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-[597px] h-[614px] relative bg-white rounded-lg border">
        <button
          onClick={() => {
            navigate("/");
          }}
          className="absolute top-[-2.5rem] flex cursor-pointer text-sm text-[#1D4469] font-bold items-center left-0 "
        >
          <IoArrowBackSharp className="text-sm" />
          Back
        </button>
        <div className="left-[50px] top-[30px] absolute prompt-medium text-[24px]">
          Profile Information
        </div>
        <div className="left-[51px] top-[95px] absolute prompt-regular text-gray-500">
          Photo
        </div>
        <img
          className="w-[89px] h-[87px] left-[69px] top-[134px] absolute rounded-xl"
          src={userData.img}
          alt="User Photo"
        />
        <input type="file" id="fileInput" style={{ display: "none" }} />

        <a
          href="#"
          className="left-[200px] top-[134px] absolute text-green-700 prompt-regular"
          onClick={() => {

          }}
        >
          Update
        </a>

        <a
          href=""
          className="left-[284px] top-[134px] absolute prompt-regular text-red-800"
        >
          Remove
        </a>
        <div className="w-[354px] left-[201px] top-[175px] absolute prompt-regular text-gray-500">
          Recommended: Square JPG, PNG, or GIF, at least 1,000 pixels per side.
        </div>
        <div className="w-[487px] h-[68px] left-[55px] top-[275px] absolute">
          <label htmlFor="firstName" className="left-0 top-0 absolute">
            <span className="text-cyan-900 prompt-regular">First Name </span>
            <span className="text-red-500 prompt-regular">*</span>
          </label>
        </div>
        <div className="w-[487px] h-[68px] left-[55px] top-[315px] absolute">
          <div className="">
            <label id="firstName" className="text-black prompt-regular">
              {userData.firstName}
            </label>
            <div className="self-stretch h-px relative box-border border-t-[1px] border-solid border-primary-gray" />
          </div>
          <div className="h-6 w-0 relative inline-block ml-[-487px]" />
        </div>

        <div className="w-[487px] h-[68px] left-[55px] top-[375px] absolute">
          <label htmlFor="lastname" className="left-0 top-0 absolute">
            <span className="text-cyan-900 prompt-regular">Last Name </span>
            <span className="text-red-500 prompt-regular">*</span>
          </label>
        </div>
        <div className="w-[487px] h-[68px] left-[55px] top-[415px] absolute">
          <div className="">
            <label id="lastName" className="text-black prompt-regular">
              {userData.lastName}
            </label>
            <div className="self-stretch h-px relative box-border border-t-[1px] border-solid border-primary-gray" />
          </div>
          <div className="h-6 w-0 relative inline-block ml-[-487px]" />
        </div>
        <div className="w-[487px] h-[68px] left-[55px] top-[465px] absolute">
          <label htmlFor="password" className="left-0 top-0 absolute">
            <span className="text-cyan-900 prompt-regular">Password </span>
            <span className="text-red-500 prompt-regular">*</span>
          </label>
        </div>
        <div className="w-[487px] h-[68px] left-[55px] top-[500px] absolute">
          <div className="">
            <label id="password" className="text-black prompt-regular">
              {userData.password}
            </label>
            <div className="self-stretch h-px relative box-border border-t-[1px] border-solid border-primary-gray" />
          </div>
        </div>
        <div className="w-[141px] h-11 p-2.5 left-[261px] top-[540px] absolute rounded border border-green-700 justify-center items-center gap-2.5 inline-flex">
          <button className="text-green-800 prompt-regular">Cancel</button>
        </div>
        <div className="w-[141px] h-11 p-2.5 right-[30px] top-[540px] absolute bg-green-700 rounded justify-center items-center gap-2.5 inline-flex">
          <button className="text-white prompt-regular">Save</button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
