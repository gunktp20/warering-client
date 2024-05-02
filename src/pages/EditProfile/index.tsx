import userAvatar from "../../assets/images/user-avatar.png";
import Wrapper from "../../assets/wrappers/EditProfile";
import { useEffect, useState } from "react";
import { FormRow, SnackBar } from "../../components";
import { useAppSelector } from "../../app/hooks";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { AxiosError } from "axios";
import { AccessTokenPayload } from "../../features/auth/types";
import { jwtDecode } from "jwt-decode";
import getAxiosErrorMessage from "../../utils/getAxiosErrorMessage";

const EditProfile = () => {
  const { token } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [showSnackBar, setShowSnackBar] = useState<boolean>(false);
  const [snackBarText, setSnackBarText] = useState<string>("");
  const [snackBarType, setSnackBarType] = useState<
    "error" | "success" | "info" | "warning"
  >("error");
  const [currentProfileImage, setCurrentProfileImage] = useState<string>("");
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
  const onProfileImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      const formData = new FormData();
      formData.append("file", selectedFile);
      try {
        await axiosPrivate.put("/users/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setIsLoading(false);
        setShowSnackBar(true);
        setSnackBarType("success");
        setSnackBarText("Updated your information");
        clearAlert();
        getUserInfo();
        return;
      } catch (err: unknown) {
        const msg = await getAxiosErrorMessage(err);
        setIsChanged(false);
        setShowSnackBar(true);
        setSnackBarType("error");
        setSnackBarText(msg);
        clearAlert();
        return setIsLoading(false);
      }
    }
  };
  const [timeoutIds, setTimeoutIds] = useState<NodeJS.Timeout[]>([]);
  const clearAllTimeouts = () => {
    timeoutIds.forEach((timeoutId: NodeJS.Timeout) => clearTimeout(timeoutId));
    setTimeoutIds([]);
  };
  const [profileImage, setProfileImg] = useState<string>("");

  const clearAlert = () => {
    setIsLoading(true);
    clearAllTimeouts();
    const newTimeoutId = setTimeout(() => {
      setShowSnackBar(false);
    }, 3000);
    setTimeoutIds([newTimeoutId]);
  };
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
      // if (data.profileUrl) {
      //   return getProfileImage(data.profileUrl);
      // }
    } catch (err: unknown) {
      const msg = await getAxiosErrorMessage(err);
      console.log(msg);
      setIsLoading(false);
    }
  };

  const removeProfileImg = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("profileUrl", values?.lastName);
    try {
      await axiosPrivate.put("/users/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setIsLoading(false);
      setShowSnackBar(true);
      setSnackBarType("success");
      setSnackBarText("Deleted your image profile");
      clearAlert();
      getUserInfo();
    } catch (err: unknown) {
      const msg = await getAxiosErrorMessage(err);
      setIsChanged(false);
      console.log(msg);
      setShowSnackBar(true);
      setSnackBarType("error");
      setSnackBarText(msg);
      clearAlert();
      return setIsLoading(false);
    }
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
      setShowSnackBar(true);
      setSnackBarType("success");
      setSnackBarText("Updated your information");
      clearAlert();
      getUserInfo();
    } catch (err: unknown) {
      const msg = await getAxiosErrorMessage(err);
      setIsChanged(false);
      console.log(msg);
      setShowSnackBar(true);
      setSnackBarType("error");
      setSnackBarText(msg);
      clearAlert();
      return setIsLoading(false);
    }
  };

  // const getProfileImage = async (profileUrl: string) => {
  //   const fileName = profileUrl.split("/").pop();
  //   try {
  //     const { data } = await axiosPrivate.get("/users/profile/" + fileName);
  //     console.log(data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

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
      {showSnackBar && (
        <div id="add-device-snackbar" className="block sm:hidden">
          <SnackBar
            id="add-device-snackbar"
            severity={snackBarType}
            showSnackBar={showSnackBar}
            snackBarText={snackBarText}
            setShowSnackBar={setShowSnackBar}
          />
        </div>
      )}
      <div className="bg-white py-[2rem] px-[3.1rem] h-fit w-[510px] border-[#f3f3f3] rounded-lg border-[1px] shadow-sm top-[10rem] absolute">
        <div className="flex justify-start w-[100%] text-[22px] border-b-[1px] border-[#dfdfdf] text-[#1c1c1c] pb-5 font-semibold">
          Profile Information
        </div>
        <div className="text-[14px] mt-5 text-[#7a7a7a]">
          <p>Photo</p>
        </div>
        <div className="flex mt-4 justify-between">
          <div className="flex ml-2 w-[80px] justify-center items-center  bg-[#f8f8f8] rounded-lg border-[1px] border-[#fdfdfd] shadow-sm">
            <img
              src={profileImage ? profileImage : userAvatar}
              className={`w-[80px] h-[80px] text-[#dbdbdb] ${
                profileImage ? "opacity-100 object-cover object-top" : "opacity-60"
              }`}
            ></img>
          </div>
          <div className="flex flex-col">
            <div className="flex gap-8 mb-3">
              <label
                htmlFor="file-upload"
                className="text-[#2e7d32] text-sm cursor-pointer"
              >
                Update
              </label>
              <input
                id="file-upload"
                onChange={onProfileImageChange}
                className="hidden"
                type="file"
              />
              <button
                onClick={removeProfileImg}
                className="text-[#dc3546] text-sm cursor-pointer"
              >
                Remove
              </button>
            </div>
            <div className="text-[#7a7a7a] text-sm w-[270px]">
              Recommended: Square JPG, PNG, or GIF, at least 1,000 pixels per
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
