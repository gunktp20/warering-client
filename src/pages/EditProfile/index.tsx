import userAvatar from "../../assets/images/user-avatar.png";
import Wrapper from "../../assets/wrappers/EditProfile";
import { useEffect, useState } from "react";
import { FormRow, SnackBar } from "../../components";
import { useAppSelector } from "../../app/hooks";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { AccessTokenPayload } from "../../features/auth/types";
import { jwtDecode } from "jwt-decode";
import getAxiosErrorMessage from "../../utils/getAxiosErrorMessage";
import CroperDialog from "./CroperDialog";
import { useNavigate } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import useAlert from "../../hooks/useAlert";

const EditProfile = () => {
  const { token } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [showCropingProfile, setShowCropingProfile] = useState<boolean>(false);
  const { showAlert, alertText, alertType, displayAlert } = useAlert();
  const [currentUserInfo, setCurrentUserInfo] = useState<{
    firstName: string;
    lastName: string;
    profileUrl?: string;
  }>({
    firstName: "",
    lastName: "",
    profileUrl: "",
  });
  const [values, setValues] = useState<{
    firstName: string;
    lastName: string;
    profileUrl?: string;
  }>({
    firstName: "",
    lastName: "",
    profileUrl: "",
  });

  const [profileImage, setProfileImg] = useState<string>("");
  const navigate = useNavigate();

  const axiosPrivate = useAxiosPrivate();
  const decoded: AccessTokenPayload | undefined = token
    ? jwtDecode(token)
    : undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const getUserInfo = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosPrivate.get(`/users/${decoded?.sub}`);
      setIsLoading(false);
      setCurrentUserInfo({
        firstName: data?.fname,
        lastName: data?.lname,
        profileUrl: data?.profileUrl,
      });
      setProfileImg(data?.profileUrl);
      setValues({
        firstName: data?.fname,
        lastName: data?.lname,
        profileUrl: data?.profileUrl,
      });
    } catch (err: unknown) {
      const msg = await getAxiosErrorMessage(err);
      console.log(msg);
      setIsLoading(false);
    }
  };

  const removeProfileImg = async () => {
    setIsLoading(true);
    try {
      await axiosPrivate.delete("/users/profile");
      setIsLoading(false);
      getUserInfo();
      return displayAlert({
        msg: "Removed your image profile",
        type: "error",
      });
    } catch (err: unknown) {
      const msg = await getAxiosErrorMessage(err);
      setIsChanged(false);
      setIsLoading(false);
      return displayAlert({
        msg,
        type: "error",
      });
    }
  };

  const onUploadProfileImageSuccess = async () => {
    displayAlert({
      msg: "Your profile picture was uploaded",
      type: "success",
    });
  };

  const onUpdate = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("firstName", values?.firstName);
    formData.append("lastName", values?.lastName);
    try {
      await axiosPrivate.put("/users/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setIsLoading(false);
      getUserInfo();
      return displayAlert({
        msg: "Updated your information",
        type: "success",
      });
    } catch (err: unknown) {
      const msg = await getAxiosErrorMessage(err);
      setIsChanged(false);
      setIsLoading(false);
      return displayAlert({
        msg,
        type: "error",
      });
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    if (
      currentUserInfo?.firstName !== values?.firstName ||
      currentUserInfo?.lastName !== values?.lastName
    ) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [values]);

  return (
    <Wrapper>
      <CroperDialog
        isCroperDialogOpen={showCropingProfile}
        setIsCroperDialogOpen={setShowCropingProfile}
        getUserInfo={getUserInfo}
        onUploadProfileImageSuccess={onUploadProfileImageSuccess}
      />
      {showAlert && (
        <div id="add-device-snackbar" className="block sm:hidden">
          <SnackBar
            id="add-device-snackbar"
            severity={alertType}
            showSnackBar={showAlert}
            snackBarText={alertText}
          />
        </div>
      )}
      <div className="bg-white py-[2rem] px-[3.1rem] h-fit w-[510px] border-[#f3f3f3] rounded-lg border-[1px] shadow-sm top-[10rem] relative sm:w-[100%] sm:mx-[1rem] sm:px-[2.7rem]">
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
          Profile Information
        </div>
        <div className="text-[14px] mt-5 text-[#7a7a7a]">
          <p>Photo</p>
        </div>
        <div className="flex mt-4 justify-between">
          <div className="flex ml-2 w-[80px] justify-center items-center">
            <img
              src={profileImage ? profileImage : userAvatar}
              className={`w-[80px] h-[80px] text-[#dbdbdb] ${
                profileImage
                  ? "opacity-100 object-cover object-top rounded-xl"
                  : "opacity-60"
              }`}
            ></img>
          </div>
          <div className="flex flex-col sm:ml-[10px]">
            <div className="flex gap-8 mb-3">
              <button
                onClick={() => {
                  setShowCropingProfile(true);
                }}
                className="text-[#2e7d32] text-sm cursor-pointer"
              >
                Update
              </button>
              <button
                onClick={removeProfileImg}
                className="text-[#dc3546] text-sm cursor-pointer"
              >
                Remove
              </button>
            </div>
            <div className="text-[#7a7a7a] text-sm w-[270px]">
              Recommended: Square JPG, PNG, or GIF, at least 250 pixels per
              side.
            </div>
          </div>
        </div>

        <div className="w-[100%] mt-11">
          <FormRow
            type="text"
            name="firstName"
            labelText="First name"
            value={values.firstName}
            handleChange={handleChange}
            marginTop="mt-[0.2rem]"
          />
        </div>
        <div className="w-[100%]">
          <FormRow
            type="text"
            name="lastName"
            labelText="Last name"
            value={values.lastName}
            handleChange={handleChange}
            marginTop="mt-[0.2rem] mb-0"
          />
        </div>
        <div className="w-[100%] flex text-primary-300 mt-4 text-[12px] cursor-pointer hover:text-primary-400 transition-all">
          <div>Change Password</div>
        </div>
        <div className="flex mt-5">
          <button
            onClick={onUpdate}
            disabled={!isChanged || !values?.firstName || !values?.lastName}
            className="flex justify-center items-center transition-all bg-primary-500 disabled:bg-primary-100 text-white rounded-md w-[220px] h-[36px]"
          >
            {isLoading ? (
              <div className="loader w-[20px] h-[20px]"></div>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </Wrapper>
  );
};

export default EditProfile;
